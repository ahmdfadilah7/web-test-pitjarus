<script setup lang="ts">
import { computed } from 'vue'

interface Area {
  area_id: number
  area_name: string
}

interface BrandComplianceData {
  brand_name: string
  area_name: string
  total_reports: number
  compliant_reports: number
  compliance_percentage: number
}

const props = defineProps<{
  data: BrandComplianceData[]
  areas: Area[]
}>()

const tableData = computed(() => {
  const brands = [...new Set(props.data.map(item => item.brand_name))]
  const areas = [...new Set(props.data.map(item => item.area_name))]
  
  return brands.map(brand => {
    const row: any = { brand }
    areas.forEach(area => {
      const item = props.data.find(d => d.brand_name === brand && d.area_name === area)
      row[area] = item?.compliance_percentage || 0
    })
    return row
  })
})

const areaColumns = computed(() => {
  return [...new Set(props.data.map(item => item.area_name))]
})
</script>

<template>
  <div class="table-wrapper">
    <div v-if="data.length === 0" class="no-data">
      <p>No data available</p>
    </div>
    
    <div v-else class="table-container">
      <table class="compliance-table">
        <thead>
          <tr>
            <th class="brand-header">Brand</th>
            <th v-for="area in areaColumns" :key="area" class="area-header">
              {{ area }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.brand" class="table-row">
            <td class="brand-cell">{{ row.brand }}</td>
            <td v-for="area in areaColumns" :key="area" class="percentage-cell">
              <div class="percentage-container">
                <span class="percentage-text">{{ row[area] }}%</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-wrapper {
  width: 100%;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #6B7280;
  font-size: 1.1rem;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.compliance-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.compliance-table th,
.compliance-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #E5E7EB;
}

.brand-header,
.area-header {
  background: #F9FAFB;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

.area-header {
  text-align: center;
  min-width: 120px;
}

.brand-cell {
  font-weight: 600;
  color: #1F2937;
  background: #F9FAFB;
  border-right: 1px solid #E5E7EB;
}

.percentage-cell {
  text-align: center;
  padding: 0.75rem;
}

.percentage-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.percentage-text {
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
}

.percentage-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.high-compliance {
  background: linear-gradient(90deg, #10B981, #059669);
}

.medium-compliance {
  background: linear-gradient(90deg, #F59E0B, #D97706);
}

.low-compliance {
  background: linear-gradient(90deg, #EF4444, #DC2626);
}

.table-row:hover {
  background: #F9FAFB;
}

.table-row:hover .brand-cell {
  background: #F3F4F6;
}

@media (max-width: 768px) {
  .compliance-table th,
  .compliance-table td {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
  
  .area-header {
    min-width: 80px;
  }
}
</style>