<script setup>
import {defineProps} from 'vue';
defineProps({
  run: {
    type: Object,
    required: true,
  }
});

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
  <div class="runs-grid">
    <span>Run-{{run.id}}</span>
    <span>{{ run.title }}</span>
    <span>{{formatDate(run.runStart)}}</span>
    <span>{{formatDate(run.runEnd)}}</span>
    <span>more details</span>
    <button class="white-with-border">Complete</button>
  </div>
</template>
<style>
.runs-grid {
  display: grid;
  grid-template-columns: 1fr 2.5fr 0.75fr 0.75fr 1fr 1fr;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.white-with-border {
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