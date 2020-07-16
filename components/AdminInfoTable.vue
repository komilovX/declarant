<template>
  <div>
    <el-table
      border
      :data="serviceList"
      :row-class-name="tableRowClassName"
      size="mini"
    >
      <el-table-column width="60" label="№" align="center" prop="number" />
      <el-table-column
        width="120"
        label="Наименование"
        align="center"
        prop="name"
      >
        <template slot-scope="{ row: { file, name } }">
          <a
            v-if="file"
            :href="`/uploads/${file}`"
            target="_blank"
            style="color: blue;"
          >
            {{ name }}
          </a>
          <span v-else>{{ name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        label="Исполнитель"
        align="center"
        prop="creator"
      />
      <el-table-column
        width="130"
        label="Сумма НЦ"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row: { price, currency } }">
          <span v-if="currency == 'sum'">
            {{ price }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="130"
        label="Сумма Капуста"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row: { price, currency } }">
          <span v-if="currency == '$'">
            {{ price }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="130"
        label="Перечисление"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row: { price, currency } }">
          <span v-if="currency == 'invoice'">
            {{ price }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        label="Итог Сумма"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row: { changed, total_price }, $index }">
          <span v-if="!changed">{{ total_price }}</span>
          <el-input
            v-else
            type="number"
            v-model="serviceList[$index].total_price"
          />
        </template>
      </el-table-column>
      <el-table-column width="90" label="Изм" align="center">
        <template slot-scope="{ row: { changed }, row }">
          <div v-if="!changed" class="df" style="justify-content: center;">
            <el-button
              v-if="row.status != 'task'"
              type="text"
              @click="row.changed = true"
              size="small"
              class="delete-button"
              style="color: #409eff;"
              icon="el-icon-edit"
            />
            <el-button
              v-if="row.status == 'task'"
              @click="deleteDocument(row)"
              :loading="deleteLoading"
              icon="el-icon-delete"
              size="small"
              type="text"
              class="delete-button"
            />
          </div>
          <div v-else class="df" style="justify-content: center;">
            <el-button
              type="text"
              :loading="loading"
              @click="updatePrice(row)"
              class="delete-button"
              style="color: #67c23a;"
              size="small"
              icon="el-icon-check"
            />
            <el-button
              type="text"
              class="delete-button"
              @click="
                () => {
                  ;(row.changed = false), (row.total_price = row.price)
                }
              "
              size="small"
              icon="el-icon-close"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="Примечание"
        align="center"
        show-overflow-tooltip
      />
    </el-table>
    <div class="total-sum">
      <h2 class="mr2">Итого:</h2>
      <h2 class="mr2">{{ getTotalSum }}</h2>
      <el-button
        size="medium"
        v-if="declarant_documents.length > 0"
        type="success"
        @click="changeOrderStatus()"
        :loading="finishLoading"
        >Закончить</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      finishLoading: false,
      deleteLoading: false,
      loading: false,
    }
  },
  props: {
    services: {
      type: Array,
      default: () => [],
    },
    declarant_documents: {
      type: Array,
      default: () => [],
    },
    order_id: Number,
  },
  computed: {
    serviceList() {
      let service = this.services.map((s) => ({
        id: s.id,
        name: s.name,
        creator: s.user,
        number: s.number,
        price: s.price,
        total_price: s.total_price,
        currency: s.currency,
        comment: s.comment,
        status: s.status,
        changed: false,
        type: 'service',
      }))
      let declarant = this.declarant_documents.map((s) => ({
        id: s.id,
        name: s.name,
        creator: s.declarant,
        number: s.number,
        file: s.file,
        price: s.price,
        total_price: s.total_price,
        currency: s.currency,
        comment: s.comment,
        status: s.status,
        changed: false,
        type: 'declarant',
      }))

      return service.concat(declarant)
    },
    getTotalSum() {
      let dollar = 0
      let sum = 0
      let invoice = 0
      this.serviceList.forEach((s) => {
        if (s.currency == '$') {
          dollar += +s.total_price
        } else if (s.currency == 'sum') {
          sum += +s.total_price
        } else {
          invoice += +s.total_price
        }
      })
      return `${dollar} $  ${sum} сум | перечисление: ${invoice} `
    },
  },
  methods: {
    async changeOrderStatus() {
      try {
        this.finishLoading = true
        let status = 'done'
        const formData = { status }
        await this.$axios.$put(`api/orders/${this.order_id}/status`, formData)
        this.finishLoading = false
        this.$router.push('/admin/orders')
      } catch (e) {
        this.finishLoading = false
        console.log(e)
      }
    },
    async updatePrice(row) {
      try {
        this.loading = true
        if (row.type == 'service') {
          await this.$axios.$put(`api/service/${row.id}`, {
            total_price: row.total_price,
          })
        } else {
          const fd = new FormData()
          fd.append('total_price', row.total_price)
          await this.$axios.$put(`api/orders/declarant/${row.id}`, fd)
        }
        row.changed = false
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async deleteDocument(row) {
      try {
        this.deleteLoading = true
        if (row.type == 'declarant') {
          await this.$store.dispatch(`orders/deleteDeclarantDocument`, row.id)
          this.$emit('documentDeleted', { id: row.id, type: 'declarant' })
        } else {
          await this.$store.dispatch(`service/deleteDocument`, row.id)
          this.$emit('documentDeleted', { id: row.id, type: 'service' })
        }
        this.deleteLoading = false
      } catch (e) {
        this.deleteLoading = false
        console.log(e)
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status == 'task') {
        return 'task-row'
      }
      if (row.type == 'service') {
        return 'service-row'
      }
      if (row.type == 'declarant') {
        return 'declarant-row'
      }
      return ''
    },
  },
}
</script>
<style>
.el-table .service-row {
  background-color: rgba(252, 0, 0, 0.25);
}
.el-table .declarant-row {
  background-color: rgba(1, 69, 255, 0.2);
}
.el-table .task-row {
  background-color: rgba(248, 232, 85, 0.4);
}
</style>
<style lang="scss" scoped>
.total-sum {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
}
</style>
