import React, { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import "@arcgis/core/assets/esri/themes/light/main.css";

interface ViewOnlyMapProps {
  title: string;
  description: string;
  longitude: number;
  latitude: number;
  zoom?: number; // Optional zoom level (default: 13)
  iconUrl: string; // URL of the custom icon
}

const ViewOnlyMap: React.FC<ViewOnlyMapProps> = ({
  title,
  description,
  longitude,
  latitude,
  zoom = 13,
  iconUrl,
}) => {
  const mapDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapDiv.current) return;

    const map = new Map({
      basemap: "streets-navigation-vector", // Basemap type
    });

    const view = new MapView({
      container: mapDiv.current,
      map: map,
      center: [longitude, latitude], // Center of the map [longitude, latitude]
      zoom: zoom,
    });

    // Add a marker with a custom image icon
    const pointGraphic = new Graphic({
      geometry: new Point({
        longitude,
        latitude,
      }),
      symbol: {
        type: "picture-marker", // Use a picture as the marker symbol
        url: iconUrl, // URL of the custom icon
        width: "32px", // Width of the icon
        height: "32px", // Height of the icon
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

    // Add the marker to the map view
    view.graphics.add(pointGraphic);

    // Enable clicking on the map for non-graphic locations
    view.on("click", (event) => {
      view.hitTest(event).then((response) => {
        // Check if the click intersects with a graphic
        const result = response.results.find(
          (result) => (result as __esri.GraphicHit).graphic
        ) as __esri.GraphicHit | undefined;

        if (!result?.graphic) {
          // If no graphic was clicked, show coordinates
          view.popup.open({
            location: event.mapPoint,
            title: "Map Clicked",
            content: `Coordinates: ${event.mapPoint.latitude.toFixed(
              5
            )}, ${event.mapPoint.longitude.toFixed(5)}`,
          });
        }
      });
    });

    return () => {
      view.destroy(); // Cleanup the map view
    };
  }, [longitude, latitude, zoom, iconUrl, title, description]);

  return <div ref={mapDiv} style={{ height: "512px", width: "100%" }}></div>;
};

export default ViewOnlyMap;
