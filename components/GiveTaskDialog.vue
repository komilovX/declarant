<template>
  <el-dialog
    title="Добавить услуг"
    :before-close="handleClose"
    :visible.sync="visible"
    width="50%"
  >
    <el-radio-group v-model="type">
      <el-radio-button label="Документы" />
      <el-radio-button label="Услуг" />
    </el-radio-group>
    <el-form :model="form" ref="form" class="mt1" :rules="rules">
      <el-row :gutter="15">
        <el-col :span="24" :md="8" :sm="24">
          <el-form-item prop="declarant_id">
            <el-select
              v-model="form.declarant_id"
              filterable
              placeholder="Исполнитель"
              @change="onSelectChange"
            >
              <el-option
                v-for="s in declarants"
                :key="s.id"
                :label="s.name"
                :value="s.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="4" :sm="24">
          <el-form-item prop="number">
            <el-select
              v-model="form.number"
              filterable
              @change="(val) => onServiceSelectChange(val, 'form')"
              placeholder="№"
            >
              <el-option
                v-for="s in documents"
                :key="s.id"
                :label="s.number"
                :value="s.number"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="6" :sm="24">
          <el-form-item prop="name">
            <el-select
              v-model="form.name"
              filterable
              @change="(val) => onServiceSelectChange(val, 'form')"
              placeholder="Название"
            >
              <el-option
                v-for="s in documents"
                :key="s.id"
                :label="s.name"
                :value="s.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="4" :sm="24">
          <el-form-item id="submit-button">
            <el-button
              size="medium"
              type="success"
              @click="submitService('form')"
              :loading="loading"
              >Добавить</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      type: 'Документы',
      departments: [],
      form: {
        declarant_id: '',
        number: '',
        name: '',
      },
      rules: {
        declarant_id: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
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
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    declarant_documents: {
      type: Array,
      default: () => [],
    },
    service_documents: {
      type: Array,
      default: () => [],
    },
    declarants: {
      type: Array,
      default: () => [],
    },
    order_id: Number,
  },
  computed: {
    documents() {
      if (this.type == 'Документы') {
        return this.declarant_documents.filter((d) =>
          this.departments.includes(d.department)
        )
      }
      return this.service_documents.filter((d) =>
        this.departments.includes(d.department)
      )
    },
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
      this.$refs.form.resetFields()
    },
    onServiceSelectChange(val, formName) {
      const document = this.documents.find(
        (d) => d.number == val || d.name == val
      )
      if (document) {
        this[formName].name = document.name
        this[formName].number = document.number
      }
    },
    onSelectChange(id) {
      const { departments } = this.declarants.find((d) => d.id === id)
      if (departments) {
        this.departments = JSON.parse(departments)
      }
    },
    submitService(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true
            const declarant = this.declarants.find(
              (d) => d.id == this[formName].declarant_id
            )
            const formData = {
              order_id: this.order_id,
              declarant: declarant.name,
              ...this[formName],
            }
            if (this.type == 'Документы') {
              const document = await this.$store.dispatch(
                'orders/giveTask',
                formData
              )
              this.$emit('documentGiven', document)
            } else {
              const service = await this.$store.dispatch(
                'service/giveTask',
                formData
              )
              this.$emit('serviceGiven', service)
            }
            const content = `Документ ${this.form.number} в заявке ${this.order_id} дается вам`
            await this.$store.dispatch('notification/createNotifications', {
              user_id: declarant.id,
              content,
            })
            this.loading = false
            this.$refs[formName].resetFields()
          } catch (e) {
            this.loading = false
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>
