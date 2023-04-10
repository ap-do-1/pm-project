<script setup>
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
} from "@mdi/js";
import { computed, ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TableSampleClients from "@/components/TableSampleClients.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import api from '@/services/api';

const tasks = ref([]);

const fetchtasks = async () => {
  const response = await api.getTasks();
  tasks.value = response.data;
};


onMounted(() => {
  fetchtasks();
});

const mainStore = useMainStore();

const clientBarItems = computed(() => mainStore.state.clients.slice(0, 4));

const transactionBarItems = computed(() => mainStore.state.history);

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CardBox>
        <h1>Tasks</h1>
        <ul>
          <li v-for="task in tasks" :key="task.id">
            {{ task.name}}
          </li>
          <li v-for="task in tasks" :key="task.id">
            {{ task.description}}
          </li>
            <li v-for="task in tasks" :key="task.id">
                {{ task.creator}}
            </li>
        </ul>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

