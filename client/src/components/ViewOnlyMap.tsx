import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import "@arcgis/core/assets/esri/themes/light/main.css";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Polygon from "@arcgis/core/geometry/Polygon";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Color from "@arcgis/core/Color";
import wards from "../data/wards";
import districts from "../data/districts";
import "react-toggle/style.css";
import Toggle from "react-toggle";

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

  interface Listing {
    name: string;
    map: string;
    address: string;
    description: string;
    longitude: number;
    latitude: number;
    type: string;
  }

  const [listings, setListings] = useState<Listing[]>();
  const [selectedOption, setSelectedOption] = useState("0");
  const [showPolygon, setShowPolygon] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listing/get");
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchListings();
  }, []);

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
      highlightOptions: {
        color: new Color([0, 255, 0, 0.5]),
      },
    });

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    const pointTemplate =
      selectedOption === "1"
        ? { title: "{District}, {Province}", content: "Việt Nam" }
        : {
            title: "{Ward}",
            content: "{District}, {Province}",
          };

    const polygons = selectedOption === "1" ? districts : wards;

    polygons.forEach((polygon) => {
      const graphic = new Graphic({
        geometry: new Polygon({
          rings: polygon.rings,
        }),
        symbol: polygon.symbol,
        attributes: {
          Ward: polygon.ward,
          District: polygon.district,
          Province: polygon.province,
        },
        popupTemplate: pointTemplate,
      });
      if (showPolygon) {
        graphicsLayer.add(graphic);
      }
    });

    for (const listing of listings || []) {
      const pointGraphic = new Graphic({
        geometry: new Point({
          longitude: listing.longitude,
          latitude: listing.latitude,
        }),
        symbol: {
          type: "picture-marker", // Use a picture as  the marker symbol
          url:
            listing.type === "sale"
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
          name: listing.name, // Title for the popup
          description: listing.address,
        },
        popupTemplate: {
          title: "{name}",
          content: "{description}",
        },
      });
      view.graphics.add(pointGraphic);
    }

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
  }, [
    longitude,
    latitude,
    zoom,
    iconUrl,
    title,
    description,
    listings,
    selectedOption,
    showPolygon,
  ]);

  return (
    <>
      <div className="mt-4 mb-2 flex flex-col gap-4">
        <div className="flex items-center gap-8">
          <select
            className="text-sm block w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="0" disabled={!showPolygon}>
              Hiển thị theo
            </option>
            <option value="1" disabled={!showPolygon}>
              Quận/Huyện
            </option>
            <option value="2">Phường/Xã</option>
          </select>
          <div className="flex items-center mt-2 gap-4">
            <Toggle
              id="show-polygon"
              defaultChecked={showPolygon}
              onChange={() => setShowPolygon((prevState) => !prevState)}
            />
            <label htmlFor="show-polygon" className="mt-1">
              Hiển thị khu vực
            </label>
          </div>
        </div>
        <div className="mt-2">
          <h2 className="text-lg font-semibold">Biểu tượng</h2>
          <div className="flex items-center mt-2 gap-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1206/1206312.png"
              alt="Nhà đất bán"
              className="w-6 h-6"
            />
            <div className="mt-1">Nhà đất bán</div>
          </div>
          <div className="flex items-center mt-2 gap-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1299/1299961.png"
              alt="Nhà đất bán"
              className="w-6 h-6"
            />
            <div className="mt-1">Nhà cho thuê</div>
          </div>
        </div>
      </div>
      <div ref={mapDiv} style={{ height: "512px", width: "100%" }}></div>
    </>
  );
};

export default ViewOnlyMap;
