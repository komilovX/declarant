<template>
  <div>
    <div class="header df p1 bb mb1">
      <div class="df">
        <i class="el-icon-arrow-left mr1 arrow-back" @click="$router.back()" />
        <h2>#{{ $route.params.id }}</h2>
      </div>
    </div>
    <OrderInfo :order="order" />
    <el-row :gutter="20">
      <el-row :gutter="20" class="p1">
        <!-- Входящие документы -->
        <el-col :span="24" :md="12" :sm="24" class="mb2">
          <h4 class="text-center mb1">Входящие документы</h4>
          <el-table border :data="incoming_documents" size="mini">
            <el-table-column
              width="80"
              label="№"
              align="center"
              prop="number"
            />
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
        <!-- Документы оформленные -->
        <el-col :span="24" :md="12" :sm="24" class="mb2">
          <h4 class="text-center mb1">Документы оформленные</h4>
          <el-table :data="decorated_documents" size="mini">
            <el-table-column
              width="60"
              label="№"
              align="center"
              prop="number"
            />
            <el-table-column
              width="180"
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
            <el-table-column width="80" label="Удалить" align="center">
              <template slot-scope="{ row: { id, declarant_id } }">
                <el-button
                  v-if="declarant_id == user.userId"
                  @click="deleteDocument(id, 'decorated')"
                  :loading="decoratedDeleteLoading"
                  icon="el-icon-delete"
                  size="small"
                  type="text"
                  class="delete-button"
                />
              </template>
            </el-table-column>
          </el-table>

          <el-form
            :model="decoratedForm"
            ref="decoratedForm"
            :rules="decoratedRules"
          >
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
                    action="https://localhost:3000"
                    :auto-upload="false"
                    :on-change="
                      (file, fileList) =>
                        handleChange(file, fileList, 'decoratedForm')
                    "
                  >
                    <el-button size="medium" type="primary"
                      >Загрузить</el-button
                    >
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
                    >Добавить</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <!-- Declarant -->
      <el-col :span="22" :offset="1" class="mb1">
        <div class="df-sb mb1">
          <h4>Необходимые документы</h4>
          <el-button type="text" @click="openTaskDialog">
            Дать задание
          </el-button>
        </div>
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
            <template slot-scope="{ row: { file, changed } }">
              <a
                v-if="file"
                :href="`/uploads/${file}`"
                class="download-url"
                target="_blank"
                >Посмотреть</a
              >
              <el-upload
                v-else-if="changed"
                ref="fileUpload"
                :auto-upload="false"
                action="http://localhost:3000"
                :on-change="
                  (file, fileList) => handleChange(file, fileList, 'fileForm')
                "
              >
                <el-button size="small" type="primary"
                  >Загрузить файл</el-button
                >
              </el-upload>
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
            <template
              slot-scope="{
                row: { declarant_id, price, currency, changed },
                $index,
              }"
            >
              <div v-if="!changed">
                <span v-if="declarant_id == user.userId"
                  >{{ price || 0 }} {{ getCurrency(currency) }}</span
                >
                <span v-else>-</span>
              </div>
              <div class="df" v-else>
                <el-input
                  size="small"
                  class="mr1"
                  type="number"
                  v-model="declarant_documents[$index].price"
                />
                <el-select
                  size="small"
                  v-model="declarant_documents[$index].currency"
                  placeholder="Валюта"
                >
                  <el-option
                    v-for="s in currencyList"
                    :key="s.type"
                    :label="s.type"
                    :value="s.value"
                  />
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="Примечание"
            align="center"
            prop="comment"
            show-overflow-tooltip
          >
            <template
              slot-scope="{
                row: { declarant_id, changed, comment },
                $index,
                row,
              }"
            >
              <div v-if="!changed">
                <span v-if="declarant_id == user.userId">{{ comment }}</span>
                <span v-else>-</span>
              </div>
              <div class="df" v-else>
                <el-input
                  size="small"
                  class="mr1"
                  type="text"
                  v-model="declarant_documents[$index].comment"
                />
                <el-button
                  @click="updateDocument(row, 'declarant')"
                  :loading="loading"
                  icon="el-icon-check"
                  size="small"
                  style="color: #67c23a;"
                  type="text"
                  class="delete-button"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column width="140" label="Изменить" align="center">
            <template
              slot-scope="{ row: { id, declarant_id, changed, status }, row }"
            >
              <div class="df-c" v-if="declarant_id == user.userId">
                <div class="mr1">
                  <el-button
                    v-if="!changed"
                    @click="row.changed = true"
                    icon="el-icon-edit"
                    size="small"
                    style="color: #409eff;"
                    type="text"
                    class="delete-button"
                  />
                  <el-button
                    v-else
                    @click="row.changed = false"
                    icon="el-icon-close"
                    size="small"
                    style="color: #909399;"
                    type="text"
                    class="delete-button"
                  />
                </div>
                <el-button
                  v-if="status == 'new'"
                  @click="deleteDocument(id, 'declarant')"
                  :loading="declarantDeleteLoading"
                  icon="el-icon-delete"
                  size="small"
                  type="text"
                  class="delete-button"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- Declarant Form -->
        <el-form
          :model="declarantForm"
          class="mt1"
          ref="declarantForm"
          :rules="rules"
        >
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
                <el-select
                  v-model="declarantForm.name"
                  filterable
                  @change="(val) => onSelectChange(val, 'declarantForm')"
                  class="width90"
                  placeholder="Название"
                >
                  <el-option
                    v-for="c in declarantDocuments"
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
                  v-model="declarantForm.price"
                  type="text"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="2" :sm="6">
              <el-form-item prop="currency">
                <el-select v-model="declarantForm.currency">
                  <el-option
                    v-for="s in currencyList"
                    :key="s.type"
                    :label="s.type"
                    :value="s.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="3" :sm="18">
              <el-upload
                ref="declarantUpload"
                style="margin-top: 5px;"
                :auto-upload="false"
                action="http://localhost:3000"
                :on-change="
                  (file, fileList) =>
                    handleChange(file, fileList, 'declarantForm')
                "
              >
                <el-button size="small" type="primary"
                  >Загрузить файл</el-button
                >
              </el-upload>
            </el-col>
            <el-col :span="24" :md="6" :sm="24">
              <el-form-item prop="comment">
                <el-input
                  placeholder="Примечание"
                  v-model="declarantForm.comment"
                  type="text"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="3" :sm="18" class="mb1">
              <el-form-item id="submit-button">
                <el-button
                  size="medium"
                  type="success"
                  @click="submitForm('declarantForm')"
                  :loading="declarantFormLoading"
                  >Добавить</el-button
                >
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
          <el-table-column
            width="250"
            label="Наименование"
            align="center"
            prop="name"
          />
          <el-table-column
            width="200"
            label="Сумма"
            align="center"
            prop="price"
            show-overflow-tooltip
          >
            <template
              slot-scope="{ row: { changed, price, currency }, $index }"
            >
              <div v-if="!changed">
                {{ price || 0 }} {{ getCurrency(currency) }}
              </div>
              <div class="df" v-else>
                <el-input
                  size="small"
                  class="mr1"
                  type="number"
                  v-model="services[$index].price"
                />
                <el-select
                  size="small"
                  v-model="services[$index].currency"
                  placeholder="Валюта"
                >
                  <el-option
                    v-for="s in currencyList"
                    :key="s.type"
                    :label="s.type"
                    :value="s.value"
                  />
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="Примечание"
            align="center"
            prop="comment"
            show-overflow-tooltip
          >
            <template slot-scope="{ row: { changed, comment }, $index, row }">
              <div v-if="!changed">
                {{ comment }}
              </div>
              <div class="df" v-else>
                <el-input
                  size="small"
                  class="mr1"
                  type="text"
                  v-model="services[$index].comment"
                />
                <el-button
                  @click="updateDocument(row, 'service')"
                  :loading="loading"
                  icon="el-icon-check"
                  size="small"
                  style="color: #67c23a;"
                  type="text"
                  class="delete-button"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column width="140" label="Изменить" align="center">
            <template
              slot-scope="{ row: { id, user_id, changed, status }, row }"
            >
              <div class="df-c" v-if="user_id == user.userId">
                <div class="mr1">
                  <el-button
                    v-if="!changed"
                    @click="row.changed = true"
                    icon="el-icon-edit"
                    size="small"
                    style="color: #409eff;"
                    type="text"
                    class="delete-button"
                  />
                  <el-button
                    v-else
                    @click="row.changed = false"
                    icon="el-icon-close"
                    size="small"
                    style="color: #909399;"
                    type="text"
                    class="delete-button"
                  />
                </div>
                <el-button
                  v-if="status == 'new'"
                  @click="deleteService(id)"
                  :loading="deleteloading"
                  icon="el-icon-delete"
                  size="small"
                  type="text"
                  class="delete-button"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
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
                    v-for="s in service_documents"
                    :key="s.id"
                    :label="s.number"
                    :value="s.number"
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
                    v-for="s in service_documents"
                    :key="s.id"
                    :label="s.name"
                    :value="s.name"
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
      </el-col>
    </el-row>
    <GiveTaskDialog
      :visible="taskDialog"
      :service_documents="service_documents"
      :declarant_documents="documents.filter((d) => d.type == 'declarant')"
      :declarants="declarants"
      :order_id="order.id"
      @handleClose="taskDialog = false"
      @documentGiven="($event) => declarant_documents.push($event)"
      @serviceGiven="() => $message.success('задание дало')"
    />
  </div>
