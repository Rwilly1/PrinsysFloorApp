<template>
  <div id="app">
    <div class="status-bar">
      <span class="time">9:41</span>
      <div class="status-icons">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <rect x="0" y="3" width="4" height="6" rx="1"/>
          <rect x="6" y="1" width="4" height="8" rx="1"/>
          <rect x="12" y="0" width="4" height="10" rx="1"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M1 3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3V9C15 10.1046 14.1046 11 13 11H3C1.89543 11 1 10.1046 1 9V3Z"/>
          <rect x="15" y="4" width="1" height="4" rx="0.5"/>
        </svg>
      </div>
    </div>
    <header class="app-header">
      <button class="menu-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <img src="./assets/prinsys-logo.svg" alt="Prinsys" class="logo" />
    </header>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <nav class="bottom-nav">
      <router-link to="/" class="nav-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/floor-map" class="nav-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
        <span>FloorMap</span>
      </router-link>
      <router-link to="/access-leak" class="nav-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>Access Leak</span>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Profile</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  position: fixed;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f5f5;
}

#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: white;
  font-size: 0.875rem;
  font-weight: 500;
  color: #000;
  flex-shrink: 0;
}

.status-icons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  z-index: 100;
  flex-shrink: 0;
}

.menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #0873bb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 28px;
  flex: 1;
  margin: 0 1rem;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.bottom-nav {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  background: white;
  border-top: 1px solid #e0e0e0;
  padding: 0.5rem 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  text-decoration: none;
  padding: 0.5rem 0.5rem;
  transition: color 0.3s;
  font-size: 0.7rem;
  flex: 1;
  min-width: 0;
}

.nav-item:hover {
  color: #0873bb;
}

.nav-item.router-link-active {
  color: #0873bb;
}

.nav-item svg {
  stroke: currentColor;
}

@media (max-width: 375px) {
  .app-header {
    padding: 0.625rem 0.875rem;
  }
  
  .logo {
    height: 24px;
  }
  
  .menu-btn {
    padding: 0.375rem;
  }
  
  .nav-item {
    font-size: 0.65rem;
    padding: 0.375rem 0.25rem;
  }
  
  .nav-item svg {
    width: 20px;
    height: 20px;
  }
}

@media (min-width: 768px) {
  #app {
    max-width: 768px;
    margin: 0 auto;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .status-bar {
    display: none;
  }
}
</style>
