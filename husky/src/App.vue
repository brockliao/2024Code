<script setup lang="ts">
import { RouterView } from 'vue-router'
import MenuComponent from '@/components/MenuComponent.vue'
</script>

<template>
  <header class="bg-blue-200" >
    <MenuComponent />
  </header>
  <main class="bg-white border border-[#999] overflow-hidden " >
    <RouterView />
  </main>
  <footer class="border border-e-amber-50 flex justify-center items-center">
    <p class="text-center font-bold text-xl p-0 mt-0 mb-0">
      你好大爷有限公司 联系电话 : <a type="telphone" class="hover:text-amber-300 cursor-pointer">0752-12333</a> 地址 : 北京市朝阳区 邮编 : 100000
    </p>
  </footer>
</template>

<style scoped>



</style>
