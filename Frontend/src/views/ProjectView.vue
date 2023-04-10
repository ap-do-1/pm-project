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

const projects = ref([]);

const fetchProjects = async () => {
  const response = await api.getProjects();
  projects.value = response.data;
};


onMounted(() => {
  fetchProjects();
});

const mainStore = useMainStore();

const clientBarItems = computed(() => mainStore.state.clients.slice(0, 4));

const transactionBarItems = computed(() => mainStore.state.history);

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CardBox>
        <h1>Projects</h1>
        <ul>
          <li v-for="project in projects" :key="project.id">
            {{ project.name}}
          </li>
          <li v-for="project in projects" :key="project.id">
            {{ project.description}}
          </li>
          <li v-for="project in projects" :key="project.id">
            {{ project.creator}}
          </li>


        </ul>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

