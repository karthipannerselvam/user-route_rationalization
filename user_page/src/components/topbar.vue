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
        {text: "HOME",route:"/"},
        { text: "ABOUT US", route: "/aboutus" },
        // { text: "FARE LIST", route: "/fare-list" },
        // { text: "CONCESSION FARES", route: "/concession-fares" },
        { text: "SEARCH", route: "/routes" },
        { text: "CONTACT US", route: "/contact-us" },
        // { text: "OTHERS", route: "/others" },
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
  font-size: 20px;
  font-weight: bold;
  color: #212529;
  margin: 0;
  margin-right: 5px;
}

/* Improved Menu Container Styling */
.menu-container {
  display: flex;
  gap: 20px;
  margin-right: 200px;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
}

.menu-link {
  text-decoration: none;
  color: #495057;
  padding: 8px 15px;
  border: 2px solid transparent;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  font-family: "Arial", sans-serif;
  text-align: center;
  white-space: nowrap;
}

.menu-link:hover {
  background-color: #007bff;
  color: white;
  border-color: #0056b3;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.menu-link:active {
  background-color: #0056b3;
  color: white;
  border-color: #003f7f;
}

.menu-link:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 3px #007bff;
}

/* Enhanced Mobile Menu Styling */
.menu-container.show {
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  gap: 15px;
}

/* Hamburger Icon Styling */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  cursor: pointer;
  margin-right: 17px;
}

.hamburger .line {
  height: 3px;
  background-color: #343a40;
  border-radius: 2px;
}

/* Responsive Enhancements */
@media (max-width: 768px) {
  .menu-container {
    display: none;
  }

  .menu-container.show {
    display: flex;
    flex-direction: column;
  }

  .menu-link {
    font-size: 16px;
    padding: 12px 20px;
  }

  .hamburger {
    display: flex;
  }

  .topbar-title {
    font-size: 18px;
  }

  .topbar {
    padding: 0 15px;
  }
}

@media (min-width: 769px) {
  .menu-container {
    display: flex;
    flex-direction: row;
    background-color: transparent;
    box-shadow: none;
  }

  .menu-link {
    font-size: 14px;
    padding: 8px 12px;
  }

  .hamburger {
    display: none;
  }
}
</style>
