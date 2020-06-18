<template>
  <div>
    <div class="header df-sb p1 bb mb1">
      <h2>Заявки</h2>
      <el-button
        type="success"
        size="medium"
        @click="$router.push('/admin/orders_form')"
      >
        Добавить
      </el-button>
    </div>
    <div class="table p05">
      <el-input
        v-model="search"
        placeholder="Быстрый поиск"
        prefix-icon="el-icon-search"
        size="medium"
        style="width: 20%; margin: 5px 15px;"
      />
      <div style="display: inline-block;">
        <div class="mini-cube" />
        <span> - Мои Заявки</span>
      </div>
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
          width="180"
          prop="creator"
          label="Cоздатель"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          width="200"
          prop="client_company"
          label="Клиент фирма"
          align="center"
          show-overflow-tooltip
        />

        <el-table-column
          width="180"
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
          <template
            slot-scope="{ row: { id, deleted, creator_id } }"
            class="df"
          >
            <el-button
              v-if="!deleted"
              type="primary"
              size="medium"
              @click="$router.push(`/admin/detail/${id}`)"
              >посмотреть</el-button
            >
            <el-button
              v-if="creator_id == user.userId"
              type="primary"
              size="small"
              icon="el-icon-edit"
              plain
              circle
              @click="$router.push(`/admin/orders/${id}`)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<style>
.el-table .today-row .date-span {
  color: #363636;
  font-weight: 600;
}
.el-table .own-order {
  background-color: #f8fdcd;
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
      search: "",
    };
  },
  methods: {
    formaterDate(date) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      return new Date(date).toLocaleString("ru-RU", options);
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.deleted == 1) {
        return "deleted-row";
      }
      if (row.creator_id == this.user.userId) {
        return "own-order";
      }
      return "";
    },
    rowClassName() {
      return "table-header";
    },
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
  },
  validate({ store, error }) {
    const { role = null } = store.getters["auth/user"];
    if (role == "declarant") {
      return true;
    }
    return false;
  },
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
.mini-cube {
  display: inline-block;
  vertical-align: middle;
  width: 50px;
  height: 25px;
  background-color: #f8fdcd;
}
</style>
