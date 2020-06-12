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
          <el-table-column label="Изм Сумма" align="center">
            <template slot-scope="{row: {changed}, row}">
              <el-button
                v-if="!changed"
                type="primary"
                @click="row.changed = true"
                size="small"
                icon="el-icon-edit"
                circle
                plain
              />
              <div v-else class="df" style="display: inline-block">
                <el-button
                  type="success"
                  :loading="loading"
                  @click="updatePrice(row)"
                  size="small"
                  icon="el-icon-check"
                  circle
                  plain
                />
                <el-button
                  type="danger"
                  @click="() => {row.changed = false, row.total_price = row.price}"
                  size="small"
                  icon="el-icon-close"
                  circle
                  plain
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Примечание" align="center" prop="comment" show-overflow-tooltip />
        </el-table>
        <div class="total-sum">
          <h2 class="mr2">Итого:</h2>
          <h2 class="mr2">{{getTotalSum}}</h2>
          <el-button
            size="medium"
            v-if="declarant_documents.length > 0"
            type="success"
            @click="changeOrderStatus()"
            :loading="finishLoading"
          >Закончить</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- Decorated_File Dialog -->
    <el-dialog title="Загрузить" :visible.sync="visibleDialog" width="70%">
      <el-form :model="serviceForm" ref="serviceForm" class="mt1" :rules="rules">
        <el-row :gutter="15">
          <el-col :span="24" :md="3" :sm="24">
            <el-form-item prop="number">
              <el-input placeholder="Номер" v-model="serviceForm.number" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="4" :sm="24">
            <el-form-item prop="name">
              <el-input placeholder="Название" v-model="serviceForm.name" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="4" :sm="18">
            <el-form-item prop="price">
              <el-input placeholder="Сумма" v-model="serviceForm.price" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="2" :sm="6">
            <el-form-item prop="currency">
              <el-select v-model="serviceForm.currency" placeholder="Валюта">
                <el-option v-for="s in currencyList" :key="s" :label="s" :value="s" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="7" :sm="24">
            <el-form-item prop="comment">
              <el-input placeholder="Примечание" v-model="serviceForm.comment" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="4" :sm="24">
            <el-form-item id="submit-button">
              <el-button
                size="medium"
                type="success"
                @click="submitService('serviceForm')"
                :loading="serviceLoading"
              >Добавить</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
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
    return {
      loading: false,
      loading2: false,
      serviceLoading: false,
      finishLoading: false,
      visibleDialog: false,
      currencyList: ["$", "sum"],
      serviceForm: {
        number: "",
        name: "",
        price: "",
        currency: "$",
        comment: ""
      },
      rules: {
        number: [
          {
            required: true,
            message: "Пожалуйста, введите название деятельности",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "Пожалуйста, введите название деятельности",
            trigger: "blur"
          }
        ],
        price: [
          {
            required: true,
            message: "Пожалуйста, введите название деятельности",
            trigger: "blur"
          }
        ]
      }
    };
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
  methods: {
    async changeOrderStatus() {
      try {
        this.finishLoading = true;
        let status = "done";
        const formData = { status };
        await this.$axios.$put(`api/orders/${this.order.id}/status`, formData);
        this.finishLoading = false;
        this.$router.push("/admin/orders");
      } catch (e) {
        this.finishLoading = false;
        console.log(e);
      }
    },
    // ////
    async updatePrice(row) {
      try {
        console.log("row", row);
        this.loading = true;
        const formData = { total_price: row.total_price };
        if (row.type == "service") {
          await this.$axios.$put(`api/service/${row.id}`, formData);
        } else {
          await this.$axios.$put(`api/orders/declarant/${row.id}`, formData);
        }
        row.changed = false;
        this.loading = false;
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    },
    submitService(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.serviceLoading = true;
            const formData = {
              order_id: this.$route.params.id,
              total_price: this.serviceForm.price,
              ...this.serviceForm
            };
            const service = await this.$store.dispatch(
              "orders/createService",
              formData
            );
            this.services.push(service);
            this.serviceLoading = false;
            clearForm.bind(this)(formName);
          } catch (e) {
            this.serviceLoading = false;
          }
        } else {
          return false;
        }
      });
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