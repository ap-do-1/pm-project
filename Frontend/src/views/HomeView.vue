<script setup>
import { computed } from "vue";
import { useMainStore } from "@/stores/main";
import {

} from "@mdi/js";

import SectionMain from "@/components/SectionMain.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";


const mainStore = useMainStore();

const clientBarItems = computed(() => mainStore.clients.slice(0, 4));

const transactionBarItems = computed(() => mainStore.history);

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain> 

    </SectionMain>
  </LayoutAuthenticated>
</template>