</template>

<script>
import OrderInfo from '@/components/OrderInfo.vue'
import GiveTaskDialog from '@/components/GiveTaskDialog.vue'
import {
  createFormData,
  capitalize,
  clearForm,
  handleFile,
} from '@/utils/order.util'
export default {
  middleware: ['admin-auth'],
  async asyncData({ $axios, store, route }) {
    try {
      const {
        order = [],
        incoming_documents = [],
        declarant_documents = [],
        decorated_documents = [],
      } = await $axios.$get(`api/orders/${route.params.id}/details`)
      const documents = await $axios.$get('api/document')
      const service_documents = await store.dispatch('service/getDocuments')
      const services = await $axios.$get(`api/service/user/${route.params.id}`)

      return {
        order,
        incoming_documents,
        declarant_documents,
        decorated_documents,
        service_documents,
        services,
        documents,
      }
    } catch (e) {
      console.log(e)
    }
  },
  data() {
    return {
      loading: false,
      decoratedFormLoading: false,
      declarantFormLoading: false,
      decoratedDeleteLoading: false,
      declarantDeleteLoading: false,
      serviceLoading: false,
      deleteloading: false,
      taskDialog: false,
      declarants: [],
      // decorated
      currencyList: [
        { type: '$', value: '$' },
        { type: 'сум', value: 'sum' },
        { type: 'перечисление', value: 'invoice' },
      ],
      fileForm: { file: '' },
      decoratedForm: {
        number: '',
        name: '',
        file: '',
      },
      decoratedRules: {
        number: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
      },
      serviceForm: {
        number: '',
        name: '',
        price: '',
        currency: '$',
        comment: '',
      },
      rules: {
        number: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
      },
      declarantForm: {
        number: '',
        name: '',
        price: '',
        currency: '$',
        comment: '',
        file: '',
      },
    }
  },
  mounted() {
    this.declarant_documents = this.declarant_documents.map((value) => ({
      ...value,
      changed: false,
    }))
    this.services = this.services.map((value) => ({
      ...value,
      changed: false,
    }))
  },
  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
    decoratedDocuments() {
      const ids = this.decorated_documents.map((d) => d.number)
      return this.documents
        .filter((d) => d.type == 'decorated')
        .filter((d) => !ids.includes(d.number))
    },
    declarantDocuments() {
      const ids = this.declarant_documents.map((d) => d.number)
      return this.documents
        .filter((d) => d.type == 'declarant')
        .filter((d) => !ids.includes(d.number))
    },
  },
  methods: {
    getCurrency(currency) {
      return this.currencyList.find((c) => c.value == currency)
        ? this.currencyList.find((c) => c.value == currency).type
        : currency
    },
    async openTaskDialog() {
      try {
        const declarants = await this.$store.dispatch('auth/findAllDeclarants')
        this.declarants = declarants
        this.taskDialog = true
      } catch (e) {
        console.log('e', e)
      }
    },
    async deleteService(id) {
      try {
        this.deleteloading = true
        await this.$axios.$delete(`api/service/${id}`)
        this.deleteloading = false
        this.services = this.services.filter((f) => f.id != id)
      } catch (e) {
        this.deleteloading = false
        console.log(e)
      }
    },
    handleChange(...options) {
      handleFile.bind(this)(...options)
    },
    onSelectChange(val, formName) {
      const document = this.documents.find(
        (d) => d.number == val || d.name == val
      )
      if (document) {
        this[formName].name = document.name
        this[formName].number = document.number
      }
    },
    onServiceSelectChange(val, formName) {
      const document = this.service_documents.find(
        (d) => d.number == val || d.name == val
      )
      if (document) {
        this[formName].name = document.name
        this[formName].number = document.number
      }
    },
    async deleteDocument(id, document) {
      try {
        const type = capitalize(document)
        this[`${document}DeleteLoading`] = true
        await this.$store.dispatch(`orders/delete${type}Document`, id)
        this[`${document}DeleteLoading`] = false
        this[`${document}_documents`] = this[`${document}_documents`].filter(
          (d) => d.id != id
        )
      } catch (e) {
        this[`${document}DeleteLoading`] = false
        console.log(e)
      }
    },
    async updateDocument(row, type) {
      try {
        this.loading = true
        if (type == 'service') {
          await this.$axios.$put(`api/service/${row.id}`, {
            price: row.price,
            total_price: row.price,
            currency: row.currency || '$',
            comment: !!row.comment ? row.comment : '',
            status: 'done',
          })
        } else {
          const fd = new FormData()
          fd.append('price', row.price)
          fd.append('total_price', row.price)
          fd.append('currency', row.currency || '$')
          fd.append('comment', !row.comment ? row.comment : '')
          fd.append('status', row.status == 'task' ? 'done' : 'new')
          if (this.fileForm.file) {
            fd.append('file', this.fileForm.file.raw, this.fileForm.file.name)
          }
          const result = await this.$axios.$put(
            `api/orders/declarant/${row.id}`,
            fd
          )
          row.file = result.file
          row.price = result.price
        }
        row.changed = false
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    submitService(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            this.serviceLoading = true
            const formData = {
              order_id: this.$route.params.id,
              total_price: this.serviceForm.price,
              ...this.serviceForm,
            }
            const service = await this.$store.dispatch(
              'orders/createService',
              formData
            )
            service.price = service.price || 0
            service.changed = false
            this.services.push(service)
            this.serviceLoading = false
            clearForm.bind(this)(formName)
          } catch (e) {
            this.serviceLoading = false
          }
        } else {
          return false
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this[`${formName}Loading`] = true
          try {
            const fd = createFormData.bind(this)(formName)
            const formData = {
              id: this.$route.params.id,
              form: fd,
            }
            const type = formName == 'decoratedForm' ? 'decorated' : 'declarant'
            const path = `add${capitalize(type)}Documents`
            const document = await this.$store.dispatch(
              `orders/${path}`,
              formData
            )
            document.changed = false
            this[`${type}_documents`].push(document)
            this[`${formName}Loading`] = false
            this.$message.success('Документ успешна добавлена')
            this.$refs[`${type}Upload`].clearFiles()
            clearForm.bind(this)(formName)
          } catch (error) {
            this[`${formName}Loading`] = false
            console.log(error)
          }
        } else {
          return false
        }
      })
    },
  },
  components: {
    OrderInfo,
    GiveTaskDialog,
  },
}
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
.mt2-5 {
  margin-top: 2.4rem;
}
.df-c {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
