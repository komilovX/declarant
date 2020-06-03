<template>
  <canvas ref="canvas" height="100%" class="canvas"/>
</template>
<script>
import { Line } from 'vue-chartjs'
export default {
  extends: Line,
  props: {
    labels: {
      type: Array,
      default() {
        return []
      },
    },
    data: {
      type: Array,
      default() {
        return []
      },
    },
    title: String,
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [{
          label: this.title,
          backgroundColor: 'transparent',
          borderColor: '#00b4d8',
          data: this.data
        }]
      }
    }
  },
  watch: {
    data () {
      this.renderChart(this.chartData)
    }
  },
  mounted() {
    this.renderChart(this.chartData)
  }
}
</script>
