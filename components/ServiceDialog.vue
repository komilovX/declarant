<template>
  <el-dialog
    title="Добавить услуг"
    :before-close="handleClose"
    :visible.sync="visible"
    width="70%"
  >
    <el-form :model="serviceForm" ref="serviceForm" class="mt1" :rules="rules">
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
      currencyList: [
        { type: '$', value: '$' },
        { type: 'сум', value: 'sum' },
        { type: 'перечисление', value: 'invoice' },
      ],
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
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    service_documents: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
      this.$refs.serviceForm.resetFields()
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
    submitService(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true
            const formData = {
              order_id: this.$route.params.id,
              total_price: this.serviceForm.price,
              ...this.serviceForm,
            }
            const service = await this.$store.dispatch(
              'orders/createService',
              formData
            )
            this.$emit('serviceAdded', service)
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
