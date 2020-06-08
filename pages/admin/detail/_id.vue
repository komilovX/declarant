<template>
  <div>
    <div class="header df p1 bb mb1">
      <div class="df">
        <i
          class="el-icon-arrow-left mr1 arrow-back"
          @click="$router.back()"
        />
        <h4>
          #{{  $route.params.id  }}
          &nbsp;
          Клиент: <u>{{order.client_company}}</u>&nbsp;|
          Товар: <u>{{order.product}}</u>&nbsp;|
          ИНВ: <a
                :disabled="!order.inv_file"
                :href="`/uploads/${order.inv_file}`"
                target="_blank"
                style="color: blue"
                >Посмотреть</a>
        </h4>
      </div>
    </div>
    <el-tabs type="border-card" stretch>
      <el-tab-pane :label="`Документы`">
        <el-row :gutter="20" class="p1">
          <el-col :span="24" :md="12" :sm="24" class="mb2">
            <h4 class="text-center mb1">
              Входящие документы
            </h4>
            <el-table border :data="incoming_documents" size="mini">
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
                    >Посмотреть</a>
                  <span v-else>No file</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24" :md="12" :sm="24" class="mb2">
            <h4 class="text-center mb1">
              Документы офорленные
            </h4>
            <el-table border :data="decorated_documents" size="mini">
              <el-table-column width="60" label="№" align="center" prop="number" />
              <el-table-column
                width="170"
                label="Наименование"
                align="center"
                prop="name"
              />
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
              <el-table-column label="Изменить" align="center">
                <template slot-scope="{ row: { id } }">
                  <el-button size="small" type="primary" @click="openDecoratedDialog(id)">
                    Загрузить
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24" class="mb2">
            <h4 class="text-center mb1">Необходимые документы</h4>
            <el-table border :data="declarant_documents" size="mini" class="mb2">
              <el-table-column width="80" label="№" align="center" prop="number" />
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
                <template slot-scope=" {row: { declarant_id, price }} ">
                  <span v-if="declarant_id == user.userId">{{price}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                label="Примечание"
                align="center"
                prop="comment"
                show-overflow-tooltip
              >
                <template slot-scope=" {row: { declarant_id, comment }} ">
                  <span v-if="declarant_id == user.userId">{{comment}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column label="Управлять" align="center">
                <template slot-scope="{ row: { id, declarant_id, status }, row }">
                  <div v-if="declarant_id">
                    <el-tag v-if="declarant_id != user.userId" type="success" effect="plain">
                      выбран
                    </el-tag>
                    <el-button
                      v-else
                      type="primary"
                      @click="openUpdateDialog(row)"
                      size="small"
                      icon="el-icon-edit"
                      circle
                      plain
                    />
                  </div>
                  <div v-else>
                    <span v-if="status == 'disable'"></span>
                    <el-button
                      v-else
                      type="primary"
                      @click="openDialog(row)"
                      size="small"
                      :loading="loading">
                      добавить
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane :label="`Услуги`">
        <el-col :span="24" :md="18" :sm="24" :offset="3">
          <div class="ma1 df-sb">
            <h4 >
              Ваши услуги
            </h4>
            <el-button
              type="danger"
              @click="visibleDialog = true"
              size="small"
              plain
            >
              Добавить услуг
            </el-button>
          </div>
          <el-table border :data="services" size="mini">
            <el-table-column width="80" label="№" align="center" prop="number" />
            <el-table-column
              width="150"
              label="Наименование"
              align="center"
              prop="name"
            />
            <el-table-column
              width="180"
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
              <template slot-scope="{ row: { id } }">
                <el-button
                  type="primary"
                  @click="deleteService(id)"
                  size="small"
                  icon="el-icon-delete"
                  :loading="deleteloading"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-tab-pane>
    </el-tabs>
    <!-- Decorated_Document Dialog -->
    <el-dialog title="Загрузить" :visible.sync="decoratedFileDialog" width="50%">
      <div class="file-dialog">
        <el-upload
          ref="upload"
          class="upload-demo"
          drag
          action="http://localhost:3000"
          :on-change="handleDecoratedChange"
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
    <!-- Open service dialog -->
    <el-dialog title="Добавить услуг" :visible.sync="visibleDialog" width="70%">
      <el-form :model="serviceForm" ref="serviceForm" :rules="rules">
        <el-row :gutter="15">
          <el-col :span="24" :md="3" :sm="24">
            <el-form-item prop="number" label="Номер">
              <el-input v-model="serviceForm.number" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="6" :sm="24">
            <el-form-item prop="name" label="Название">
              <el-input v-model="serviceForm.name" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="4" :sm="18">
            <el-form-item prop="price" label="Сумма">
              <el-input v-model="serviceForm.price" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="3" :sm="6">
            <el-form-item label="Валюта" prop="currency">
              <el-select v-model="serviceForm.currency">
                <el-option
                  v-for="s in currencyList"
                  :key="s"
                  :label="s"
                  :value="s"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="8" :sm="24">
            <el-form-item prop="comment" label="Примечание">
              <el-input v-model="serviceForm.comment" type="text" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item id="submit-button">
          <el-button
            type="success"
            @click="submitForm('serviceForm')"
            :loading="loading"
          >
            Сохранить
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- Declarant document dialog -->
    <el-dialog :title="dialogTitle" :before-close="clearForm(declarantForm)" :visible.sync="visibleDeclarantDialog" width="60%">
      <el-form :model="declarantForm" ref="declarantForm" :rules="declarantRules">
        <el-row :gutter="15">
          <el-col :span="24" :md="8" :sm="18">
            <el-form-item prop="price" label="Сумма">
              <el-input v-model="declarantForm.price" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="4" :sm="6">
            <el-form-item label="Валюта" prop="currency">
              <el-select v-model="declarantForm.currency">
                <el-option
                  v-for="s in currencyList"
                  :key="s"
                  :label="s"
                  :value="s"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12" :sm="24">
            <el-form-item prop="comment" label="Примечание">
              <el-input v-model="declarantForm.comment" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12" :sm="18" class="mb1">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange"
            >
              <el-button size="small" type="primary">
                Загрузить файл / не обязательно
              </el-button>
            </el-upload>
          </el-col>
        </el-row>
        <el-form-item id="submit-button">
          <el-button
            type="success"
            @click="submitDeclarantForm('declarantForm')"
            :loading="loading"
          >
            Сохранить
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({ $axios, route, error }) {
    try {
      const {
        order = [],
        incoming_documents = [],
        declarant_documents = [],
        decorated_documents = []
      } = await $axios.$get(`api/orders/${route.params.id}/details`)
      const services = await $axios.$get(`api/service/user/${route.params.id}`)

      return { order, incoming_documents, declarant_documents, decorated_documents, services }
    } catch (e) {
      console.log(e)
    }
  },
  data() {
    const itemsValidator = (rule, value, callback) => {
      let checkIsEmpty = false
      value.forEach((v) => {
        if (!v.price || !v.service) {
          callback(new Error("пожалуйста, заполните форму правильно"))
        }
      })
      callback()
    }
    return {
      dialogTitle: 'Добавить услуг',
      loading: false,
      loading2: false,
      deleteloading: false,
      visibleDialog: false,
      visibleDeclarantDialog: false,
      decoratedFileDialog: false,
      // decorated
      newFile: null,
      rawId: null,
      currencyList: ['$', 'sum'],
      raw: null,
      currencyList: ['$', 'sum'],
      serviceForm: {
        number: "",
        name: "",
        price: "",
        currency: '$',
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
        price: [
          {
            required: true,
            message: "Пожалуйста, введите название деятельности",
            trigger: "blur",
          },
        ],
      },
      declarantForm: {
        price: '',
        currency: '$',
        comment: '',
        file: ''
      },
      declarantRules: {
        price: [
          {
            required: true,
            message: "Пожалуйста, введите название деятельности",
            trigger: "blur",
          },
        ],
      },
    }
  },
  computed: {
    user() {
      return this.$store.getters['auth/user']
    }
  },
  methods: {
    async deleteService(id) {
      try {
        this.deleteloading = true
        await this.$axios.$delete(`api/service/${id}`)
        this.deleteloading = false
        this.services = this.services.filter(f => f.id != id)
      } catch (e) {
        this.deleteloading = false
        console.log(e)
      }
    },

    handleChange(file, fileList) {
      let type = file.raw.type
      const idx = type.search(/png|jpeg|docx|doc|pdf/)
      if (idx == -1) {
        fileList = []
        this.$message.error('файлы толка с расширением png|jpeg|docx|doc|pdf ')
        return
      }
      this.declarantForm.file= file
    },
    handleDecoratedChange(file, raw) {
      let type = file.raw.type
      const idx = type.search(/png|jpeg|docx|doc|pdf/)
      if (idx == -1) {
        fileList = []
        this.$message.error('файлы толка с расширением png|jpeg|docx|doc|pdf ')
        return
      }
      this.newFile = file
    },
    openDialog(row) {
      this.row = row
      this.visibleDeclarantDialog = true
    },
    openDecoratedDialog(id) {
      this.rawId = id
      this.decoratedFileDialog = true
    },
    openUpdateDialog(row) {
      this.dialogTitle = 'Обновить услуг'
      this.row = row
      this.declarantForm.price = row.price
      this.declarantForm.currency = row.currency
      this.declarantForm.comment = row.comment
      this.visibleDeclarantDialog = true
    },
    clearForm(formName) {
      if (this[formName]) {
        Object.keys(this[formName]).forEach(d => this[formName][d] == '')
      }
    },
    async updateFile() {
      if (!this.newFile) {
        this.$message.error('Файл не выбран')
        return
      }
      try {
        this.loading2 = true
        const formData = new FormData()
        formData.append('file', this.newFile.raw, this.newFile.name)
        const newDocument = await this.$store.dispatch('orders/updateDecoratedDocumentFile', {id: this.rawId,formData})
        const document = this.decorated_documents.find((d) => d.id == this.rawId)
        document.file = newDocument.file
        this.rawId = null
        this.newFile = null
        this.loading2 = false
        this.decoratedFileDialog = false
      } catch (e) {
        this.loading2 = false
        console.log(e)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            const formData = {
              order_id: this.$route.params.id,
              total_price: this.serviceForm.price,
              ...this.serviceForm
            }
            const service = await this.$axios.$post(`api/service`, formData)
            this.services.push(service)
            this.loading = false
            this.$message.success('услуга успешна добавлена')
            this.$refs[formName].resetFields();
          } catch (error) {
            this.loading = false
            console.log(error);
          }
        }
        else {
          return false;
        }
      });
    },
    submitDeclarantForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            const fd = new FormData()
            fd.append('price', this.declarantForm.price)
            fd.append('total_price', this.declarantForm.total_price)
            fd.append('currency', this.declarantForm.currency)
            fd.append('comment', this.declarantForm.comment)
            if (this.declarantForm.file) {
              fd.append('file', this.declarantForm.file.raw, this.declarantForm.file.name)
            }
            const service = await this.$axios.$put(`api/orders/declarant/finish/${this.row.id}`, fd)
            let idx = this.declarant_documents.findIndex(o => o.id == this.row.id)
            // console.log('idx', idx)
            // console.log('service', service)
            if (idx != -1) {
              this.declarant_documents.splice(idx, 1, service)
            }

            this.visibleDeclarantDialog = false
            this.declarantForm.file = null
            this.row = null
            this.loading = false
            this.$message.success('Заявкa успешна обнавлена')
            this.$refs[formName].resetFields();
          } catch (error) {
            this.loading = false
            console.log(error);
          }
        }
        else {
          return false;
        }
      })
    }
  },
}
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
</style>
