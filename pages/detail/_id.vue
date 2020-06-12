<template>
  <div>
    <div class="header df p1 bb mb1">
      <div class="df">
        <i class="el-icon-arrow-left mr1 arrow-back" @click="$router.back()" />
        <h2>#{{ $route.params.id }}</h2>
      </div>
    </div>
    <el-col :span="24" :md="16" :sm="24" :offset="4">
      <el-table border :data="serviceList" size="mini">
        <el-table-column width="100" label="№" align="center" prop="number" />
        <el-table-column width="180" label="Наименование" align="center" prop="name" />
        <el-table-column width="180" label="Сумма" align="center" show-overflow-tooltip>
          <template slot-scope="{ row: {total_price, currency}}">{{total_price}}&nbsp; {{currency}}</template>
        </el-table-column>
        <el-table-column label="Примечание" align="center" prop="comment" show-overflow-tooltip />
      </el-table>
      <div class="total-sum">
        <h2 class="mr2">Итого:</h2>
        <h2 class="mr2">{{getTotalSum}}</h2>
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  middleware: ["admin-auth"],
  async asyncData({ $axios, route, error }) {
    try {
      const { order = [], declarant_documents = [] } = await $axios.$get(
        `api/orders/${route.params.id}/details`
      );
      const services = await $axios.$get(`api/service/user/${route.params.id}`);

      return { order, declarant_documents, services };
    } catch (e) {
      console.log(e);
    }
  },
  data() {
    return {};
  },
  computed: {
    serviceList() {
      let service = this.services.map(
        ({ id, name, number, total_price, comment, currency }) => ({
          id,
          name,
          number,
          total_price,
          currency,
          comment,
          type: "service"
        })
      );
      let declarant = this.declarant_documents
        .filter(d => d.status == "finish")
        .map(({ id, name, number, total_price, comment, currency }) => ({
          id,
          name,
          number,
          total_price,
          currency,
          comment,
          type: "declarant"
        }));

      return service.concat(declarant);
    },
    getTotalSum() {
      let dollar = 0;
      let sum = 0;
      this.serviceList.forEach(s => {
        s.currency == "$" ? (dollar += s.total_price) : (sum += s.total_price);
      });

      return `${dollar} $  ${sum} сум`;
    }
  },
  validate({ store, error }) {
    const { role = null } = store.getters["auth/user"];
    if (role == "admin") {
      return true;
    }
    return false;
  }
};
</script>

<style lang="scss" scoped>
.total-sum {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
}
</style>
