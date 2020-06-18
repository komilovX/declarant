<template>
  <div>
    <div class="header df p1 bb mb1">
      <h2>Мои Заявки</h2>
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
          width="100"
          prop="id"
          label="Ном заявки"
          align="center"
          show-overflow-tooltip
        />

        <el-table-column width="200" label="Дата" align="center" sortable>
          <template slot-scope="{ row: { createdAt } }">
            <i class="el-icon-time" />
            {{ formaterDate(createdAt) }}
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          prop="product_code"
          label="Код груза	"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          width="200"
          prop="post_number"
          label="Пост номер"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="Управлять" align="center">
          <template slot-scope="{ row: { id } }" class="df">
            <el-button
              type="primary"
              size="small"
              @click="$router.push(`/detail/${id}`)"
              >посмотреть</el-button
            >
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
</style>
<script>
export default {
  middleware: ["admin-auth"],
  async asyncData({ $axios }) {
    try {
      const orders = await $axios.$get("api/orders?client=true");
      return { orders };
    } catch (e) {
      console.log(e);
    }
  },
  data() {
    return {
      loading: false,
      visibleDialog: false,
      currencyList: ["$", "sum"],
      row: null,
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
    rowClassName() {
      return "table-header";
    },
    handleChange(file, fileList) {
      let type = file.raw.type;
      const idx = type.search(/png|jpeg|docx|doc|pdf/);
      if (idx == -1) {
        fileList = [];
        this.$message.error("файлы толка с расширением png|jpeg|docx|doc|pdf ");
        return;
      }
      this.declarantForm.file = file;
    },
    openDialog(row) {
      this.row = row;
      this.visibleDialog = true;
    },
  },
  validate({ store, redirect, error }) {
    const { role = null } = store.getters["auth/user"];
    if (role == "admin") {
      redirect("/admin/orders");
    } else if (role == "declarant") {
      redirect("/admin");
    }
    return true;
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
</style>
