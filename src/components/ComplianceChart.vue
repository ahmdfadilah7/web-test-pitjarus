<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface ComplianceData {
  area_name: string
  total_reports: number
  compliant_reports: number
  compliance_percentage: number
}

const props = defineProps<{
  data: ComplianceData[]
  loading: boolean
}>()

const chartData = computed(() => ({
  labels: props.data.map(item => item.area_name),
  datasets: [
    {
      label: 'Nilai',
      data: props.data.map(item => item.compliance_percentage),
      backgroundColor: '#60A5FA',
      borderColor: '#3B82F6',
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: '#3B82F6',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: function(context: any) {
          const dataIndex = context.dataIndex
          const item = props.data[dataIndex]
          return [
            `Percentage: ${context.parsed.y}%`,
            `Total: ${item.compliant_reports}`,
          ]
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function(value: any) {
          return value + '%'
        },
        font: {
          size: 11
        }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    x: {
      ticks: {
        font: {
          size: 11
        }
      },
      grid: {
        display: false
      }
    }
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  }
}))
</script>

<template>
  <div class="chart-wrapper">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading chart data...</p>
    </div>
    
    <div v-if="!loading && data.length === 0" class="no-data">
      <p>No data available for the selected filters</p>
    </div>
    
    <div v-if="!loading && data.length > 0" class="chart-container">
      <Bar
        :data="chartData"
        :options="chartOptions"
        :height="300"
      />
    </div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 400px;
  min-height: 300px;
}

.chart-container {
  height: 100%;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #6B7280;
  font-size: 1.1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>