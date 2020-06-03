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
            <el-form-item label="Имя клиента" prop="client_id">
              <el-select v-model="ordersForm.client_id" style="width: 100%;">
                <el-option
                  v-for="c in clients"
                  :key="c.id"
                  :label="c.name"
                  :value="c.id"
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
          <el-table :data="documents">
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
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-change="(file) => handleChange(file, $index)"
                >
                  <el-button size="small" type="primary">
                    Загрузить файл
                  </el-button>
                </el-upload>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({ $axios, store, error }) {
    try {
      const documents = await $axios.$get('api/document?type=incoming')
      const clients = await store.dispatch('auth/findAllClients')
      return { documents, clients }
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
    loading: false,
    fileList: [],
    ordersForm: {
      date: new Date(),
      container: '',
      client_id: '',
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
      client_id: [
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
    this.documents.forEach((p) => {
      this.fileList.push('')
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
    handleChange(file, $index) {
      let type = file.raw.type
      const idx = type.search(/png|jpeg|docx|doc|pdf/)
      if (idx == -1) {
        fileList = []
        this.$message.error('файлы толка с расширением png|jpeg|docx|doc|pdf ')
        return
      }
      this.fileList[$index] = file
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let client = this.clients.find(c => c.id == this.ordersForm.client_id)
          const fd = new FormData()
          const {
            date,
            client_id,
            client_company,
            container,
            post_number,
            product_code,
          } = this.ordersForm

          fd.append('date', this.ordersForm.date)
          fd.append('client', client.name)
          fd.append('client_id', client_id)
          fd.append('client_company', client_company)
          fd.append('container', container)
          fd.append('post_number', post_number)
          fd.append('product_code', product_code)
          this.fileList.forEach((d) => {
            if (d) {
              fd.append('files', d.raw, d.name)
              fd.append('fileArray', 1)
            } else {
              fd.append('fileArray', 0)
            }
          })
          this.loading = true
          try {
            await this.$axios.$post('api/orders', fd)
            this.loading = false
            this.$message.success('поставка успешна добавлена')
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
</style>
