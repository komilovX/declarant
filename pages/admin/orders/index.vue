<template>
  <div>
    <div class="header df-sb p1 bb mb1">
      <h2>Заявки</h2>
      <el-button type="success" size="medium" @click="goToForm()">
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
        <el-table-column width="150" label="Дата" align="center" sortable>
          <template slot-scope="{ row: { date } }">
            <i class="el-icon-time" />
            {{ formaterDate(date) }}
          </template>
        </el-table-column>

        <el-table-column
          width="180"
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
          width="120"
          prop="post_number"
          label="Пост номер"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column width="180" label="Статус" align="center">
          <template slot-scope="{ row: { percent = 0 } }">
            <el-progress :percentage="Number(+percent).toFixed(1)" />
          </template>
        </el-table-column>
        <el-table-column label="Услуги" align="center">
          <template slot-scope="{ row: { id, status }, row }">
            <div class="df-se" v-if="!row.deleted">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-view"
                plain
                circle
                @click="$router.push(`/admin/orders/detail/${id}`)"
              />
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                plain
                circle
                @click="$router.push(`/admin/orders/${id}`)"
              />
              <el-button
                v-if="status == 'active'"
                type="danger"
                size="small"
                icon="el-icon-delete"
                plain
                circle
                @click="deleteOrder(row)"
              />
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
      const orders = await $axios.$get("api/orders");
      console.log("orders", orders);
      return { orders };
    } catch (e) {
      console.log(e);
    }
  },
  data: () => ({
    loading: false,
    search: "",
  }),
  // validate({store, error}) {
  //   const {role = null } = store.getters['auth/user']
  //   if (role == 1 || role == 2) {
  //     return true
  //   }
  //   return false
  // },
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
    tableRowClassName({ row, rowIndex }) {
      if (row.deleted == 1) {
        return "deleted-row";
      } else if (row.status == "done") {
        return "finished-row";
      }
      return "";
    },
    async deleteOrder(row) {
      const text = "Уверены, что хотите удалить этого заявка?";
      this.$confirm(text, "Подтверждение", {
        confirmButtonText: "Да",
        cancelButtonText: "Отменить",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$axios.$put(`api/orders/${row.id}/delete`);
            row.deleted = true;
          } catch (e) {
            console.log(e);
          }
        })
        .catch(() => {});
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
