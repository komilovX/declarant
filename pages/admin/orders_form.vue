<template>
  <div>
    <div class="header df p1 bb mb1">
      <i class="el-icon-arrow-left arrow-back mr1" @click="$router.back()" />
      <h2>Cоздание заявки</h2>
    </div>
    <div class="form p1">
      <el-row :gutter="20">
        <el-col :span="24" :md="13" :sm="24">
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
              <el-form-item label="Пост номер" prop="post_number">
                <el-input v-model="ordersForm.post_number" type="text" />
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
                  style="width: 100%"
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
              <el-form-item label="Номер контейнера" prop="container">
                <el-input v-model="ordersForm.container" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="12" :sm="24">
              <el-form-item label="Название товара" prop="product">
                <el-input v-model="ordersForm.product" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="12" :sm="24">
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
            <el-col :span="24" class="mb1" style="padding: 1rem">
              <el-upload
                action="https://localhost:3000"
                :auto-upload="false"
                :on-change="handleOrderFileChange"
              >
                <el-button size="small" type="primary"
                  >Загрузить файл</el-button
                >
              </el-upload>
            </el-col>
            <el-col>
              <el-form-item id="submit-button">
                <el-button
                  type="success"
                  :loading="loading"
                  @click="submitForm('ordersForm')"
                  >Сохранить</el-button
                >
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
        <el-col :span="24" :md="11" :sm="24">
          <h3 class="mb1">Входящие документы</h3>
          <el-table :data="filteredDocuments">
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
              <template slot-scope="{ $index }">
                <el-upload
                  action="https://localhost:3000"
                  :auto-upload="false"
                  :on-change="(file) => handleChange(file, $index)"
                >
                  <el-button size="small" type="primary">
                    Загрузить файл
                  </el-button>
                </el-upload>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            @click="visibleDialog = true"
            size="medium"
            type="success"
            plain
            class="mt1"
            >Добавить</el-button
          >
        </el-col>
      </el-row>

      <!-- Dialog -->
      <el-dialog title="Загрузить" :visible.sync="visibleDialog" width="40%">
        <el-table
          ref="multipleTable"
          :data="documents"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column width="150" label="№" align="center" prop="number" />
          <el-table-column label="Наименование" align="center" prop="name" />
        </el-table>
        <el-button
          @click="addDocuments"
          size="medium"
          type="primary"
          class="mt1"
          >Добавить</el-button
        >
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({ $axios, store, error }) {
    try {
      const documents = await $axios.$get('api/document?type=incoming')
      const declarants = await store.dispatch('auth/findAllDeclarants')
      const clients = await store.dispatch('auth/findAllClients')
      return { documents, clients, declarants }
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
    currencyList: ['$', 'сум', '€'],
    visibleDialog: false,
    filteredDocuments: [],
    multipleSelection: [],
    loading: false,
    fileList: [],
    ordersForm: {
      date: new Date(),
      date_income: new Date(),
      container: '',
      client_company: '',
      client: '',
      product: '',
      post_number: '',
      inv_price: '',
      inv_file: '',
      currency: '$',
      declarant: '',
    },
    rules: {
      date_income: [
        {
          required: true,
          message: 'Пожалуйста, введите название деятельности',
          trigger: 'change',
        },
      ],
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
  }),
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            var fd = new FormData()
            const {
              date,
              date_income,
              client_company,
              client,
              declarant,
              inv = null,
              product,
              inv_price,
              currency,
              inv_file,
              container,
              post_number,
            } = this.ordersForm
            fd.append('date', date)
            fd.append('date_income', date_income)
            fd.append('client_company', client_company)
            fd.append('client', client)
            fd.append('declarant', declarant)
            fd.append('container', container)
            fd.append('product', product)
            fd.append('post_number', post_number)
            fd.append('inv', inv)
            fd.append('currency', currency)
            fd.append('inv_price', inv_price.replace(' ', ''))
            fd.append('fileDocuments', JSON.stringify(this.filteredDocuments))
            if (inv_file) {
              fd.append('file', inv_file.raw, inv_file.name)
            }
            this.fileList.forEach((d) => {
              if (d) {
                fd.append('files', d.raw, d.name)
              }
            })
            this.loading = true
            const order = await this.$store.dispatch('orders/createOrder', fd)
            const content = `Заказ по номером ${order.id} добавлен в систему`
            await this.$store.dispatch('notification/createNotifications', {
              type: 'declarant',
              content,
            })
            this.loading = false
            this.$message.success('Заявки успешна добавлена')
            const user = this.$store.getters['auth/user']
            this.$router.push(
              `/admin${
                user.role == 'admin' || user.role == 'manager' ? '/orders' : ''
              }`
            )
          } catch (error) {
            this.loading = false
            console.log(error)
          }
        } else {
          return false
        }
      })
    },
    goToForm() {
      this.$router.push(`/admin/organization_form`)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleOrderFileChange(file) {
      let type = file.raw.type
      const idx = type.search(/png|jpeg|docx|doc|pdf/)
      if (idx == -1) {
        fileList = []
        this.$message.error('файлы толка с расширением png|jpeg|docx|doc|pdf ')
        return
      }
      this.ordersForm.inv_file = file
    },
    handleChange(file, $index) {
      let type = file.raw.type
      const idx = type.search(/png|jpeg|docx|doc|pdf/)
      if (idx == -1) {
        fileList = []
        this.$message.error('файлы толка с расширением png|jpeg|docx|doc|pdf ')
        return
      }
      this.filteredDocuments[$index].file = file.name
      this.fileList[$index] = file
    },
    addDocuments() {
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach((d) => {
          this.fileList.push('')
          this.filteredDocuments.push({
            id: d.id,
            number: d.number,
            name: d.name,
            file: '',
          })
        })
        const documentIds = this.multipleSelection.map((p) => p.id)
        this.documents = this.documents.filter(
          (d) => !documentIds.includes(d.id)
        )
        this.visibleDialog = false
      } else {
        this.$message.info('No data')
      }
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
</style>
