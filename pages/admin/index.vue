<template>
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
      :row-class-name="tableRowClassName"
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
      <el-table-column width="150" label="Дата" align="center" sortable>
        <template slot-scope="{ row: { date } }">
          <i class="el-icon-time" />
          {{ formaterDate(date) }}
        </template>
      </el-table-column>
      <el-table-column
        width="250"
        prop="client_company"
        label="Клиент фирма"
        align="center"
        show-overflow-tooltip
      />

      <el-table-column
        width="250"
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
        <template slot-scope="{ row: { id, deleted } }" class="df">
          <el-button
            v-if="!deleted"
            type="primary"
            size="medium"
            @click="$router.push(`/admin/detail/${id}`)"
          >посмотреть</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style>
.el-table .today-row .date-span {
  color: #363636;
  font-weight: 600;
}
</style>
<script>
export default {
  middleware: ["admin-auth"],
  async asyncData({ $axios }) {
    try {
      const orders = await $axios.$get("api/orders");
      return { orders };
    } catch (e) {
      console.log(e);
    }
  },
  data() {
    return {
      search: ""
    };
  },
  methods: {
    formaterDate(date) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      };
      return new Date(date).toLocaleString("ru-RU", options);
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.deleted == 1) {
        return "deleted-row";
      }
      return "";
    },
    rowClassName() {
      return "table-header";
    }
  },
  validate({ store, error }) {
    const { role = null } = store.getters["auth/user"];
    if (role == "declarant") {
      return true;
    }
    return false;
  }
};
</script>
<style>
.el-table .hidden-row {
  opacity: 0.5;
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
.df {
  display: flex;
  align-items: center;
}
.img-part span {
  margin-left: 0.5rem;
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
