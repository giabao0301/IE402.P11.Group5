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

    if (latitude && longitude) {
      const pointGraphic = new Graphic({
        geometry: new Point({
          longitude: longitude,
          latitude: latitude,
        }),
        symbol: {
          type: "picture-marker", // Use a picture as  the marker symbol
          url:
            type === "sale"
              ? "https://cdn-icons-png.flaticon.com/512/1206/1206312.png"
              : "https://cdn-icons-png.flaticon.com/512/1299/1299961.png", // URL of the custom icon
          width: "24px", // Width of the icon
          height: "24px", // Height of the icon
          outline: {
            color: [255, 0, 0, 0.5], // White outline
            width: 1, // Outline width
          },
        } as __esri.PictureMarkerSymbolProperties, // Explicit cast to correct type
        attributes: {
          name: title, // Title for the popup
          description: description, // Description for the popup
        },
        popupTemplate: {
          title: "{name}",
          content: "{description}",
        },
      });
      view.graphics.add(pointGraphic);
    }

    if (coordinates?.latitude && coordinates?.longitude) {
      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      const filteredPolygons = wards.filter(
        (polygon) =>
          polygon.ward === ward &&
          polygon.district === district &&
          polygon.province === province
      );

      if (filteredPolygons.length === 0) {
        return;
      }

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

      // Add the marker to the map view
      view.goTo({
        center: [coordinates.longitude, coordinates.latitude],
      });
    }

    // Change the cursor to "crosshair" with a dot when hovering over the map
    view.container.style.cursor = "crosshair";

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    view.on("click", (event) => {
      const { longitude, latitude } = event.mapPoint;
      locationSelectHandler(longitude, latitude);

      // Create a marker symbol using SimpleMarkerSymbol
      const markerSymbol = new SimpleMarkerSymbol({
        style: "x",
        color: "red", // Marker color
        size: "12px", // Marker size
        outline: {
          color: "red",
          width: 1,
        },
      });

      // Create a marker graphic
      const marker = new Graphic({
        geometry: new Point({
          longitude: longitude,
          latitude: latitude,
        }),
        symbol: markerSymbol,
      });

      // Clear existing graphics and add the new marker

      graphicsLayer.removeAll();
      graphicsLayer.add(marker);

      // Pan to the selected location
      view.goTo(
        {
          center: [longitude, latitude], // New center
        },
        { duration: 500 }
      );
    });

    return () => {
      view.destroy(); // Cleanup the view when the component is unmounted
    };
  }, [coordinates?.latitude, coordinates?.longitude]);

  return <div ref={mapDiv} style={{ height: "512px", width: "100%" }}></div>;
};

export default NewPropertyMap;
