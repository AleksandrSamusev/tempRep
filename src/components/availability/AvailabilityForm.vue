<script setup>
import {ref, computed, watch} from 'vue';
const emit = defineEmits(['cancel', 'submit']);

const props = defineProps({
  initialAvailabilities: {
    type: Array,
    default: () => []
  }
});

const selectionMode = ref('available');
const currentDate = ref(new Date());
const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());
const selectedDates = ref(new Map());

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

watch(
    () => props.initialAvailabilities,
    (newAvailabilities) => {
      selectedDates.value.clear();

      if(newAvailabilities && newAvailabilities.length > 0) {
        newAvailabilities.forEach(item => {
          selectedDates.value.set(item.date, item.status);
        });
      }
    },
    {immediate: true, deep: true}
);

// Display text binding computed property

const currentMonthLabel = computed(() => {
  return `${monthNames[currentMonth.value]} ${currentYear.value}`;
});

// Month structure layout mathematics definitions
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const blankDays = computed(() => {
  const firstDayIndex = new Date(currentYear.value, currentMonth.value, 1).getDay();
  return firstDayIndex;
});

// 3. Navigation offset engine calculations
const changeMonth = (directions) => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + directions, 1);
};

// Conversions parser helper for managing reliable Map keys
const formatDateKey = (day) => {
  const formattedMonth = String(currentMonth.value + 1).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');
  return `${currentYear.value}-${formattedMonth}-${formattedDay}`;
};

// 4, 5 & 6. Cell Mutation Click Logic Flow Handler
const handleDayClick = (day) => {
  const dateKey = formatDateKey(day);


// 6. Clear state if user selects an active selection target matching any designation
  if (selectedDates.value.has(dateKey)) {
    selectedDates.value.delete(dateKey);
  } else {
    selectedDates.value.set(dateKey, selectionMode.value);
  }
};

// Computes structural rendering CSS class mappings
const getDateStatusClass = (day) => {
  const dateKey = formatDateKey(day);
  const status = selectedDates.value.get(dateKey);
  if(!status) return '';
  return status === 'available' ? 'status-available' : 'status-unavailable';
};

// Maps storage entities back up container events payload architectures
const submitSelections = () => {
  const payload = Array.from(selectedDates.value.entries()).map(([date, status]) => ({
    date,
    status
  }));
  emit('submit', payload);
};

</script>
<template>
  <div class="availability-calendar-container">
    <div class="top-row">
      <h2>Edit Availability</h2>
      <img class="calendar-image" src="../../../public/images/calendar.svg" alt="">
    </div>
    <p>Select an option and mark days on the calendar by clicking on a date. Use arrow controls to select the month you are setting availability for.</p>
    <div class="mode-selector">
      <label for="" class="radio-label">
        <input type="radio" value="available" v-model="selectionMode">Mark as Available
      </label>
      <label for="" class="radio-label">
        <input type="radio" value="unavailable" v-model="selectionMode">Mark as Unavailable
      </label>
    </div>
    <!-- 1 & 3. Navigation Controls and Header -->
    <div class="calendar-header">
      <button class="nav-arrow" @click="changeMonth(-1)">
        <img src="../../../public/images/arrow-left.svg" alt="">
      </button>
      <span class="current-month-label">{{ currentMonthLabel }}</span>
      <button class="nav-arrow" @click="changeMonth(1)">
        <img src="../../../public/images/arrow-right.svg" alt="">
      </button>
    </div>
    <!-- Calendar Table Grid Layout -->
    <div class="calendar-grid">
      <div v-for="day in weekDays" :key="day" class="weekday-name">{{ day }}</div>
      <!-- Offset placeholders for days belonging to previous month boundaries -->
      <div v-for="blank in blankDays" :key="'blank-' + blank" class="calendar-day padding-day"></div>
      <!-- Render current days inside active viewport tracking status -->
      <!-- 4, 5 & 6. Selection States & Interactive Triggers -->
      <div v-for="day in daysInMonth" :key="'day-' + day" class="calendar-day reactive-day"
           :class="getDateStatusClass(day)" @click="handleDayClick(day)">
        <span class="day-number">{{ day }}</span>
      </div>
    </div>
    <div class="actions">
      <button class="btn-secondary" @click="$emit('cancel')">Cancel</button>
      <button class="btn-primary" @click="submitSelections">Update</button>
    </div>
  </div>
</template>


<style scoped>

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.calendar-image {
  fill: black;
}

.availability-calendar-container {
  font-family: inherit;
  color: black;
}

h2 {
  margin-top: 0;
  font-size: 1.5rem;
}

/* Radio layout definitions styling rulesets */
.mode-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0;
  margin-bottom: 32px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
}

/* 3. Month controls navigation row layout elements */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 2rem;
}

.current-month-label {
  font-weight: bold;
  font-size: 1.4rem;
}

.nav-arrow {
  background: none;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;
}
.nav-arrow:hover {
  background-color: #f4f4f5;
}

/* Grid Matrix CSS Structure Definition Layers */
.calendar-grid {
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  text-align: center;
  margin-bottom: 20px;
}

.weekday-name {
  font-weight: 600;
  color: black;
  font-size: 1rem;
  padding-bottom: 6px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 1rem;
}

.reactive-day {
  cursor: pointer;
  border-radius: 50%;
  width: 90%;
  height: auto;
}
.reactive-day:hover {
  background-color: #f4f4f5;
}

/* 4. Available Custom Class Rule definitions */
.status-available {
  border: 2px solid #22c55e !important;
  background-color: #f0fdf4;
}

/* 5. Unavailable Custom Class Rule definitions */
.status-unavailable {
  border: 2px solid #ef4444 !important;
  background-color: #fef2f2;
}

.padding-day {
  opacity: 0.25;
  cursor: not-allowed;
}

/* Base Actions Styling Layout wrappers */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.btn-primary, .btn-secondary {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background-color: #000;
  color: #fff;
  border: 1px solid #000;
}
.btn-secondary {
  background-color: #fff;
  color: #000;
  border: 1px solid #ccc;
}
</style>