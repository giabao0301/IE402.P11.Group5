import React, { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import "@arcgis/core/assets/esri/themes/light/main.css";
import { notInitialized } from "react-redux/es/utils/useSyncExternalStore";
import districts from "../data/districts";
import wards from "../data/wards";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Polygon from "@arcgis/core/geometry/Polygon";

interface NewPropertyMapProps {
  onSaveSelectedLocation: (longitude: number, latitude: number) => void;
  coordinates?: { longitude: number; latitude: number };
  title?: string;
  description?: string;
  district?: string;
  ward?: string;
  province?: string;
  longitude?: number;
  type?: string;
  latitude?: number;
}

const NewPropertyMap: React.FC<NewPropertyMapProps> = ({
  onSaveSelectedLocation,
  coordinates,
  title,
  description,
  type,
  district,
  ward,
  province,
  longitude,
  latitude,
}) => {
  const locationSelectHandler = (longitude: number, latitude: number) => {
    onSaveSelectedLocation(longitude, latitude);
  };

  const mapDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapDiv.current) return;

    const map = new Map({
      basemap: "streets-navigation-vector", // Basemap type
    });

    const view = new MapView({
      container: mapDiv.current,
      map: map,
      center: [
        coordinates?.longitude || 106.699878,
        coordinates?.latitude || 10.778772,
      ],
      zoom: 14,
    });

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    // Add point graphic if latitude and longitude are provided
    if (latitude && longitude) {
      const pointGraphic = new Graphic({
        geometry: new Point({
          longitude: longitude,
          latitude: latitude,
        }),
        symbol: {
          type: "picture-marker",
          url:
            type === "sale"
              ? "https://cdn-icons-png.flaticon.com/512/1206/1206312.png"
              : "https://cdn-icons-png.flaticon.com/512/1299/1299961.png",
          width: "24px",
          height: "24px",
        } as __esri.PictureMarkerSymbolProperties,
        attributes: {
          name: title,
          description: description,
        },
        popupTemplate: {
          title: "{name}",
          content: "{description}",
        },
      });
      view.graphics.add(pointGraphic);
    }

    // Add polygons for filtered areas
    if (coordinates?.latitude && coordinates?.longitude) {
      const filteredPolygons = wards.filter(
        (polygon) =>
          polygon.ward === ward &&
          polygon.district === district &&
          polygon.province === province
      );

      if (filteredPolygons.length > 0) {
        filteredPolygons.forEach((polygon) => {
          const graphic = new Graphic({
            geometry: new Polygon({
              rings: polygon.rings,
            }),
            symbol: polygon.symbol,
            attributes: {
              Ward: polygon.ward,
            },
          });
          graphicsLayer.add(graphic);
        });

        view.goTo({
          center: [coordinates.longitude, coordinates.latitude],
        });
      }
    }

    // Change cursor style
    view.container.style.cursor = "crosshair";

    // Click handler for adding markers
    const handleClick = (event: __esri.ViewClickEvent) => {
      const { longitude, latitude } = event.mapPoint;
      locationSelectHandler(longitude, latitude);

      const markerSymbol = new SimpleMarkerSymbol({
        style: "x",
        color: "red",
        size: "12px",
        outline: {
          color: "red",
          width: 1,
        },
      });

      const marker = new Graphic({
        geometry: new Point({
          longitude: longitude,
          latitude: latitude,
        }),
        symbol: markerSymbol,
      });

      graphicsLayer.removeAll();
      graphicsLayer.add(marker);

      view.goTo(
        {
          center: [longitude, latitude],
        },
        { duration: 500 }
      );
    };

    view.on("click", handleClick);

    return () => {
      view.destroy(); // Cleanup view
    };
  }, [coordinates?.latitude, coordinates?.longitude]);

  return <div ref={mapDiv} style={{ height: "512px", width: "100%" }}></div>;
};

export default NewPropertyMap;
