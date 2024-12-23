<template>
  <div>
   
    <h2>Nearby Bus Stops and Stations</h2>
    <div class="back-arrow" @click="$router.push('/')">
        <i class="fa fa-arrow-left"></i>
         </div>
    <div id="map"></div>

    <div v-if="busStops.length">
      <h3>Available Bus Stops Nearby:</h3>
      <ul>
        <li v-for="stop in busStops" :key="stop.id">
          {{ stop.name }} ({{ stop.distance.toFixed(2) }} km away)
        </li>
      </ul>
    </div>

    <p v-else>No bus stops found nearby.</p>
  </div>
</template>

<script>
import topbar from '../components/topbar.vue';
export default {
name: "NearbyBuses",
components:{
  topbar
},
data() {
  return {
    map: null,
    userMarker: null,
    busStops: [],
    userLocation: null,
    radiusCircle: null,
    radius: 5000,
    directionsService: null, // For calculating directions
    directionsRenderer: null, // For rendering directions
  };
},
methods: {
  // Initialize Google Map
  initializeMap() {
    const defaultLocation = { lat: 28.6139, lng: 77.209 };

    // Create a new map instance
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: defaultLocation,
      zoom: 12,
      streetViewControl: false,
      mapTypeControl: false,
    });

    // Add Transit Layer for public transit routes
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(this.map);

    // Initialize Directions service and renderer
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          this.map.setCenter(this.userLocation);

          this.userMarker = new google.maps.Marker({
            position: this.userLocation,
            map: this.map,
            title: "You are here!",
          });

          this.showRadiusCircle(this.userLocation);
          this.fetchNearbyBusStops(this.userLocation);
        },
        () => {
          alert("Failed to get your location. Showing default location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  },

  // Show the radius circle
  showRadiusCircle(userLocation) {
    if (this.radiusCircle) {
      this.radiusCircle.setMap(null);
    }

    this.radiusCircle = new google.maps.Circle({
      map: this.map,
      center: userLocation,
      radius: this.radius,
      strokeColor: "#8298C4",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#8298C4",
      fillOpacity: 0.35,
    });
  },

  // Fetch nearby bus stops
  fetchNearbyBusStops(userLocation) {
    const service = new google.maps.places.PlacesService(this.map);
    const request = {
      location: userLocation,
      radius: this.radius,
      type: ['bus_station'],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.busStops = results.map((place) => {
          const distance = this.calculateDistance(
            userLocation.lat,
            userLocation.lng,
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );

          const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            title: place.name,
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new google.maps.Size(32, 32),
            },
          });

          // Add click listener to show directions
          marker.addListener("click", () => {
            this.showDirections(place.geometry.location);
          });

          return {
            id: place.place_id,
            name: place.name,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            distance: distance,
          };
        });
      } else {
        console.error("Error fetching nearby bus stops:", status);
      }
    });
  },

  // Show directions to a specific location
  showDirections(destination) {
    if (!this.userLocation) {
      alert("User location is not available.");
      return;
    }

    const request = {
      origin: this.userLocation,
      destination: destination,
      travelMode: google.maps.TravelMode.WALKING, // Choose the travel mode (WALKING, DRIVING, etc.)
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error("Directions request failed:", status);
      }
    });
  },

  // Calculate the distance between two locations
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLng = this.degreesToRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  },

  // Convert degrees to radians
  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  },
},
mounted() {
  const googleMapScript = document.createElement("script");
  googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyASVumvOham_3QJYVeAnie4agq-Id8spG0&libraries=places&callback=initMap`;
  googleMapScript.async = true;
  googleMapScript.defer = true;

  window.initMap = this.initializeMap;

  document.head.appendChild(googleMapScript);
},
};

</script>

<style scoped>
/* Styling the map container */
html, body {
height: 100%;
margin: 0;
padding: 0;
}
.back-arrow {
  font-size: 24px; /* Adjusts the size of the icon */
  cursor: pointer; /* Changes the cursor to a pointer to indicate interactivity */
  color: #2d2d2d; /* Default color for the back arrow */
  position: absolute; /* Ensures it stays in a fixed spot relative to the container */
  top: 20px; /* Distance from the top */
  left: 20px; /* Distance from the left */
  z-index: 100; /* Ensures it stays above other elements */
  background-color: #ffffff; /* Adds a background to make it stand out */
  border-radius: 50%; /* Makes it circular */
  padding: 10px; /* Adds spacing around the icon */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Adds a subtle shadow for depth */
  transition: color 0.3s, background-color 0.3s, box-shadow 0.3s; /* Smooth transition for hover effects */
}

.back-arrow:hover {
  color: #ffffff; /* Changes the icon color on hover */
  background-color: #8298C4; /* Changes the background color on hover */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Increases the shadow for a pop effect */
}

#map {
height: 500px; /* Fill the height of the parent container */
width: 100%;  /* Full width */
}

/* Page title styling */
h2 {
text-align: center;
color: #333;
font-family: Arial, sans-serif;
margin-bottom: 20px;
}

/* Styling for the bus stop list */
h3 {
color: #555;
font-size: 1.4em;
font-weight: bold;
margin-top: 20px;
border-bottom: 2px solid #8298C4;
padding-bottom: 8px;
}

ul {
list-style: none;
padding: 0;
}

ul li {
background: #f9f9f9;
margin: 8px 0;
padding: 12px 16px;
border-radius: 6px;
border: 1px solid #ddd;
font-size: 1.1em;
font-family: Arial, sans-serif;
display: flex;
justify-content: space-between;
align-items: center;
color: #333;
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
transition: background 0.3s ease, box-shadow 0.3s ease;
}

ul li:hover {
background: #f1f5fb;
box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
}

/* Styling for the distance text in list items */
ul li::after {
content: attr(data-distance);
font-size: 0.9em;
color: #666;
}

/* Fallback text styling */
p {
text-align: center;
font-size: 1.2em;
color: #888;
font-style: italic;
margin-top: 20px;
}

/* General page styles */
body {
font-family: Arial, sans-serif;
background: #fafafa;
margin: 0;
padding: 20px;
line-height: 1.6;
}

div {
max-width: 800px;
margin: 0 auto;
}
</style>
