<template>
  <div>
    <div class="header df p1 bb mb1">
      <div class="df">
        <i class="el-icon-arrow-left mr1 arrow-back" @click="$router.back()" />
        <h4>
          #{{ $route.params.id }} &nbsp; Клиент:
          <u>{{ order.client_company }}</u>&nbsp;| Товар:
          <u>{{ order.product }}</u>&nbsp;| ИНВ:
          <a
            :disabled="!order.inv_file"
            :href="`/uploads/${order.inv_file}`"
            target="_blank"
            style="color: blue;"
          >Посмотреть</a>
        </h4>
      </div>
    </div>
    <el-row :gutter="20">
      <el-row :gutter="20" class="p1">
        <!-- Входящие документы -->
        <el-col :span="24" :md="12" :sm="24" class="mb2">
          <h4 class="text-center mb1">Входящие документы</h4>
          <el-table border :data="incoming_documents" size="mini">
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
                <span v-else>No file</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <!-- Документы оформленные -->
        <el-col :span="24" :md="12" :sm="24" class="mb2">
          <h4 class="text-center mb1">Документы оформленные</h4>
          <el-table :data="decorated_documents" size="mini">
            <el-table-column width="60" label="№" align="center" prop="number" />
            <el-table-column width="170" label="Наименование" align="center" prop="name" />
            <el-table-column width="160" label="Файл" align="center">
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
            <el-table-column label="Удалить" align="center">
              <template slot-scope="{ row: { id, declarant_id } }">
                <el-button
                  v-if="declarant_id == user.userId"
                  @click="deleteDocument(id, 'decorated')"
                  :loading="decoratedDeleteLoading"
                  icon="el-icon-delete"
                  size="small"
                  circle
                  plain
                  type="danger"
                />
              </template>
            </el-table-column>
          </el-table>

          <el-form :model="decoratedForm" ref="decoratedForm" :rules="decoratedRules">
            <el-row :gutter="15">
              <el-col :span="24" :md="5" :sm="24">
                <el-form-item prop="number" label="Номер">
                  <el-select
                    v-model="decoratedForm.number"
                    filterable
                    @change="(val) => onSelectChange(val, 'decoratedForm')"
                    class="width90"
                  >
                    <el-option
                      v-for="c in decoratedDocuments"
                      :key="c.id"
                      :label="c.number"
                      :value="c.number"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" :md="8" :sm="24">
                <el-form-item prop="number" label="Наименование">
                  <el-input v-model="decoratedForm.name" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="24" :md="5" :sm="24" class="mt2-5">
                <el-form-item>
                  <el-upload
                    ref="decoratedUpload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="(file, fileList) => handleChange(file, fileList, 'decoratedForm')"
                  >
                    <el-button size="medium" type="primary">Загрузить</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="24" :md="5" :sm="24" class="mt2-5">
                <el-form-item id="submit-button">
                  <el-button
                    size="medium"
                    type="success"
                    @click="submitForm('decoratedForm')"
                    :loading="decoratedFormLoading"
                  >Добавить</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <!-- Declarant -->
      <el-col :span="22" :offset="1" class="mb1">
        <h4 class="text-center mb1">Необходимые документы</h4>
        <el-table border :data="declarant_documents" size="mini">
          <el-table-column width="80" label="№" align="center" prop="number" />
          <el-table-column
            width="200"
            label="Наименование"
            align="center"
            prop="name"
            show-overflow-tooltip
          />
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
          <el-table-column
            width="200"
            label="Сумма"
            align="center"
            prop="price"
            show-overflow-tooltip
          >
            <template slot-scope="{ row: { declarant_id, price } }">
              <span v-if="declarant_id == user.userId">{{ price }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="Примечание" align="center" prop="comment" show-overflow-tooltip>
            <template slot-scope="{ row: { declarant_id, comment } }">
              <span v-if="declarant_id == user.userId">{{ comment }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="Удалить" align="center">
            <template slot-scope="{ row: { id, declarant_id } }">
              <el-button
                v-if="declarant_id == user.userId"
                @click="deleteDocument(id, 'declarant')"
                :loading="declarantDeleteLoading"
                icon="el-icon-delete"
                size="small"
                circle
                plain
                type="danger"
              />
            </template>
          </el-table-column>
        </el-table>
        <!-- Declarant Form -->
        <el-form :model="declarantForm" class="mt1" ref="declarantForm" :rules="rules">
          <el-row :gutter="15">
            <el-col :span="24" :md="2" :sm="18">
              <el-form-item prop="number">
                <el-select
                  v-model="declarantForm.number"
                  filterable
                  @change="(val) => onSelectChange(val, 'declarantForm')"
                  class="width90"
                  placeholder="№"
                >
                  <el-option
                    v-for="c in declarantDocuments"
                    :key="c.id"
                    :label="c.number"
                    :value="c.number"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="4" :sm="24">
              <el-form-item prop="name">
                <el-input placeholder="Наименование" v-model="declarantForm.name" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="4" :sm="18">
              <el-form-item prop="price">
                <el-input placeholder="Сумма" v-model="declarantForm.price" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="2" :sm="6">
              <el-form-item prop="currency">
                <el-select v-model="declarantForm.currency">
                  <el-option v-for="s in currencyList" :key="s" :label="s" :value="s" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="3" :sm="18">
              <el-upload
                ref="declarantUpload"
                style="margin-top: 5px"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-change="(file, fileList) => handleChange(file, fileList, 'declarantForm')"
              >
                <el-button size="small" type="primary">Загрузить файл</el-button>
              </el-upload>
            </el-col>
            <el-col :span="24" :md="6" :sm="24">
              <el-form-item prop="comment">
                <el-input placeholder="Примечание" v-model="declarantForm.comment" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="3" :sm="18" class="mb1">
              <el-form-item id="submit-button">
                <el-button
                  size="medium"
                  type="success"
                  @click="submitForm('declarantForm')"
                  :loading="declarantFormLoading"
                >Добавить</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <!-- Uslug -->
      <el-col :span="22" :offset="1" class="mb1">
        <div class="ma1">
          <h4 class="text-center">Услуги</h4>
        </div>
        <el-table border :data="services" size="mini">
          <el-table-column width="80" label="№" align="center" prop="number" />
          <el-table-column width="250" label="Наименование" align="center" prop="name" />
          <el-table-column
            width="200"
            label="Сумма"
            align="center"
            prop="price"
            show-overflow-tooltip
          />
          <el-table-column
            width="250"
            label="Примечание"
            align="center"
            prop="comment"
            show-overflow-tooltip
          />
          <el-table-column label="Удалить" align="center">
            <template slot-scope="{ row: { id, user_id } }">
              <el-button
                v-if="user_id == user.userId"
                type="danger"
                @click="deleteService(id)"
                size="small"
                plain
                circle
                icon="el-icon-delete"
                :loading="deleteloading"
              />
            </template>
          </el-table-column>
        </el-table>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  createFormData,
  capitalize,
  clearForm,
  handleFile
} from "@/utils/order.util";
export default {
  middleware: ["admin-auth"],
  async asyncData({ $axios, route, error }) {
    try {
      const {
        order = [],
        incoming_documents = [],
        declarant_documents = [],
        decorated_documents = []
      } = await $axios.$get(`api/orders/${route.params.id}/details`);
      const documents = await $axios.$get("api/document");
      const services = await $axios.$get(`api/service/user/${route.params.id}`);

      return {
        order,
        incoming_documents,
        declarant_documents,
        decorated_documents,
        services,
        documents
      };
    } catch (e) {
      console.log(e);
    }
  },
  data() {
    return {
      decoratedFormLoading: false,
      declarantFormLoading: false,
      decoratedDeleteLoading: false,
      declarantDeleteLoading: false,
      serviceLoading: false,
      deleteloading: false,
      // decorated
      currencyList: ["$", "sum"],
      decoratedForm: {
        number: "",
        name: "",
        file: ""
      },
      decoratedRules: {
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
        ]
      },
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
      },
      declarantForm: {
        number: "",
        name: "",
        price: "",
        currency: "$",
        comment: "",
        file: ""
      }
    };
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    decoratedDocuments() {
      const ids = this.decorated_documents.map(d => d.number);
      return this.documents
        .filter(d => d.type == "decorated")
        .filter(d => !ids.includes(d.number));
    },
    declarantDocuments() {
      const ids = this.declarant_documents.map(d => d.number);
      return this.documents
        .filter(d => d.type == "declarant")
        .filter(d => !ids.includes(d.number));
    }
  },
  methods: {
    async deleteService(id) {
      try {
        this.deleteloading = true;
        await this.$axios.$delete(`api/service/${id}`);
        this.deleteloading = false;
        this.services = this.services.filter(f => f.id != id);
      } catch (e) {
        this.deleteloading = false;
        console.log(e);
      }
    },
    handleChange(...options) {
      handleFile.bind(this)(...options);
    },
    onSelectChange(val, formName) {
      const document = this.documents.find(d => d.number == val);
      if (document) {
        this[formName].name = document.name;
      }
    },
    async deleteDocument(id, document) {
      try {
        const type = capitalize(document);
        this[`${document}DeleteLoading`] = true;
        await this.$store.dispatch(`orders/delete${type}Document`, id);
        this[`${document}DeleteLoading`] = false;
        this[`${document}_documents`] = this[`${document}_documents`].filter(
          d => d.id != id
        );
      } catch (e) {
        this[`${document}DeleteLoading`] = false;
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
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this[`${formName}Loading`] = true;
          try {
            const fd = createFormData.bind(this)(formName);
            const formData = {
              id: this.$route.params.id,
              form: fd
            };
            const type =
              formName == "decoratedForm" ? "decorated" : "declarant";
            const path = `add${capitalize(type)}Documents`;
            const document = await this.$store.dispatch(
              `orders/${path}`,
              formData
            );
            this[`${type}_documents`].push(document);
            this[`${formName}Loading`] = false;
            this.$message.success("Документ успешна добавлена");
            this.$refs[`${type}Upload`].clearFiles();
            clearForm.bind(this)(formName);
          } catch (error) {
            this[`${formName}Loading`] = false;
            console.log(error);
          }
        } else {
          return false;
        }
      });
    }
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
.mt2-5 {
  margin-top: 2.4rem;
}
</style>