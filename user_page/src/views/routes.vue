<template>
  <div>
    <h1>Bus Stops Finder</h1>

    <!-- Input for Route ID -->
    <div>
      <label for="routeId">Enter Route ID:</label>
      <input type="number" v-model="routeId" id="routeId" placeholder="Enter route ID" />
      <button @click="fetchStops">Get Stops</button>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading">Loading...</div>

    <!-- Error Message -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Display Map and Stops -->
    <div v-if="stops.length">
      <h2>Stops for Route ID: {{ routeId }}</h2>
      <div id="map" class="map-container"></div>

      <!-- Display All Stops Names -->
      <div class="stops-list">
        <h3>List of Stops:</h3>
        <ul>
          <li v-for="stop in stops" :key="stop.stop_id">
            {{ stop.stop_name }} (ID: {{ stop.stop_id }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  data() {
    return {
      routeId: null, // Input for route ID
      stops: [], // Array to store stops data
      loading: false, // Loading state
      error: "", // Error message
      map: null, // Map instance
      markers: [], // Array of map markers
      polyline: null, // Route polyline
    };
  },
  methods: {
    async fetchStops() {
      // Reset states
      this.error = "";
      this.stops = [];
      if (!this.routeId) {
        this.error = "Please enter a valid route ID.";
        return;
      }

      this.loading = true;
      try {
        // Fetch stops from the API
        const response = await axios.get(
          `https://gtfs-7908.onrender.com/api/stops`,
          { params: { route_id: this.routeId } }
        );
        this.stops = response.data;

        // Wait for the DOM to render the map container, then plot the stops
        this.$nextTick(() => {
          this.plotStopsOnMap();
        });
      } catch (err) {
        this.error = err.response?.data?.error || "An error occurred while fetching stops.";
      } finally {
        this.loading = false;
      }
    },

    initializeMap() {
      // Initialize the map if not already initialized
      if (!this.map) {
        this.map = L.map("map").setView([28.6139, 77.209], 12); // Centered on Delhi

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);
      }
    },

    plotStopsOnMap() {
      this.initializeMap();

      // Clear previous markers and polyline
      if (this.markers.length) {
        this.markers.forEach((marker) => this.map.removeLayer(marker));
        this.markers = [];
      }
      if (this.polyline) {
        this.map.removeLayer(this.polyline);
      }

      const customIcon = L.icon({
        iconUrl: "/assets/ICON.png", // Path to your PNG file
        iconSize: [32, 32], // Size of the icon [width, height]
        iconAnchor: [16, 32], // Point of the icon that corresponds to marker's location
        popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
      });

      // Plot markers for stops
      const coordinates = [];
      this.stops.forEach((stop) => {
        const marker = L.marker([stop.stop_lat, stop.stop_lon], { icon: customIcon }).addTo(this.map);
        marker.bindPopup(`<strong>${stop.stop_name}</strong><br>ID: ${stop.stop_id}`);
        this.markers.push(marker);
        coordinates.push([stop.stop_lat, stop.stop_lon]);
      });

      // Draw route polyline
      if (coordinates.length) {
        this.polyline = L.polyline(coordinates, { color: "blue" }).addTo(this.map);
        this.map.fitBounds(this.polyline.getBounds());
      }
    },
  },
};
</script>

<style>
.map-container {
  width: 100%;
  height: 500px;
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.error {
  color: red;
  margin-top: 10px;
}

.stops-list {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  color: #333;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.stops-list ul {
  list-style-type: none;
  padding: 0;
}
.stops-list li {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}
.stops-list li:last-child {
  border-bottom: none;
}
</style>
