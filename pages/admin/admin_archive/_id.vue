<template>
  <div>
    <div class="header df p1 bb">
      <i class="el-icon-arrow-left mr1 arrow-back" @click="$router.back()" />
      <h2>#{{ $route.params.id }}</h2>
    </div>
    <el-row :gutter="20" class="p1">
      <el-col :span="24" :md="12" :sm="24">
        <h4 class="mb1">Входящие документы</h4>
        <el-table border :data="incoming_documents" size="mini" class="mb2">
          <el-table-column width="100" label="№" align="center" prop="number" />
          <el-table-column width="250" label="Наименование" align="center" prop="name" />
          <el-table-column label="Файл" align="center">
            <template slot-scope="{ row: { file } }">
              <a
                v-if="file"
                :href="`/uploads/${file}`"
                class="download-url"
                target="_blank"
              >Посмотреть</a>
              <span v-else>No file</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" :md="12" :sm="24">
        <h4 class="mb1">Документы оформленные</h4>
        <el-table border :data="decorated_documents" size="mini" class="mb2">
          <el-table-column width="80" label="№" align="center" prop="number" />
          <el-table-column width="250" label="Наименование" align="center" prop="name" />
          <el-table-column label="Файл" align="center">
            <template slot-scope="{ row: { file } }">
              <a
                v-if="file"
                :href="`/uploads/${file}`"
                class="download-url"
                target="_blank"
              >Посмотреть</a>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" :md="22" :offset="1" :sm="24" class="mb2">
        <div class="df-sb">
          <h4 class="text-center mb1">Необходимые Услуги, Документы</h4>
          <el-button type="text" @click="visibleDialog = true">Добавить услуг</el-button>
        </div>
        <div style="padding: 4px">
          <span>ИНВ:&nbsp;</span>
          <u>{{order.inv}}</u>&nbsp;|
          <span>ИНВ Сумма:&nbsp;</span>
          <u>{{order.inv_price}}</u>&nbsp;
        </div>
        <el-table border :data="serviceList" size="mini">
          <el-table-column width="100" label="№" align="center" prop="number" />
          <el-table-column width="180" label="Наименование" align="center" prop="name" />
          <el-table-column width="180" label="Сумма" align="center" show-overflow-tooltip>
            <template slot-scope="{ row: {price, currency} }">{{price}}&nbsp; {{currency}}</template>
          </el-table-column>
          <el-table-column width="180" label="Итог Сумма" align="center" show-overflow-tooltip>
            <template slot-scope="{ row: {changed, total_price}, $index}">
              <span v-if="!changed">{{total_price}}</span>
              <el-input v-else type="number" v-model="serviceList[$index].total_price" />
            </template>
          </el-table-column>
          <el-table-column label="Примечание" align="center" prop="comment" show-overflow-tooltip />
        </el-table>
        <div class="total-sum">
          <h2 class="mr2">Итого:</h2>
          <h2 class="mr2">{{getTotalSum}}</h2>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { clearForm } from "@/utils/order.util";
export default {
  async asyncData({ $axios, route }) {
    try {
      const {
        order = [],
        incoming_documents = [],
        declarant_documents = [],
        decorated_documents = []
      } = await $axios.$get(`api/orders/${route.params.id}/details`);
      const services = await $axios.$get(
        `api/service/order/${route.params.id}`
      );
      return {
        order,
        incoming_documents,
        declarant_documents,
        decorated_documents,
        services
      };
    } catch (e) {
      console.log(e);
    }
  },
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    serviceList() {
      let service = this.services.map(
        ({ id, name, number, price, total_price, comment, currency }) => ({
          id,
          name,
          number,
          price,
          total_price,
          currency,
          comment,
          changed: false,
          type: "service"
        })
      );
      let declarant = this.declarant_documents.map(
        ({ id, name, number, price, total_price, comment, currency }) => ({
          id,
          name,
          number,
          price,
          total_price,
          currency,
          comment,
          changed: false,
          type: "declarant"
        })
      );

      return service.concat(declarant);
    },
    getTotalSum() {
      let dollar = 0;
      let sum = 0;
      this.serviceList.forEach(s => {
        s.currency == "$"
          ? (dollar += +s.total_price)
          : (sum += +s.total_price);
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
.download-url {
  display: inline-block;
  padding: 0.2rem 1rem;
  background: #555;
  color: #fff;
  &:hover {
    background: #666;
    color: #fafef2;
    border-radius: 2px;
  }
}
.file-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.total-sum {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
}
</style>
