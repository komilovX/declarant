<template>
  <canvas ref="canvas" height="240px" class="canvas" />
</template>
<script>
import { Pie } from 'vue-chartjs'
export default {
  extends: Pie,
  props: {
    data: {
      type: Array,
      default() {
        return []
      },
    },
  },
  computed: {
    chartData() {
      return {
        labels: ['Перечисленный', 'Наличный'],
        datasets: [
          {
            label: 'На этот месяц.',
            backgroundColor: ['rgba(0, 196, 154, .8)', 'rgba(0, 123, 186, .8)'],
            data: this.data,
          },
        ],
      }
    },
  },
  mounted() {
    this.renderChart(this.chartData)
  },
}
</script>
