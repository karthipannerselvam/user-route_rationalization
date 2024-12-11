<template>
  <div>
    <div class="route-form">
      <h1>Select Your Route</h1>
      <form @submit.prevent="handleSubmit">
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
      <h2>Matching Buses</h2>
      <table>
        <thead>
          <tr>
            <th>Bus Id</th>
            <th>Stop Sequence</th>
            <th>Stop Name</th>
            <th>Arrival Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(stop, index) in selectedSchedule" :key="index">
            <td>{{ stop.bus_id }}</td>
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
      selectedSource: "",
      selectedDestination: "",
      sourceOptions: [],
      destinationOptions: [],
      selectedSchedule: [],
    };
  },
  methods: {
    fetchRoutes() {
      const csvUrl = "/output.csv";

      Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: (results) => {
          const data = results.data.filter((row) => row.route_id);

          // Process data to group by route_id
          const groupedRoutes = data.reduce((acc, row) => {
            if (!acc[row.route_id]) {
              acc[row.route_id] = { route_id: row.route_id, stops: [] };
            }
            acc[row.route_id].stops.push({
              stop_sequence: parseInt(row.stop_sequence),
              stop_name: row.stop_name,
              arrival_time: row.arrival_time,
              bus_id: row.bus_name,
            });
            return acc;
          }, {});

          // Map routes and sort stops by sequence
          this.routes = Object.values(groupedRoutes).map((route) => {
            const sortedStops = route.stops.sort(
              (a, b) => a.stop_sequence - b.stop_sequence
            );
            return {
              route_id: route.route_id,
              schedule: sortedStops,
              stops: sortedStops.map((stop) => stop.stop_name),
            };
          });

          // Populate source and destination options
          const allStops = data.map((row) => row.stop_name);
          this.sourceOptions = [...new Set(allStops)];
          this.destinationOptions = [...new Set(allStops)];
        },
      });
    },

    handleSearch() {
      if (!this.selectedSource || !this.selectedDestination) {
        this.selectedSchedule = [];
        return;
      }

      const matchingRoutes = this.routes.filter((route) => {
        const sourceIndex = route.stops.indexOf(this.selectedSource);
        const destinationIndex = route.stops.indexOf(this.selectedDestination);
        return sourceIndex !== -1 && destinationIndex !== -1 && sourceIndex < destinationIndex;
      });

      // Flatten schedule for matching buses
      this.selectedSchedule = matchingRoutes.flatMap((route) =>
        route.schedule.filter((stop) =>
          stop.stop_name === this.selectedSource || stop.stop_name === this.selectedDestination
        )
      );
    },

    handleSubmit() {
      alert(
        `Source: ${this.selectedSource}\nDestination: ${this.selectedDestination}\nMatching Buses: ${this.selectedSchedule.length}`
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
  