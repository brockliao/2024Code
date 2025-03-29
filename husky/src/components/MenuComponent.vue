
<template>
  <div class="grid gap-0.5 grid-cols-10">
    <a v-for="item in menu" :key="item.name" @click="goTo(item.path)" class=" text-center text-white cursor-pointer hover:border hover:text-amber-400">{{ item.name }}</a>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const menu = reactive([
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'About',
      path: '/about',
    },
    {
      name: 'Contact',
      path: '/contact',
    },
    {
      name: 'Blog',
      path: '/blog',
    }
  ])

  const goTo = (path: string) => {
    router.push(path)
  }
</script>

<style scoped>

</style>
