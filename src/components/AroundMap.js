import React, { Component } from "react";
import { POS_KEY } from "../constants";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

class NormalAroundMap extends Component {
  getMapRef = (mapInstance) => {
    this.map = mapInstance;
    window.map = mapInstance;
  };

  reloadMarker = () => {
    const center = this.getCenter();
    const radius = this.getRadius();
    this.props.loadPostsByTopic(center, radius);
  };

  getCenter() {
    const center = this.map.getCenter();
    return { lat: center.lat(), lon: center.lng() };
  }

  getRadius() {
    const center = this.map.getCenter();
    const bounds = this.map.getBounds();
    if (center && bounds) {
      const ne = bounds.getNorthEast();
      const right = new window.google.maps.LatLng(center.lat(), ne.lng());
      return (
        0.001 *
        window.google.maps.geometry.spherical.computeDistanceBetween(
          center,
          right
        )
      );
    }
  }

  render() {
    const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
    return (
      <GoogleMap
        onLoad={this.getMapRef}
        defaultZoom={11}
        defaultCenter={{ lat, lng: lon }}
        onDragEnd={this.reloadMarker}
        onZoomChanged={this.reloadMarker}
      ></GoogleMap>
    );
  }
}

const AroundMap = (props) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your API key
    libraries: ["geometry"], // Include necessary libraries
  });

  if (!isLoaded) return <div>Loading...</div>;

  return <NormalAroundMap {...props} />;
};

export default AroundMap;
