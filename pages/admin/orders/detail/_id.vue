<template>
  <div>
    <div class="header df p1 bb">
      <i class="el-icon-arrow-left mr1 arrow-back" @click="$router.back()" />
      <h2>#{{ $route.params.id }}</h2>
    </div>
    <ul class="order-detail">
      <li>
        <span class="name">Дата:</span>
        <span class="value">{{ order.date }}</span>
      </li>
      <li>
        <span class="name">Дата прибытие:</span>
        <span class="value">{{ order.date_income }}</span>
      </li>
      <li>
        <span class="name">Клиент фирма:</span>
        <span class="value">{{ order.client_company }}</span>
      </li>
      <li>
        <span class="name">Название товара:</span>
        <span class="value">{{ order.product }}</span>
      </li>
      <li>
        <span class="name">Пост номер:</span>
        <span class="value">{{ order.post_number }}</span>
      </li>
      <li>
        <span class="name">Статус:&nbsp;</span>
        <span class="value">
          <el-progress
            style="display: inline-block; min-width: 60%;"
            :percentage="+Number(+order.percent).toFixed(1)"
          />
        </span>
      </li>
    </ul>
    <!-- <el-table :data="[order]" size="mini" class="p1 mb2">
      <el-table-column
        width="90"
        prop="id"
        label="Ном зая"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column width="180" label="Дата" align="center">
        <template slot-scope="{ row: { date } }">
          <i class="el-icon-time" />
          {{ formaterDate(date) }}
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        prop="creator"
        label="Cоздатель"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        width="160"
        prop="client_company"
        label="Клиент фирма"
        align="center"
        show-overflow-tooltip
      />

      <el-table-column
        width="160"
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
      <el-table-column width="200" label="Статус" align="center">
        <template slot-scope="{ row: { percent = 0 } }">
          <el-progress :percentage="+Number(+percent).toFixed(1)" />
        </template>
      </el-table-column>
    </el-table> -->
    <el-row :gutter="20" class="p1">
      <el-col :span="24" :md="12" :sm="24">
        <h4 class="mb1">Входящие документы</h4>
        <el-table border :data="incoming_documents" size="mini" class="mb2">
          <el-table-column width="100" label="№" align="center" prop="number" />
          <el-table-column
            width="250"
            label="Наименование"
            align="center"
            prop="name"
          />
          <el-table-column label="Файл" align="center">
            <template slot-scope="{ row: { file } }">
              <a
                v-if="file"
                :href="`/uploads/${file}`"
                class="download-url"
                target="_blank"
                >Посмотреть</a
              >
              <span v-else>No file</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" :md="12" :sm="24">
        <h4 class="mb1">Документы оформленные</h4>
        <el-table border :data="decorated_documents" size="mini" class="mb2">
          <el-table-column width="80" label="№" align="center" prop="number" />
          <el-table-column
            width="250"
            label="Наименование"
            align="center"
            prop="name"
          />
          <el-table-column label="Файл" align="center">
            <template slot-scope="{ row: { file } }">
              <a
                v-if="file"
                :href="`/uploads/${file}`"
                class="download-url"
                target="_blank"
                >Посмотреть</a
              >
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="mb2">
        <div class="df-sb">
          <h4 class="text-center mb1">Необходимые Услуги, Документы</h4>
          <el-button type="text" @click="visibleDialog = true"
            >Добавить услуг</el-button
          >
        </div>
        <div style="padding: 4px;">
          <span>ИНВ:&nbsp;</span>
          <u>{{ order.inv }}</u
          >&nbsp;|
          <span>ИНВ Сумма:&nbsp;</span>
          <u>{{ order.inv_price }}</u
          >&nbsp;{{ order.currency }}
        </div>
        <el-table border :data="serviceList" size="mini">
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
            label="Cоздатель"
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
              <el-button
                v-if="!changed"
                type="text"
                @click="row.changed = true"
                size="small"
                class="delete-button"
                style="color: #409eff;"
                icon="el-icon-edit"
              />

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
                      (row.changed = false), (row.total_price = row.price);
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
            prop="comment"
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
      </el-col>
    </el-row>

    <el-dialog title="Загрузить" :visible.sync="visibleDialog" width="70%">
      <el-form
        :model="serviceForm"
        ref="serviceForm"
        class="mt1"
        :rules="rules"
      >
        <el-row :gutter="15">
          <el-col :span="24" :md="3" :sm="24">
            <el-form-item prop="number">
              <el-select
                v-model="serviceForm.number"
                filterable
                @change="(val) => onServiceSelectChange(val, 'serviceForm')"
                placeholder="№"
              >
                <el-option
                  v-for="(c, index) in serviceDocuments"
                  :key="index"
                  :label="c"
                  :value="c"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="4" :sm="24">
            <el-form-item prop="name">
              <el-select
                v-model="serviceForm.name"
                filterable
                @change="(val) => onServiceSelectChange(val, 'serviceForm')"
                placeholder="Название"
              >
                <el-option
                  v-for="c in serviceDocuments"
                  :key="c.id"
                  :label="c.name"
                  :value="c.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="4" :sm="18">
            <el-form-item prop="price">
              <el-input
                placeholder="Сумма"
                v-model="serviceForm.price"
                type="text"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="2" :sm="6">
            <el-form-item prop="currency">
              <el-select v-model="serviceForm.currency" placeholder="Валюта">
                <el-option
                  v-for="s in currencyList"
                  :key="s.type"
                  :label="s.type"
                  :value="s.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="7" :sm="24">
            <el-form-item prop="comment">
              <el-input
                placeholder="Примечание"
                v-model="serviceForm.comment"
                type="text"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="4" :sm="24">
            <el-form-item id="submit-button">
              <el-button
                size="medium"
                type="success"
                @click="submitService('serviceForm')"
                :loading="serviceLoading"
                >Добавить</el-button
              >
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
  async asyncData({ $axios, store, route }) {
    try {
      const {
        order = {},
        incoming_documents = [],
        declarant_documents = [],
        decorated_documents = [],
      } = await $axios.$get(`api/orders/${route.params.id}/details`);
      const services = await $axios.$get(
        `api/service/order/${route.params.id}`
      );
      const service_documents = await store.dispatch("service/getDocuments");
      return {
        order,
        incoming_documents,
        declarant_documents,
        decorated_documents,
        service_documents,
        services,
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
      currencyList: [
        { type: "$", value: "$" },
        { type: "сум", value: "sum" },
        { type: "перечисление", value: "invoice" },
      ],
      serviceForm: {
        number: "",
        name: "",
        price: "",
        currency: "$",
        comment: "",
      },
      rules: {
        number: [
          {
            required: true,
            message: "Пожалуйста, введите название деятельности",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "Пожалуйста, введите название деятельности",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    serviceList() {
      let service = this.services.map(
        ({
          id,
          name,
          user,
          number,
          price,
          total_price,
          comment,
          currency,
        }) => ({
          id,
          name,
          creator: user,
          number,
          price,
          total_price,
          currency,
          comment,
          changed: false,
          type: "service",
        })
      );
      let declarant = this.declarant_documents.map(
        ({
          id,
          name,
          declarant,
          file,
          number,
          price,
          total_price,
          comment,
          currency,
        }) => ({
          id,
          name,
          creator: declarant,
          number,
          price,
          file,
          total_price,
          currency,
          comment,
          changed: false,
          type: "declarant",
        })
      );

      return service.concat(declarant);
    },
    getTotalSum() {
      let dollar = 0;
      let sum = 0;
      let invoice = 0;
      this.serviceList.forEach((s) => {
        if (s.currency == "$") {
          dollar += +s.total_price;
        } else if (s.currency == "sum") {
          sum += +s.total_price;
        } else {
          invoice += +s.total_price;
        }
      });
      return `${dollar} $  ${sum} сум | перечисление: ${invoice} `;
    },
    serviceDocuments() {
      return this.service_documents.map((d) => d.number);
    },
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
    onServiceSelectChange(val, formName) {
      const document = this.service_documents.find(
        (d) => d.number == val || d.name == val
      );
      if (document) {
        this[formName].name = document.name;
        this[formName].number = document.number;
      }
    },
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
        this.loading = true;
        if (row.type == "service") {
          await this.$axios.$put(`api/service/${row.id}`, {
            total_price: row.total_price,
          });
        } else {
          const fd = new FormData();
          fd.append("total_price", row.total_price);
          await this.$axios.$put(`api/orders/declarant/${row.id}`, fd);
        }
        row.changed = false;
        this.loading = false;
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    },
    submitService(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            this.serviceLoading = true;
            const formData = {
              order_id: this.$route.params.id,
              total_price: this.serviceForm.price,
              ...this.serviceForm,
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
    },
  },
  validate({ store, error }) {
    const { role = null } = store.getters["auth/user"];
    if (role == "admin") {
      return true;
    }
    return false;
  },
};
</script>

<style lang="scss" scoped>
.order-detail {
  padding: 1rem;
  max-width: 50%;
  overflow: hidden;
  list-style-type: none;
  & > li:not(:last-child) {
    border-bottom: 1px solid #eee;
    padding: 4px;
  }
}
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
