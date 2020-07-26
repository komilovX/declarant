<template>
  <div>
    <el-tabs type="border-card" stretch class="mt1">
      <el-tab-pane label="Документы">
        <div class="table p05">
          <el-row :gutter="15" class="mt1">
            <el-col :span="7" :xs="24">
              <h4 class="mb1 text-center">Входящие документы</h4>
              <el-table
                border
                :data="incomindDocuments"
                tooltip-effect="light"
                style="width: 100%;"
              >
                <el-table-column
                  label="№"
                  prop="number"
                  align="center"
                  width="70"
                />
                <el-table-column
                  width="160"
                  label="Названия"
                  prop="name"
                  align="center"
                  show-overflow-tooltip
                />
                <el-table-column label="Удалить" align="center">
                  <template slot-scope="{ row: { id } }">
                    <i
                      @click="deleteProduct(id)"
                      class="el-icon-delete delete-button"
                    ></i>
                  </template>
                </el-table-column>
              </el-table>
              <el-row :gutter="15" class="mt1">
                <el-form
                  ref="incomingForm"
                  :model="incomingForm"
                  :rules="rules"
                >
                  <el-col :span="6">
                    <el-form-item prop="number">
                      <el-input placeholder="№" v-model="incomingForm.number" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item prop="name">
                      <el-input
                        placeholder="Название"
                        v-model="incomingForm.name"
                        type="text"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item id="submit-button">
                      <el-button
                        type="success"
                        size="small"
                        :loading="loading2"
                        icon="el-icon-check"
                        plain
                        @click="submitForm('incomingForm')"
                      />
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </el-col>
            <el-col :span="7" :xs="24">
              <h4 class="mb1 text-center">Документы офорленные</h4>
              <el-table
                border
                :data="decoratedDocuments"
                tooltip-effect="light"
                style="width: 100%;"
              >
                <el-table-column
                  label="№"
                  prop="number"
                  align="center"
                  width="70"
                />
                <el-table-column
                  width="150"
                  label="Названия"
                  prop="name"
                  align="center"
                  show-overflow-tooltip
                />
                <el-table-column label="Удалить" align="center">
                  <template slot-scope="{ row: { id } }">
                    <i
                      @click="deleteProduct(id)"
                      class="el-icon-delete delete-button"
                    ></i>
                  </template>
                </el-table-column>
              </el-table>
              <el-row :gutter="15" class="mt1">
                <el-form
                  ref="decoratedForm"
                  :model="decoratedForm"
                  :rules="rules"
                >
                  <el-col :span="6">
                    <el-form-item prop="number">
                      <el-input
                        placeholder="№"
                        v-model="decoratedForm.number"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item prop="name">
                      <el-input
                        placeholder="Название"
                        v-model="decoratedForm.name"
                        type="text"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item id="submit-button">
                      <el-button
                        type="success"
                        size="small"
                        :loading="loading2"
                        icon="el-icon-check"
                        plain
                        @click="submitForm('decoratedForm')"
                      />
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </el-col>
            <el-col :span="10" :xs="24">
              <h4 class="mb1 text-center">Необходимые документы</h4>
              <el-table
                border
                :data="declarantDocuments"
                tooltip-effect="light"
                style="width: 100%;"
              >
                <el-table-column
                  label="№"
                  prop="number"
                  align="center"
                  width="70"
                />
                <el-table-column
                  width="150"
                  label="Названия"
                  prop="name"
                  align="center"
                  show-overflow-tooltip
                />
                <el-table-column
                  width="150"
                  show-overflow-tooltip
                  label="Удалить"
                  align="center"
                >
                  <template slot-scope="{ row: { department } }">
                    {{ findDepartment(department) }}
                  </template>
                </el-table-column>
                <el-table-column label="Удалить" align="center">
                  <template slot-scope="{ row: { id } }">
                    <i
                      @click="deleteProduct(id)"
                      class="el-icon-delete delete-button"
                    ></i>
                  </template>
                </el-table-column>
              </el-table>
              <el-row :gutter="15" class="mt1">
                <el-form
                  ref="declarantForm"
                  :model="declarantForm"
                  :rules="rules"
                >
                  <el-col :span="5">
                    <el-form-item prop="number">
                      <el-input
                        placeholder="№"
                        v-model="declarantForm.number"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item prop="name">
                      <el-input
                        placeholder="Название"
                        v-model="declarantForm.name"
                        type="text"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="department">
                      <el-select v-model="declarantForm.department">
                        <el-option
                          v-for="s in departments"
                          :key="s.value"
                          :label="s.label"
                          :value="s.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item id="submit-button">
                      <el-button
                        type="success"
                        size="small"
                        :loading="loading2"
                        icon="el-icon-check"
                        plain
                        @click="submitForm('declarantForm')"
                      />
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Клиенты,Услуги">
        <el-row class="mt1" :gutter="20">
          <el-col :span="12" :md="12" :sm="24">
            <h4 class="mb1">Услуги</h4>
            <el-table
              border
              :data="service_documents"
              tooltip-effect="light"
              style="width: 100%;"
            >
              <el-table-column
                label="№"
                prop="number"
                align="center"
                width="100"
              />
              <el-table-column
                width="150"
                label="Названия"
                prop="name"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                width="200"
                show-overflow-tooltip
                label="Удалить"
                align="center"
              >
                <template slot-scope="{ row: { department } }">
                  {{ findDepartment(department) }}
                </template>
              </el-table-column>
              <el-table-column label="Удалить" align="center">
                <template slot-scope="{ row: { id } }">
                  <i
                    @click="deleteService(id)"
                    class="el-icon-delete delete-button"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
            <el-row :gutter="15" class="mt1">
              <el-form ref="serviceForm" :model="serviceForm" :rules="rules">
                <el-col :span="5">
                  <el-form-item prop="number">
                    <el-input
                      placeholder="№"
                      v-model="serviceForm.number"
                      type="number"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item prop="name">
                    <el-input
                      placeholder="Название"
                      v-model="serviceForm.name"
                      type="text"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item prop="department">
                    <el-select v-model="serviceForm.department">
                      <el-option
                        v-for="s in departments"
                        :key="s.value"
                        :label="s.label"
                        :value="s.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item id="submit-button">
                    <el-button
                      type="success"
                      size="small"
                      :loading="loading2"
                      icon="el-icon-check"
                      plain
                      @click="submitService('serviceForm')"
                    />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </el-col>
          <el-col :span="8" :md="8" :sm="24">
            <h4 class="mb1">Клиенты</h4>
            <el-table
              border
              :data="clients"
              tooltip-effect="light"
              style="width: 100%;"
            >
              <el-table-column
                width="250"
                label="Клиент фирма"
                prop="name"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column label="Удалить" align="center">
                <template slot-scope="{ row: { id } }">
                  <i
                    @click="deleteClient(id)"
                    class="el-icon-delete delete-button"
                  />
                </template>
              </el-table-column>
            </el-table>
            <el-row :gutter="15" class="mt1">
              <el-form
                ref="clientsForm"
                :model="clientsForm"
                :rules="clientRules"
              >
                <el-col :span="11">
                  <el-form-item prop="name">
                    <el-input
                      placeholder="Название"
                      v-model="clientsForm.name"
                      type="text"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item id="submit-button">
                    <el-button
                      type="success"
                      size="small"
                      :loading="loading"
                      icon="el-icon-check"
                      plain
                      @click="submitClientForm('clientsForm')"
                    />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({ $axios, error, store }) {
    try {
      const documents = await $axios.$get('api/document')
      const clients = await $axios.$get('api/clients')
      const service_documents = await store.dispatch('service/getDocuments')
      return { documents, service_documents, clients }
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
    loading: false,
    loading2: false,
    departments: [
      { value: 'ved', label: 'Отдел ВЭД' },
      { value: 'decor', label: 'Спец. По там. Оформлению' },
      { value: 'logistic', label: 'Отдел логистики' },
      { value: 'contract', label: 'Отдел контракта' },
      { value: 'expertise', label: 'Отдел Акт экспертизы' },
    ],
    incomingForm: {
      number: '',
      name: '',
      type: 'incoming',
    },
    decoratedForm: {
      number: '',
      name: '',
      type: 'decorated',
    },
    declarantForm: {
      number: '',
      name: '',
      type: 'declarant',
      department: '',
    },
    serviceForm: {
      number: '',
      name: '',
      department: '',
    },
    clientsForm: {
      name: '',
    },
    clientRules: {
      name: [
        {
          required: true,
          message: 'Пожалуйста, введите название деятельности',
          trigger: 'blur',
        },
      ],
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
  }),
  computed: {
    incomindDocuments() {
      return this.documents.filter((p) => p.type == 'incoming')
    },
    decoratedDocuments() {
      return this.documents.filter((p) => p.type == 'decorated')
    },
    declarantDocuments() {
      return this.documents.filter((p) => p.type == 'declarant')
    },
  },
  validate({ store, error }) {
    const { role = null } = store.getters['auth/user']
    if (role == 'admin' || role == 'manager') {
      return true
    }
    return false
  },
  methods: {
    goToForm() {
      this.$router.push(`/admin/organization_form`)
    },
    deleteProduct(id) {
      const text = 'Уверены, что хотите удалить этот документ?'
      this.$confirm(text, 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await this.$axios.$delete(`api/document/${id}`)
            this.documents = this.documents.filter((d) => d.id != id)
            this.$message.success('Документ удалена')
          } catch (e) {
            console.log(e)
          }
        })
        .catch(() => {})
    },
    deleteClient(id) {
      const text = 'Уверены, что хотите удалить этот клиент?'
      this.$confirm(text, 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await this.$axios.$delete(`api/clients/${id}`)
            this.clients = this.clients.filter((d) => d.id != id)
            this.$message.success('Клиент удалена')
          } catch (e) {
            console.log(e)
          }
        })
        .catch(() => {})
    },
    deleteService(id) {
      const text = 'Уверены, что хотите удалить этот документ?'
      this.$confirm(text, 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await this.$store.dispatch('service/deleteDocument', id)
            this.service_documents = this.service_documents.filter(
              (d) => d.id != id
            )
            this.$message.success('Документ удалена')
          } catch (e) {
            console.log(e)
          }
        })
        .catch(() => {})
    },
    submitClientForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            const client = await this.$axios.$post(
              'api/clients',
              this[formName]
            )
            this.clients.push(client)
            this.loading = false
            this.$refs[formName].resetFields()
            this.$message.success('Клиент успешна добавлена')
          } catch (e) {
            this.loading = false
            console.log(e)
          }
        } else {
          return false
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading2 = true
          try {
            const document = await this.$axios.$post(
              'api/document',
              this[formName]
            )
            this.documents.push(document)
            this.loading2 = false
            this.$refs[formName].resetFields()
            this.$message.success('Документ успешна добавлена')
          } catch (e) {
            this.loading2 = false
            console.log(e)
          }
        } else {
          return false
        }
      })
    },
    submitService(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            const document = await this.$store.dispatch(
              'service/createDocument',
              this.serviceForm
            )
            this.service_documents.push(document)
            this.loading = false
            this.$refs[formName].resetFields()
            this.$message.success('Документ успешна добавлена')
          } catch (e) {
            this.loading = false
            console.log(e)
          }
        } else {
          return false
        }
      })
    },
    findDepartment(value) {
      const { label } = this.departments.find((d) => d.value === value)
      return label ? label : value
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
</style>
