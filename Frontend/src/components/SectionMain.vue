<script setup>
import { containerMaxW } from "@/config.js";
</script>

<template>
  <div class="section-maintest">
    <section class="p-6" :class="containerMaxW">
      <slot />
   </section>
  </div>
</template>

<style>
.section-maintest {
  margin-top: 50px;
}
</style>