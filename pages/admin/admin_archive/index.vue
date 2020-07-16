<template>
  <div>
    <div class="header p1 bb mb1">
      <h2>Архив</h2>
    </div>
    <div class="table p05">
      <el-input
        v-model="search"
        placeholder="Быстрый поиск"
        prefix-icon="el-icon-search"
        size="medium"
        style="width: 20%; margin: 5px 15px;"
      />
      <el-table
        :data="
          orders.filter(
            (v) =>
              !search || v.client.toLowerCase().includes(search.toLowerCase())
          )
        "
        :header-row-class-name="rowClassName"
        tooltip-effect="light"
        style="width: 100%;"
      >
        <el-table-column
          width="90"
          prop="id"
          label="Ном заявки"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column width="180" label="Дата" align="center" sortable>
          <template slot-scope="{ row: { date } }">
            <i class="el-icon-time" />
            {{ formaterDate(date) }}
          </template>
        </el-table-column>

        <el-table-column
          width="200"
          prop="client_company"
          label="Клиент фирма"
          align="center"
          show-overflow-tooltip
        />

        <el-table-column
          width="200"
          prop="product"
          label="Название товара"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          width="150"
          prop="post_number"
          label="Пост номер"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="Услуги" align="center">
          <template slot-scope="{ row: { id, status }, row }">
            <div class="df-se" v-if="!row.deleted">
              <el-button
                type="primary"
                size="medium"
                @click="$router.push(`/admin/admin_archive/${id}`)"
                >Посмотреть</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style>
.el-table .table-header {
  color: #999999;
  font-size: 12px;
}
.el-table .deleted-row {
  background: oldlace;
}
.el-table .finished-row {
  background: rgba(202, 210, 253, 0.3);
}
</style>

<script>
export default {
  middleware: ["admin-auth"],
  async asyncData({ $axios, error }) {
    try {
      const orders = await $axios.$get("api/orders?archive=true");
      return { orders };
    } catch (e) {
      console.log(e);
    }
  },
  data: () => ({
    loading: false,
    search: "",
  }),
  validate({ store, error }) {
    const { role = null } = store.getters["auth/user"];
    if (role == 'admin' || role == 'manager') {
      return true
    }
    return false;
  },
  methods: {
    goToForm() {
      this.$router.push(`/admin/orders_form`);
    },
    formaterDate(date) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      return new Date(date).toLocaleString("ru-RU", options);
    },
    rowClassName({ row, rowIndex }) {
      return "table-header";
    },
  },
};
</script>
<style lang="scss" scoped>
.search {
  max-width: 300px;
}
.df {
  display: flex;
  align-items: center;
}
.img-part span {
  margin-left: 0.5rem;
}
.table {
  margin: 0 auto;
}
.table i {
  font-size: 18px;
  cursor: pointer;
  color: #2688cd;
}
.red {
  color: #2688cd;
}
</style>
