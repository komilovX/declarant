<template>
  <el-form
    ref="orderData"
    :model="orderData"
    status-icon
    :rules="rules"
    label-width="160px"
  >
    <el-form-item label="Дата" prop="date" class="minW35">
      <el-date-picker
        v-model="orderData.date"
        disabled
        type="date"
        placeholder="Pick a day"
        class="maxW35"
      />
    </el-form-item>
    <el-form-item label="Номер контейнера" prop="container">
      <el-input v-model="orderData.container" type="text" class="maxW35" />
    </el-form-item>
    <el-form-item label="Имя клиента" prop="client">
      <el-select v-model="orderData.client" style="width: 100%;">
        <el-option v-for="c in ['sarvar']" :key="c" :label="c" :value="c" />
      </el-select>
    </el-form-item>
    <el-form-item label="Код груза" prop="product_code">
      <el-input v-model="orderData.product_code" type="text" class="maxW35" />
    </el-form-item>
    <el-form-item label="Клиент фирма" prop="client_company">
      <el-input v-model="orderData.client_company" type="text" class="maxW35" />
    </el-form-item>
    <el-form-item label="Пост номер" prop="post_number">
      <el-input v-model="orderData.post_number" type="text" class="maxW35" />
    </el-form-item>
    <el-form-item id="submit-button">
      <el-button
        type="success"
        :loading="loading"
        @click="submitForm('orderData')"
      >
        Сохранить
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      orderData: this.data,
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
    }
  },
}
</script>

<style lang="scss" scoped></style>
