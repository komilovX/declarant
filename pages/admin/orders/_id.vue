<template>
  <div>
    <div class="header df p1 bb mb1">
      <i class="el-icon-arrow-left arrow-back mr1" @click="$router.back()" />
      <h2># {{ $route.params.id }}</h2>
    </div>
    <div class="form p1">
      <el-row :gutter="20">
        <el-col :span="24" :md="12" :sm="24">
          <el-form
            ref="ordersForm"
            class="orders-form"
            :model="ordersForm"
            status-icon
            :rules="rules"
            label-width="160px"
            label-position="top"
          >
            <el-col :span="24" :md="8" :sm="24">
              <el-form-item label="Дата" prop="date">
                <el-date-picker
                  v-model="ordersForm.date"
                  disabled
                  type="date"
                  placeholder="Pick a day"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="8" :sm="24">
              <el-form-item label="Дата прибытие" prop="date_income">
                <el-date-picker
                  v-model="ordersForm.date_income"
                  type="date"
                  placeholder="Pick a day"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="8" :sm="24">
              <el-form-item label="Название товара" prop="product">
                <el-input v-model="ordersForm.product" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="12" :sm="24">
              <el-form-item label="Пост номер" prop="post_number">
                <el-input v-model="ordersForm.post_number" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="12" :sm="24">
              <el-form-item label="Номер контейнера" prop="container">
                <el-input v-model="ordersForm.container" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="8" :sm="24">
              <el-form-item label="Клиент" prop="client">
                <el-input v-model="ordersForm.client" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="8" :sm="24">
              <el-form-item label="Клиент фирма" prop="client_company">
                <el-select
                  v-model="ordersForm.client_company"
                  style="width: 100%;"
                  placeholder="Клиент фирма"
                >
                  <el-option
                    v-for="(c, index) in clients"
                    :key="index"
                    :label="c.name"
                    :value="c.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="8" :sm="24">
              <el-form-item prop="declarant" label="Исполнитель">
                <el-select v-model="ordersForm.declarant">
                  <el-option
                    v-for="s in declarants"
                    :key="s.id"
                    :label="s.name"
                    :value="s.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="10" :sm="24">
              <el-form-item label="ИНВ" prop="inv">
                <el-input v-model="ordersForm.inv" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="9" :sm="24">
              <el-form-item label="Сумма" prop="inv_price">
                <el-input v-model="ordersForm.inv_price" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="5" :sm="6">
              <el-form-item prop="currency" label="Валюта">
                <el-select v-model="ordersForm.currency">
                  <el-option
                    v-for="s in currencyList"
                    :key="s"
                    :label="s"
                    :value="s"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="mb1 df-sb" style="padding: 1rem;">
              <div>
                <a
                  v-if="order.inv_file"
                  :href="`/uploads/${order.inv_file}`"
                  class="download-url"
                  style="padding: 0.5rem 0.8rem;"
                  target="_blank"
                  >Посмотреть файл</a
                >
                <span v-else>No file</span>
              </div>
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-change="handleOrderFileChange"
              >
                <el-button size="small" type="primary">
                  Изменить файл
                </el-button>
              </el-upload>
            </el-col>
            <el-col>
              <el-form-item id="submit-button">
                <el-button
                  type="success"
                  :loading="loading"
                  @click="submitForm('ordersForm')"
                >
                  Сохранить
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
        <el-col :span="24" :md="12" :sm="24">
          <h3 class="mb1">Входящие документы</h3>
          <el-table :data="incoming_documents">
            <el-table-column
              width="120"
              label="№"
              align="center"
              prop="number"
            />
            <el-table-column
              width="130"
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
            <el-table-column label="Изменить" align="center">
              <template slot-scope="{ row: { id } }">
                <el-button size="small" type="primary" @click="openDialog(id)">
                  Загрузить
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form
            :model="incomingForm"
            ref="incomingForm"
            :rules="incomingRules"
          >
            <el-row :gutter="15">
              <el-col :span="24" :md="5" :sm="24">
                <el-form-item prop="number" label="Номер">
                  <el-select
                    v-model="incomingForm.number"
                    filterable
                    @change="(val) => onSelectChange(val, 'incomingForm')"
                    class="width90"
                  >
                    <el-option
                      v-for="c in documents"
                      :key="c.id"
                      :label="c.number"
                      :value="c.number"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" :md="8" :sm="24">
                <el-form-item prop="number" label="Наименование">
                  <el-input v-model="incomingForm.name" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="24" :md="5" :sm="24" class="mt2-5">
                <el-form-item>
                  <el-upload
                    ref="incomingUpload"
                    action="https://localhost:3000"
                    :auto-upload="false"
                    :on-change="
                      (file, fileList) =>
                        handleChange(file, fileList, 'incomingForm')
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
                    @click="submitIncomingForm('incomingForm')"
                    :loading="loading"
                    >Добавить</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <el-dialog title="Загрузить" :visible.sync="fileDialog" width="50%">
        <div class="file-dialog">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange"
            :auto-upload="false"
            :limit="1"
          >
            <template>
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                Перетащите картинку <em>или нажмите</em>
              </div>
              <div slot="tip" class="el-upload__tip">
                файлы с расширением jpg/png
              </div>
            </template>
          </el-upload>
          <el-button
            size="medium"
            :loading="loading2"
            type="success"
            class="mt1"
            @click="updateFile"
          >
            Сохранить
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { createFormData, clearForm, handleFile } from '@/utils/order.util'
export default {
  middleware: ['admin-auth'],
  async asyncData({ $axios, store, route }) {
    try {
      const { order, incoming_documents } = await $axios.$get(
        `api/orders/${route.params.id}`
      )
      const declarants = await store.dispatch('auth/findAllDeclarants')
      const documents = await $axios.$get('api/document?type=incoming')
      return { order, incoming_documents, documents, declarants }
    } catch (e) {
      console.log('e', e)
    }
  },
  data: () => ({
    currencyList: ['$', 'сум', '€'],
    fileDialog: false,
    loading: false,
    loading2: false,
    newFile: null,
    rawId: null,
    orderFile: '',
    ordersForm: {
      date: new Date(),
      date_income: new Date(),
      container: '',
      client_company: '',
      client: '',
      declarant: '',
      product: '',
      post_number: '',
      inv: '',
      inv_price: '',
      currency: '',
      inv_file: '',
    },
    rules: {
      container: [
        {
          required: true,
          message: 'Пожалуйста, введите название деятельности',
          trigger: 'blur',
        },
      ],
      product: [
        {
          required: true,
          message: 'Пожалуйста, введите название деятельности',
          trigger: 'blur',
        },
      ],
      client_company: [
        {
          required: true,
          message: 'Пожалуйста, введите название деятельности',
          trigger: 'blur',
        },
      ],
      client: [
        {
          required: true,
          message: 'Пожалуйста, введите название деятельности',
          trigger: 'blur',
        },
      ],
      declarant: [
        {
          required: true,
          message: 'Пожалуйста, введите название деятельности',
          trigger: 'blur',
        },
      ],
      post_number: [
        {
          required: true,
          message: 'Пожалуйста, введите название деятельности',
          trigger: 'blur',
        },
      ],
      inv_price: [
        {
          required: true,
          message: 'Пожалуйста, введите название деятельности',
          trigger: 'blur',
        },
      ],
    },
    fileForm: { file: '' },
    incomingForm: {
      number: '',
      name: '',
      file: '',
    },
    incomingRules: {
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
  }),
  mounted() {
    Object.keys(this.ordersForm).forEach((o) => {
      this.ordersForm[o] = this.order[o]
    })
  },
  validate({ store, route, error }) {
    const { role = null } = store.getters['auth/user']
    if (role == 'admin' || role == 'manager') {
      return true
    }
    return false
  },
  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
  },
  methods: {
    goToForm() {
      this.$router.push(`/admin/organization_form`)
    },
    handleOrderFileChange(file) {
      let type = file.raw.type
      const idx = type.search(/png|jpeg|docx|doc|pdf/)
      if (idx == -1) {
        fileList = []
        this.$message.error('файлы толка с расширением png|jpeg|docx|doc|pdf ')
        return
      }
      this.orderFile = file
    },
    handleChange(...options) {
      handleFile.bind(this)(...options)
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          var fd = new FormData()
          const {
            date,
            client_company,
            inv = null,
            product,
            inv_price,
            inv_file,
            container,
            post_number,
          } = this.ordersForm
          console.log('this.ordersForm', this.ordersForm)
          fd.append('date', date)
          fd.append('date_income', date_income)
          fd.append('client_company', client_company)
          fd.append('client', client)
          fd.append('declarant', declarant)
          fd.append('container', container)
          fd.append('product', product)
          fd.append('post_number', post_number)
          fd.append('inv', inv)
          fd.append('inv_price', inv_price)
          fd.append('currency', currency)
          if (this.orderFile) {
            fd.append('file', this.orderFile.raw, this.orderFile.name)
          }
          this.loading = true
          try {
            await this.$axios.$put(`api/orders/${this.$route.params.id}`, fd)
            this.loading = false
            this.$message.success('заявка успешна обнавлена')
            await this.$router.push('/admin/orders')
          } catch (error) {
            this.loading = false
            console.log(error)
          }
        } else {
          return false
        }
      })
    },
    async submitIncomingForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid && this[formName].file) {
          this.loading = true
          try {
            const fd = createFormData.bind(this)(formName)
            const formData = {
              id: this.$route.params.id,
              form: fd,
            }
            const document = await this.$store.dispatch(
              `orders/addIncomingDocuments`,
              formData
            )
            this.incoming_documents.push(document)
            this.loading = false
            this.$message.success('Документ успешна добавлена')
            this.$refs[`incomingUpload`].clearFiles()
            clearForm.bind(this)(formName)
          } catch (error) {
            this.loading = false
            console.log(error)
          }
        } else {
          if (!this[formName].file) {
            this.$message.error('No File')
          }
          return false
        }
      })
    },
    async updateFile() {
      if (!this.newFile) {
        this.$message.error('Файл не выбран')
        return
      }
      try {
        this.loading2 = true
        const fd = new FormData()
        fd.append('file', this.newFile.raw, this.newFile.name)
        const newDocument = await this.$axios.$put(
          `api/orders/${this.rawId}/file`,
          fd
        )
        const document = this.incoming_documents.find((d) => d.id == this.rawId)
        document.file = newDocument.file
        this.rawId = null
        this.newFile = null
        this.loading2 = false
        this.fileDialog = false
      } catch (e) {
        this.loading2 = false
        console.log(e)
      }
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
    openDialog(id) {
      this.rawId = id
      this.fileDialog = true
    },
  },
}
</script>
<style>
.orders-form .el-form-item {
  margin-bottom: 10px !important;
}
.orders-form .el-form-item__label {
  padding: 0 !important;
}
.orders-form .el-date-editor {
  width: auto !important;
}
</style>
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
.el-form-item__label {
  text-align: left;
}
.download-url {
  display: inline-block;
  padding: 0.2rem 0.8rem;
  background: #555;
  color: #f1f1f1;
  border-radius: 2px;
  &:hover {
    background: #444;
    color: #fff;
  }
}
.file-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
