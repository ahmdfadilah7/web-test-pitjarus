<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import ComplianceChart from './ComplianceChart.vue'
import ComplianceTable from './ComplianceTable.vue'
import FilterControls from './FilterControls.vue'

interface Area {
  area_id: number
  area_name: string
}

interface Brand {
  brand_id: number
  brand_name: string
}

interface ComplianceData {
  area_name: string
  total_reports: number
  compliant_reports: number
  compliance_percentage: number
}

interface BrandComplianceData {
  brand_name: string
  area_name: string
  total_reports: number
  compliant_reports: number
  compliance_percentage: number
}

const areas = ref<Area[]>([])
const brands = ref<Brand[]>([])
const complianceData = ref<ComplianceData[]>([])
const brandComplianceData = ref<BrandComplianceData[]>([])
const isLoading = ref(false)

// Filters
const selectedArea = ref<number | null>(null)
const dateFrom = ref<string>('')
const dateTo = ref<string>('')
const selectedBrand = ref<number | null>(null)

const API_BASE_URL = 'http://localhost:3001/api'

const totalCompliance = computed(() => {
  if (complianceData.value.length === 0) return 0
  const totalReports = complianceData.value.reduce((sum, item) => sum + item.total_reports, 0)
  const totalCompliant = complianceData.value.reduce((sum, item) => sum + item.compliant_reports, 0)
  return totalReports > 0 ? Math.round((totalCompliant / totalReports) * 100) : 0
})

async function fetchAreas() {
  try {
    const response = await axios.get(`${API_BASE_URL}/areas`)
    areas.value = response.data
  } catch (error) {
    console.error('Error fetching areas:', error)
  }
}

async function fetchBrands() {
  try {
    const response = await axios.get(`${API_BASE_URL}/brands`)
    brands.value = response.data
  } catch (error) {
    console.error('Error fetching brands:', error)
  }
}

async function fetchComplianceData() {
  try {
    isLoading.value = true
    const params = new URLSearchParams()
    
    if (selectedArea.value) params.append('area_id', selectedArea.value.toString())
    if (dateFrom.value) params.append('date_from', dateFrom.value)
    if (dateTo.value) params.append('date_to', dateTo.value)
    if (selectedBrand.value) params.append('brand_id', selectedBrand.value.toString())
    
    const response = await axios.get(`${API_BASE_URL}/compliance-report?${params}`)
    complianceData.value = response.data
  } catch (error) {
    console.error('Error fetching compliance data:', error)
  } finally {
    isLoading.value = false
  }
}

async function fetchBrandComplianceData() {
  try {
    const params = new URLSearchParams()
    
    if (selectedArea.value) params.append('area_id', selectedArea.value.toString())
    if (dateFrom.value) params.append('date_from', dateFrom.value)
    if (dateTo.value) params.append('date_to', dateTo.value)
    
    const response = await axios.get(`${API_BASE_URL}/brand-compliance?${params}`)
    brandComplianceData.value = response.data
  } catch (error) {
    console.error('Error fetching brand compliance data:', error)
  }
}

function handleFiltersChange(filters: any) {
  selectedArea.value = filters.area
  dateFrom.value = filters.dateFrom
  dateTo.value = filters.dateTo
  selectedBrand.value = filters.brand
  
  fetchComplianceData()
  fetchBrandComplianceData()
}

function handleView() {
  fetchComplianceData()
  fetchBrandComplianceData()
}

onMounted(() => {
  fetchAreas()
  fetchBrands()
  fetchComplianceData()
  fetchBrandComplianceData()
})
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Compliance Dashboard</h1>
    </div>
    
    <div class="dashboard-content">
      <FilterControls 
        :areas="areas"
        :brands="brands"
        @filters-change="handleFiltersChange"
        @view="handleView"
      />
      
      <div class="charts-section">
        <div class="chart-container">
          <ComplianceChart 
            :data="complianceData" 
            :loading="isLoading"
          />
        </div>
        
        <div class="table-container">
          <ComplianceTable 
            :data="brandComplianceData"
            :areas="areas"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #fefefe 0%, #292cfa 100%);
  padding: 2rem;
}

.dashboard-header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.dashboard-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
}

.metrics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.metric-card h3 {
  color: #6B7280;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3B82F6;
}

.charts-section {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
}

.chart-container, .table-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.chart-container h2 {
  color: #374151;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  padding: 1rem;
  background: #F3F4F6;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  
  .dashboard-header h1 {
    font-size: 2rem;
  }
  
  .chart-container, .table-container {
    padding: 1rem;
  }
}
</style>