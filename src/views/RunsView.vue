<script setup>
import RunListItem from '../components/RunListItem.vue';
import runService from "@/service/runService.js";
import {onMounted, ref} from "vue";

const runs = ref([]);
onMounted(async () => {
  try {
    const response = await runService.getAllRuns();
    runs.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
})

</script>

<template>
<div class="flex-main-container">
  <div class="flex-row">
    <h1>Runs</h1>
    <div class="flex-buttons-container">
      <button class="button-new-run">New Run</button>
    </div>
  </div>
  <RunListItem v-for="run in runs" :key="run.id" :run="run" />

</div>
</template>

<style scoped>
.flex-main-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 550px;
  gap: 2rem;
}

.flex-row {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.flex-buttons-container {
  display: flex;
  gap: 1rem;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}


.button-new-run {
  border: 1px solid black;
  cursor: pointer;
  width: 120px;
  height: 40px;
  background-color: white;
  color: black;
  font-weight: 600;
  font-size: 1.2rem;
  border-radius: 3px;
}
</style>