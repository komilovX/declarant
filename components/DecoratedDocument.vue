<template>
  <div>
    <h4 class="text-center mb1">Документы оформленные</h4>
    <el-table :data="decorated_documents" size="mini">
      <el-table-column width="60" label="№" align="center" prop="number" />
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
        <template slot-scope="{ row: { id, creator_id } }">
          <el-button
            v-if="creator_id == user.userId"
            @click="$emit('deleteDocument', id)"
            :loading="deleteLoading"
            icon="el-icon-delete"
            size="small"
            type="text"
            class="delete-button"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-form :model="decoratedForm" ref="decoratedForm" :rules="rules">
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
              <el-button size="medium" type="primary">Загрузить</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="5" :sm="24" class="mt2-5">
          <el-form-item id="submit-button">
            <el-button
              size="medium"
              type="success"
              @click="submitForm('decoratedForm')"
              :loading="loading"
              >Добавить</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { createFormData, handleFile, clearForm } from '@/utils/order.util'
export default {
  data() {
    return {
      loading: false,
      fileForm: { file: '' },
      decoratedForm: {
        number: '',
        name: '',
        file: '',
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
  props: ['decorated_documents', 'documents', 'order_id', 'deleteLoading'],
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
  },
  methods: {
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
    submitForm(formName) {
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
              `orders/addDecoratedDocuments`,
              formData
            )
            document.changed = false
            this.$emit('decoratedDocumentAdded', document)
            this.loading = false
            this.$message.success('Документ успешна добавлена')
            this.$refs[`decoratedUpload`].clearFiles()
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
  },
}
</script>
