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
  <div class="run-card">
    <div class="card-top">
      <div class="badge-div">
        <span class="run-id">Run-{{ run.id }}</span>
        <div class="status-badge">
          <span>{{ run.runStatus }}</span>
        </div>
      </div>
      <span class="title">{{ run.title }}</span>
      <div class="dates-div">
        <span>Start date:</span>
        <span class="span-dates">{{ formatDate(run.runStart) }}</span>
      </div>
      <div class="dates-div">
        <span>End date:</span>
        <span class="span-dates">{{ formatDate(run.runEnd) }}</span>
      </div>

    </div>
    <div class="card-bottom">
      <router-link class="more-details" :to="`/runs/${run.id}`">More details</router-link>
    </div>

  </div>
</template>
<style>
.span-dates {
  font-size: 0.85rem;
  font-weight: 600;
}

.run-card {
  width: 360px;
  min-height: 300px;
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 10px;
  justify-content: space-between;
}

.card-top {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: flex-end;
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

.badge-div, .dates-div {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.title, .run-id {
  font-size: 1.2rem;
  font-weight: 600;
}

.run-id {
  text-transform: uppercase;
}

.more-details {
  align-self: flex-end;
  color: #0062E3;
  text-decoration: underline;
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 1rem;
  cursor: pointer;
  transition: color 0.2s ease, scale 0.2s ease;
}

.more-details:hover {
  color: #0047A4;
  scale: 120%;
}
</style>