<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'

interface Area {
  area_id: number
  area_name: string
}

interface Brand {
  brand_id: number
  brand_name: string
}

const props = defineProps<{
  areas: Area[]
  brands: Brand[]
}>()

const emit = defineEmits<{
  filtersChange: [filters: any]
  view: []
}>()

const selectedArea = ref<number | null>(null)
const dateFrom = ref<string>('')
const dateTo = ref<string>('')

function applyFilters() {
  emit('filtersChange', {
    area: selectedArea.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
  })
}

function handleView() {
  emit('view')
}

function resetFilters() {
  selectedArea.value = null
  dateFrom.value = ''
  dateTo.value = ''
  applyFilters()
}
</script>

<template>
  <div class="filter-controls">
    <div class="filter-row">
      <div class="filter-group">
        <label for="area-select">Select Area</label>
        <select 
          id="area-select"
          v-model="selectedArea" 
          @change="applyFilters"
          class="filter-select"
        >
          <option :value="null">All Areas</option>
          <option 
            v-for="area in areas" 
            :key="area.area_id" 
            :value="area.area_id"
          >
            {{ area.area_name }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="date-from">Select dateFrom</label>
        <input 
          id="date-from"
          v-model="dateFrom" 
          type="date" 
          @change="applyFilters"
          class="filter-input"
        />
      </div>
      
      <div class="filter-group">
        <label for="date-to">Select dateTo</label>
        <input 
          id="date-to"
          v-model="dateTo" 
          type="date" 
          @change="applyFilters"
          class="filter-input"
        />
      </div>
      
      <div class="filter-actions">
        <button @click="handleView" class="view-button">
          View
        </button>
        <button @click="resetFilters" class="reset-button">
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-controls {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.filter-select, .filter-input {
  padding: 0.75rem;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.filter-select:focus, .filter-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}

.view-button, .reset-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.view-button {
  background: #3B82F6;
  color: white;
}

.view-button:hover {
  background: #2563EB;
  transform: translateY(-2px);
}

.reset-button {
  background: #6B7280;
  color: white;
}

.reset-button:hover {
  background: #4B5563;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .filter-row {
    grid-template-columns: 1fr;
  }
  
  .filter-actions {
    flex-direction: row;
  }
}
</style>