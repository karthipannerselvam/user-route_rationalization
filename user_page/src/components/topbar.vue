<template>
  <div class="topbar">
    <div class="logo-container">
      <img src="../assets/dlc.logo.png" alt="DTC Logo" class="topbar-logo" />
      <h1 class="topbar-title">Delhi Transport Corporation</h1>
    </div>
    <div class="hamburger" @click="toggleMenu">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
    <div :class="['menu-container', { show: isMenuOpen }]">
      <a
        v-for="item in menuItems"
        :key="item.text"
        class="menu-link"
        @click.stop="$router.push(item.route)"
        href="#"
      >
        {{ item.text }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopBar",
  data() {
    return {
      isMenuOpen: false,
      menuItems: [
        { text: "ABOUT US", route: "/aboutus" },
        { text: "FARE LIST", route: "/fare-list" },
        { text: "CONCESSION FARES", route: "/concession-fares" },
        { text: "SEARCH", route: "/routes" },
        { text: "CONTACT US", route: "/contact-us" },
        { text: "OTHERS", route: "/others" },
      ],
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>
<style scoped>
/* General Topbar Styling */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-shadow: 0 2px 8px rgba(99, 99, 99, 0.2);
  z-index: 1000;
  font-family: "Arial", sans-serif;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.topbar-logo {
  height: 50px;
  width: auto;
}

.topbar-title {
  font-size: clamp(14px, 4vw, 18px); /* Responsive scaling */
  font-weight: bold;
  color: #212529;
  margin: 0;
  margin-right: 5px;
  text-align: center; /* Center the title */
  white-space: nowrap; /* Prevent wrapping */
}

.menu-container {
  display: flex;
  gap: 20px;
  margin-right: 200px;
}

.menu-link {
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  color: #343a40;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.menu-link:hover {
  background-color: #5664c4;
  color: #ffffff;
}

/* Hamburger Icon Styling */
.hamburger {
  display: none; /* Hidden by default */
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  cursor: pointer;
  margin-left: auto;
}

.hamburger .line {
  height: 3px;
  background-color: #343a40;
  border-radius: 2px;
}

/* Mobile Menu Styling */
.menu-container {
  transition: max-height 0.3s ease-in-out;
  overflow: hidden;
}

.menu-container.show {
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  box-shadow: 0 4px 8px rgba(99, 99, 99, 0.2);
  gap: 10px;
  padding: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .topbar {
    padding: 0 10px; /* Reduce padding for smaller screens */
    justify-content: space-between; /* Space out elements */
  }

  .logo-container {
    flex-direction: row; /* Stack the logo and title vertically */
    align-items: center; /* Align them to the left */
    gap: 5px; /* Add spacing between elements */
  }

  .topbar-logo {
    height: 40px; /* Reduce logo size */
  }
  .topbar-title {
    font-size: 14px; /* Reduce font size for smaller screens */
    text-align: left; /* Align title with logo */
    white-space: nowrap; /* Prevent wrapping */
    margin: 0; /* Remove extra margin */
    width:10px;
  }

  .topbar-title span {
    display: block; /* Stack words vertically */
    text-align: left; /* Align text to the left */
  }

  .hamburger {
    display: flex; /* Show hamburger icon */
    margin-left: auto; /* Push it to the right */
  }

  .menu-container {
    position: absolute; /* Ensure dropdown menu appears below */
    top: 70px;
    right: 0;
    left: 0;
    background-color: #f8f9fa; /* Match topbar color */
    padding: 15px;
    display: none; /* Initially hidden */
    flex-direction: column; /* Stack items vertically */
    gap: 10px; /* Add spacing between menu items */
    box-shadow: 0 4px 8px rgba(99, 99, 99, 0.2); /* Add shadow */
  }

  .menu-container.show {
    display: flex; /* Display menu when toggled */
  }
}

@media (min-width: 769px) {
  .menu-container {
    display: flex; /* Restore horizontal layout for larger screens */
    flex-direction: row;
    position: static; /* Remove absolute positioning */
    background-color: transparent;
    box-shadow: none;
    padding: 0;
  }

  .hamburger {
    display: none; /* Hide hamburger icon on larger screens */
  }
}

</style>

