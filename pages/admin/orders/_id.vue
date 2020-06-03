<template>
  <div>
    <div class="header df p1 bb mb1">
      <i class="el-icon-arrow-left mr1" @click="$router.back()" />
      <h2>Cоздание заявки</h2>
    </div>
    <div class="form p1">
      <el-row :gutter="20">
        <el-col :span="24" :md="12" :sm="24">
          <el-form
            ref="ordersForm"
            :model="ordersForm"
            status-icon
            :rules="rules"
            label-width="160px"
          >
            <el-form-item label="Дата" prop="date" class="minW35">
              <el-date-picker
                v-model="ordersForm.date"
                disabled
                type="date"
                placeholder="Pick a day"
                class="maxW35"
              />
            </el-form-item>
            <el-form-item label="Номер контейнера" prop="container">
              <el-input
                v-model="ordersForm.container"
                type="text"
                class="maxW35"
              />
            </el-form-item>
            <el-form-item label="Имя клиента" prop="client">
              <el-select v-model="ordersForm.client" style="width: 100%;">
                <el-option
                  v-for="c in ['sarvar']"
                  :key="c"
                  :label="c"
                  :value="c"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Код груза" prop="product_code">
              <el-input
                v-model="ordersForm.product_code"
                type="text"
                class="maxW35"
              />
            </el-form-item>
            <el-form-item label="Клиент фирма" prop="client_company">
              <el-input
                v-model="ordersForm.client_company"
                type="text"
                class="maxW35"
              />
            </el-form-item>
            <el-form-item label="Пост номер" prop="post_number">
              <el-input
                v-model="ordersForm.post_number"
                type="text"
                class="maxW35"
              />
            </el-form-item>
            <el-form-item id="submit-button">
              <el-button
                type="success"
                :loading="loading"
                @click="submitForm('ordersForm')"
              >
                Сохранить
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24" :md="12" :sm="24">
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
                  download
                >Скачать</a>
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
        </el-col>
      </el-row>
      <el-dialog title="Загрузить" :visible.sync="visibleDialog" width="50%">
        <div class="file-dialog">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            action="http://localhost:3000"
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
export default {
  middleware: ['admin-auth'],
  async asyncData({ $axios, error, route }) {
    try {
      const { order, incoming_documents } = await $axios.$get(
        `api/orders/${route.params.id}`
      )
      return { order, incoming_documents }
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
    visibleDialog: false,
    loading: false,
    loading2: false,
    newFile: null,
    rawId: null,
    ordersForm: {
      date: new Date(),
      container: '',
      client: '',
      client_company: '',
      product_code: '',
      post_number: '',
    },
    rules: {
      container: [
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
          trigger: 'change',
        },
      ],
      product_code: [
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
      post_number: [
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
  // validate({store, error}) {
  //   const {role = null } = store.getters['auth/user']
  //   if (role == 1 || role == 2) {
  //     return true
  //   }
  //   return false
  // },
  methods: {
    goToForm() {
      this.$router.push(`/admin/organization_form`)
    },
    handleChange(file, raw) {
      let type = file.raw.type
      const idx = type.search(/png|jpeg|docx|doc|pdf/)
      if (idx == -1) {
        fileList = []
        this.$message.error('файлы толка с расширением png|jpeg|docx|doc|pdf ')
        return
      }
      this.newFile = file
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const fd = new FormData()
          const {
            date,
            client,
            client_company,
            container,
            post_number,
            product_code,
          } = this.ordersForm
          const formData = {
            date,
            client,
            client_company,
            container,
            post_number,
            product_code,
          }
          this.loading = true
          try {
            await this.$axios.$put(
              `api/orders/${this.$route.params.id}`,
              formData
            )
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
        this.visibleDialog = false
      } catch (e) {
        this.loading2 = false
        console.log(e)
      }
    },
    openDialog(id) {
      this.rawId = id
      this.visibleDialog = true
    },
  },
}
</script>
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
