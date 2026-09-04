<script setup>
</script>
<template>
  <div class="container">
    <header class="app-header">
      <router-link to="/brands" class="top-links">Brands</router-link>
      <router-link to="/users" class="top-links">Users</router-link>
      <router-link to="/runs" class="top-links">Runs</router-link>
    </header>
    <main>
      <router-view/>
    </main>
  </div>
</template>
<style scoped>
.app-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 10vh;
  gap: 50px;
}

.top-links {
  color: black;
  font-family: "Google Sans Flex", sans-serif;
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
}
</style>
