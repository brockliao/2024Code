<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header class="bg-green-200" >
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
  </header>
  <main class="bg-lime-100">
    <RouterView />
  </main>
  <footer class="bg-indigo-400">底部</footer>
</template>

<style scoped>



</style>
