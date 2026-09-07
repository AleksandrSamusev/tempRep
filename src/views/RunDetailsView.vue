<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import runService from "@/service/runService.js";

const route = useRoute();
const run = ref(null);
const isLoading = ref(true);
const errorMessage = ref(null);

onMounted(async () => {
  const runId = route.params.id;
  try {
    const response = await runService.getRunById(runId);
    run.value = response.data;
  } catch (error) {
    console.error(error);
    errorMessage.value = "Failed to load details. Try again later."
  } finally {
    isLoading.value = false;
  }
});

function capitalizeFirst(str) {
  const lowerString = str.toLowerCase();
  const arr = lowerString.split('');
  arr[0] = arr[0].toUpperCase();
  return arr.join('');
}

const formatDate = (dateString) => {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  const formattedTime = date.toLocaleTimeString('de-DE', {
    hour: '2-digit', minute: '2-digit', hour12: false
  });
  return `${formattedDate} ${formattedTime}`;
}
</script>
<template>
  <div v-if="!isLoading && !errorMessage" class="flex-main-container">
    <div class="flex-row">
      <div class="id-badge-div">
        <h1>Run-{{ run?.id }}</h1>
        <div class="status-badge">
          <span>{{ run?.runStatus }}</span>
        </div>
      </div>
      <div class="flex-buttons-container">
        <button class="button-edit-run">Edit Run</button>
      </div>
    </div>
    <div class="run-details-column">
      <div class="run-details-row">
        <span class="run-details-label">Title:</span>
        <span>{{ run?.title }}</span>
      </div>

      <div class="run-details-row">
        <span class="run-details-label">Description:</span>
        <span>{{ run?.description }}</span>
      </div>

      <div class="run-details-row">
        <span class="run-details-label">Platforms:</span>
        <div class="badges-wrapper">
          <div class="platforms-badge" v-for="platform in run?.platforms" :key="platform">
            <span class="platforms-span">{{ capitalizeFirst(platform) }}</span>
          </div>
        </div>
      </div>

      <div class="run-details-row">
        <span class="run-details-label">Start date:</span>
        <span>{{ formatDate(run.runStart) }}</span>
      </div>

      <div class="run-details-row">
        <span class="run-details-label">End date:</span>
        <span>{{ formatDate(run.runEnd) }}</span>
      </div>

      <div class="run-details-row">
        <span class="run-details-label">Testing areas:</span>
        <div class="testing-areas">
          <div class="testing-area-card" v-for="area in run?.testingAreas" :key="area">
            <h3>{{area?.tag}}</h3>
            <div class="testing-area-flex-row">
              <span>Complexity:</span>
              <span>{{area.complexity}}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<style scoped>

.testing-area-flex-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.testing-area-card {
  font-size: 14px;
  width: 200px;
  height: 100px;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0.5rem 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.testing-areas {
  display: flex;
  flex-wrap: wrap;
  max-height: 500px;
  gap: 1rem;
}

.badges-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.platforms-badge {
  background-color: #474441;
  padding: 5px 20px;
  color: white;
  border-radius: 20px;
  line-height: 1rem;
}

.platforms-span {
  font-size: 12px;
  font-weight: 600;
}

.run-details-label {
  min-width: 100px;
}

.run-details-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.flex-main-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: auto;
  width: 100%;
  gap: 2rem;
  flex-wrap: wrap;
  padding-bottom: 100px;
}

.flex-row {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.flex-buttons-container {
  display: flex;
  gap: 1rem;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.button-edit-run {
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

.status-badge {
  width: 80px;
  height: 20px;
  border-radius: 10px;
  background-color: #FF9B43;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.60rem;
  font-weight: 600;
  line-height: 1rem;
}

.id-badge-div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
}

.run-details-row {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 3rem;
}
</style>