<template>
  <div>
    <div class="header df p1 bb mb1">
      <h2>Мои Заявки</h2>
    </div>
    <div class="table p05">
      <div class="df">
        <el-input
          v-model="search"
          placeholder="Быстрый поиск"
          prefix-icon="el-icon-search"
          size="medium"
          style="width: 20%; margin: 5px 15px;"
        />
        <div class="df">
          <div class="task-cube" />
          <span>Нужно выполнить</span>
        </div>
      </div>
      <el-table
        :data="
          document.filter(
            (v) =>
              !search || v.order_id.toLowerCase().includes(search.toLowerCase())
          )
        "
        :header-row-class-name="rowClassName"
        :row-class-name="tableRowClassName"
        tooltip-effect="light"
        style="width: 100%;"
      >
        <el-table-column
          width="180"
          label="Тип"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="{ row: { user } }">
            <span v-if="user">Услуг</span>
            <span v-else>Документь</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="order_id"
          label="Ном заявки"
          align="center"
          show-overflow-tooltip
        />

        <el-table-column width="180" label="Дата" align="center" sortable>
          <template slot-scope="{ row: { createdAt } }">
            <i class="el-icon-time" />
            {{ formaterDate(createdAt) }}
          </template>
        </el-table-column>

        <el-table-column
          width="180"
          prop="number"
          label="Ном документ"
          align="center"
          show-overflow-tooltip
        />

        <el-table-column
          width="180"
          prop="name"
          label="Наименование"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          width="180"
          label="Кто дал"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="{ row: { from } }">
            <span v-if="!from">Cвоя</span>
            <span v-else>{{ from }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Услуги" align="center">
          <template slot-scope="{ row: { order_id } }" class="df">
            <el-button
              type="primary"
              size="small"
              @click="$router.push(`/admin/detail/${order_id}`)"
              >посмотреть</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({ $axios, store }) {
    try {
      const orders = await $axios.$get('api/orders/declarant/all')
      const services = await store.dispatch(`service/findAllUserTasks`)
      const document = orders.concat(services)
      return { document }
    } catch (e) {
      console.log(e)
    }
  },
  data() {
    return {
      search: '',
    }
  },
  methods: {
    formaterDate(date) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }
      return new Date(date).toLocaleString('ru-RU', options)
    },
    rowClassName() {
      return 'table-header'
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
  validate({ store, error }) {
    const { role = null } = store.getters['auth/user']
    if (role == 'declarant') {
      return true
    }
    return false
  },
}
</script>
<style>
.el-table .task-row {
  background-color: rgba(248, 232, 85, 0.3);
}
.el-table .table-header {
  color: #999999;
  font-size: 12px;
}
</style>
<style lang="scss" scoped>
.container {
  padding-top: 0.5rem;
}
.search {
  max-width: 300px;
}
.task-cube {
  margin-right: 1rem;
  width: 30px;
  height: 30px;
  background-color: rgba(248, 232, 85, 0.5);
}
</style>
