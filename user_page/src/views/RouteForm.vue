<template>
  <div>
    <div class="route-form">
      <h1>Select Your Route</h1>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="route-id">Route ID:</label>
          <select id="route-id" v-model="selectedRouteId" @change="handleRouteChange">
            <option value="" disabled>Select a route ID</option>
            <option v-for="route in routes" :key="route.route_id" :value="route.route_id">
              {{ route.route_id }}
            </option>
          </select>
        </div>

        <div>
          <label for="source">Source:</label>
          <select id="source" v-model="selectedSource" @change="handleSearch">
            <option value="" disabled>Select a source</option>
            <option v-for="source in sourceOptions" :key="source" :value="source">
              {{ source }}
            </option>
          </select>
        </div>

        <div>
          <label for="destination">Destination:</label>
          <select id="destination" v-model="selectedDestination" @change="handleSearch">
            <option value="" disabled>Select a destination</option>
            <option v-for="destination in destinationOptions" :key="destination" :value="destination">
              {{ destination }}
            </option>
          </select>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>

    <div v-if="selectedSchedule.length > 0" class="schedule-container">
      <h2>Bus Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Stop Sequence</th>
            <th>Stop Name</th>
            <th>Arrival Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(stop, index) in selectedSchedule" :key="index">
            <td>{{ stop.stop_sequence }}</td>
            <td>{{ stop.stop_name }}</td>
            <td>{{ stop.arrival_time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Papa from "papaparse";

export default {
  name: "RouteForm",
  data() {
    return {
      routes: [],
      selectedRouteId: "",
      selectedSource: "",
      selectedDestination: "",
      sourceOptions: [],
      destinationOptions: [],
      selectedSchedule: [],
    };
  },
  methods: {
    fetchRoutes() {
      const csvUrl = "/final.csv";
      console.log("Fetching CSV data from:", csvUrl);

      Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: (results) => {
          console.log("Parsing complete:", results.data);
          const data = results.data.filter((row) => row.route_id);

          // Process data to extract source and destination
          const groupedRoutes = data.reduce((acc, row) => {
            if (!acc[row.route_id]) {
              acc[row.route_id] = { route_id: row.route_id, stops: [] };
            }

            // Check if the stop is already in the array
            if (!acc[row.route_id].stops.some((stop) => stop.stop_name === row.stop_name)) {
              acc[row.route_id].stops.push({
                stop_sequence: parseInt(row.stop_sequence),
                stop_name: row.stop_name,
                arrival_time: row.arrival_time,
              });
            }

            return acc;
          }, {});

          // Map the grouped routes to include source and destination
          this.routes = Object.values(groupedRoutes).map((route) => {
            const sortedStops = route.stops.sort(
              (a, b) => a.stop_sequence - b.stop_sequence
            );
            return {
              route_id: route.route_id,
              source: sortedStops[0].stop_name,
              destination: sortedStops[sortedStops.length - 1].stop_name,
              schedule: sortedStops,
              stops: sortedStops.map((stop) => stop.stop_name),
            };
          });

          // Populate the source and destination options
          this.sourceOptions = [...new Set(this.routes.map((route) => route.source))];
          this.destinationOptions = [...new Set(this.routes.map((route) => route.destination))];
        },
      });
    },

    handleRouteChange() {
      console.log(`Selected Route ID: ${this.selectedRouteId}`);
      const selectedRoute = this.routes.find(
        (route) => route.route_id === this.selectedRouteId
      );

      if (selectedRoute) {
        this.selectedSource = selectedRoute.source;
        this.selectedDestination = selectedRoute.destination;
        this.selectedSchedule = selectedRoute.schedule;
      }
    },

    handleSearch() {
      console.log(
        "Searching for route with source:",
        this.selectedSource,
        "and destination:",
        this.selectedDestination
      );

      const matchingRoutes = this.routes.filter(
        (route) =>
          route.source.toLowerCase().includes(this.selectedSource.toLowerCase()) &&
          route.destination.toLowerCase().includes(this.selectedDestination.toLowerCase())
      );

      if (matchingRoutes.length === 1) {
        const selectedRoute = matchingRoutes[0];
        this.selectedRouteId = selectedRoute.route_id;
        this.selectedSource = selectedRoute.source;
        this.selectedDestination = selectedRoute.destination;
        this.selectedSchedule = selectedRoute.schedule;
      } else {
        this.selectedSchedule = [];
      }
    },

    handleSubmit() {
      alert(
        `Selected Route ID: ${this.selectedRouteId}\nSource: ${this.selectedSource}\nDestination: ${this.selectedDestination}`
      );
    },
  },

  mounted() {
    this.fetchRoutes();
  },
};
</script>
  
  <style scoped> 
  .route-form {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .route-form h1 {
    text-align: center;
    color: #333;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  
  .route-form select {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    margin-bottom: 1.2rem;
  }
  
  .route-form select:focus {
    border-color: #007bff;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
    outline: none;
  }
  
  .route-form button {
    display: block;
    width: 100%;
    padding: 0.9rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
  }
  
  .route-form button:hover {
    background-color: #0056b3;
    transform: scale(1.02);
  }
  
  .route-form button:active {
    background-color: #004085;
    transform: scale(0.98);
  }
  
  .schedule-container {
    color: #333;
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .schedule-container h2 {
    font-size: 1.6rem;
    color: #333;
    margin-bottom: 1rem;
  }
  
  .schedule-container table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .schedule-container th,
  .schedule-container td {
    padding: 0.8rem;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  .schedule-container th {
    background-color: #f4f4f4;
  }
  
  .schedule-container tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  .schedule-container tr:hover {
    background-color: #e9e9e9;
  }
  
  @media (max-width: 480px) {
    .route-form {
      padding: 1.5rem;
    }
  
    .route-form h1 {
      font-size: 1.5rem;
    }
  
    .route-form button {
      font-size: 1rem;
    }
  }
  </style>
  