<template>
  <div>
    <div class="container">
      <div class="header df-sb p1 bb mb1">
        <el-select v-model="order_type" placeholder="Select" @change="onChange">
          <el-option label="Перечисленный" value="transfer" />
          <el-option label="Наличный" value="cash" />
        </el-select>
        <el-date-picker
          v-model="value1"
          :clearable="false"
          type="daterange"
          range-separator="-"
          start-placeholder="Start date"
          end-placeholder="End date"
          @change="onChange"
        />
      </div>
      <div class="line-container">
        <line-chart
          :data="lineData"
          :labels="lineLabels"
          :title="lineTitle"
          class="line-chart"
        />
      </div>

      <el-row class="py2">
        <hr />
        <el-col :span="10" :offset="7">
          <div class="pie-container">
            <h3 class="text-center mb1 mt1">
              На этот месяц
            </h3>
            <pie-chart :data="pieData" class="pie-chart" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import LineChart from '@/components/LineChart'
import PieChart from '@/components/PieChart'

export default {
  components: {
    LineChart,
    PieChart,
  },
  async asyncData({ store }) {
    try {
      const { data, labels } = await store.dispatch(
        'statistic/getAllTransferOrders',
        {}
      )
      const { cash, transfer } = await store.dispatch('statistic/getExtra')
      return { lineData: data, lineLabels: labels, pieData: [transfer, cash] }
    } catch (e) {
      console.log(e)
    }
  },
  data() {
    return {
      value1: [
        new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        new Date(),
      ],
      order_type: 'transfer',
      lineTitle: 'Перечисленный',
      loading: '',
    }
  },
  methods: {
    async onChange() {
      try {
        this.switchLoading()
        const form = {
          cash: this.order_type == 'cash' ? 'cash' : '',
          start: new Date(this.value1[0]).getTime(),
          end: new Date(this.value1[1]).getTime(),
        }
        const { data, labels } = await this.$store.dispatch(
          'statistic/getAllTransferOrders',
          form
        )
        this.lineData = data
        this.lineLabels = labels
        ;(this.lineTitle =
          this.order_type == 'cash' ? 'Наличный' : 'Перечисленный'),
          this.loading.close()
      } catch (e) {
        this.loading.close()
      }
    },
    async onSelectChange(order) {
      try {
        this.switchLoading()
        const form = {
          cash: order == 'cash' ? 'cash' : '',
          start: new Date(this.value1[0]).getTime(),
          end: new Date(this.value1[1]).getTime(),
        }
        const { data, labels } = await this.$store.dispatch(
          'statistic/getAllTransferOrders',
          form
        )
        this.lineData = data
        this.lineLabels = labels
        this.loading.close()
      } catch (e) {
        console.error(e)
        this.loading.close()
      }
    },
    switchLoading() {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    },
  },
}
</script>

<style>
.line-container {
  /* max-width: 900px; */
  max-height: 400px;
  margin: 0 auto;
}
.bar-container {
  height: 300px;
  position: relative;
}
.bar-chart {
  margin-top: 2rem;
  max-height: 100%;
}
.pie-chart {
  max-height: 100%;
}
/* .pie-container {
    height: 400px;
    max-height: 400px;
  }
  .pie-chart {
    max-height: 400px;
    margin: 0 auto;
  } */
</style>
