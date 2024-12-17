import React, { useCallback, useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import "@arcgis/core/assets/esri/themes/light/main.css";

interface NewPropertyMapProps {
  onSaveSelectedLocation: (longitude: number, latitude: number) => void;
}

const NewPropertyMap: React.FC<NewPropertyMapProps> = ({
  onSaveSelectedLocation,
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
      center: [106.699878, 10.778772], // Center the map (longitude, latitude)
      zoom: 10,
    });

    // Change the cursor to "crosshair" with a dot when hovering over the map
    view.container.style.cursor = "crosshair";

    // Handle the map's click event
    view.on("click", (event) => {
      const { longitude, latitude } = event.mapPoint;
      locationSelectHandler(longitude, latitude);

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
  }, []);

  return <div ref={mapDiv} style={{ height: "512px", width: "100%" }}></div>;
};

export default NewPropertyMap;
