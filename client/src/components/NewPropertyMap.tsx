import React, { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import "@arcgis/core/assets/esri/themes/light/main.css";
import { notInitialized } from "react-redux/es/utils/useSyncExternalStore";

interface NewPropertyMapProps {
  onSaveSelectedLocation: (longitude: number, latitude: number) => void;
  coordinates?: { longitude: number; latitude: number };
}

const NewPropertyMap: React.FC<NewPropertyMapProps> = ({
  onSaveSelectedLocation,
  coordinates,
}) => {
  const locationSelectHandler = (longitude: number, latitude: number) => {
    onSaveSelectedLocation(longitude, latitude);
  };

  console.log(coordinates);
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
      zoom: 15,
    });

    if (coordinates?.latitude && coordinates?.longitude) {
      view.goTo(
        {
          center: [coordinates.longitude, coordinates.latitude],
        },
        { duration: 500 }
      );
    }

    // Change the cursor to "crosshair" with a dot when hovering over the map
    view.container.style.cursor = "crosshair";

    // Handle the map's click event
    view.on("click", (event) => {
      const { longitude, latitude } = event.mapPoint;
      locationSelectHandler(longitude, latitude);

      // Create a marker symbol using SimpleMarkerSymbol
      const markerSymbol = new SimpleMarkerSymbol({
        style: "circle",
        color: "red", // Marker color
        size: "12px", // Marker size
        outline: {
          color: "white",
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
      view.graphics.removeAll();
      view.graphics.add(marker);

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
