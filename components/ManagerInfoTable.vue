<template>
  <div>
    <el-table
      border
      :data="serviceList"
      :row-class-name="tableRowClassName"
      size="mini"
    >
      <el-table-column width="100" label="№" align="center" prop="number" />
      <el-table-column
        width="200"
        label="Наименование"
        align="center"
        prop="name"
      />
      <el-table-column width="250" label="Файл" align="center">
        <template slot-scope="{ row: { file, type }, row }">
          <a
            v-if="file"
            :href="`/uploads/${file}`"
            class="download-url"
            target="_blank"
            >Посмотреть</a
          >
          <div v-else-if="!file && type == 'declarant'" class="df-jc">
            <el-upload
              ref="fileUpload"
              :auto-upload="false"
              action="http://localhost:3000"
              :on-change="(file, fileList) => handleChange(file, fileList, row)"
            >
              <el-button size="small" type="primary">Загрузить файл</el-button>
            </el-upload>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        width="250"
        label="Исполнитель"
        align="center"
        prop="creator"
      />
      <el-table-column width="120" label="Изменить" align="center">
        <template slot-scope="{ row: { changed }, row }">
          <el-button
            v-if="row.status == 'task'"
            @click="deleteDocument(row)"
            :loading="deleteLoading"
            icon="el-icon-delete"
            size="small"
            type="text"
            class="delete-button"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { handleFile } from '@/utils/order.util'
export default {
  data() {
    return {
      deleteLoading: false,
      loading: false,
      fileForm: { file: '' },
    }
  },
  props: {
    services: {
      type: Array,
      default: () => [],
    },
    declarant_documents: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    serviceList() {
      let service = this.services.map((s) => ({
        id: s.id,
        name: s.name,
        creator: s.user,
        number: s.number,
        price: s.price,
        total_price: s.total_price,
        currency: s.currency,
        comment: s.comment,
        status: s.status,
        changed: false,
        type: 'service',
      }))
      let declarant = this.declarant_documents.map((s) => ({
        id: s.id,
        name: s.name,
        creator: s.declarant,
        number: s.number,
        file: s.file,
        price: s.price,
        total_price: s.total_price,
        currency: s.currency,
        comment: s.comment,
        status: s.status,
        changed: false,
        type: 'declarant',
      }))

      return service.concat(declarant)
    },
  },
  methods: {
    async updateDocument(row) {
      if (this.fileForm.file) {
        try {
          this.loading = true
          const fd = new FormData()
          fd.append('file', this.fileForm.file.raw, this.fileForm.file.name)
          const result = await this.$axios.$put(
            `api/orders/declarant/${row.id}?file=true`,
            fd
          )
          row.file = result.file
          this.$refs['fileUpload'].clearFiles()
          this.loading = false
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      } else {
        this.$message.error('No file')
      }
    },
    async handleChange(file, fileList, row) {
      let type = file.raw.type
      const idx = type.search(/png|jpeg|docx|doc|pdf/)
      if (idx == -1) {
        fileList = []
        this.$message.error('файлы толка с расширением png|jpeg|docx|doc|pdf ')
        return
      }
      const fd = new FormData()
      fd.append('file', file.raw, file.name)
      const result = await this.$axios.$put(
        `api/orders/declarant/${row.id}?file=true`,
        fd
      )
      row.file = result.file
      this.$refs['fileUpload'].clearFiles()
    },
    async deleteDocument(row) {
      try {
        this.deleteLoading = true
        if (row.type == 'declarant') {
          await this.$store.dispatch(`orders/deleteDeclarantDocument`, row.id)
          this.$emit('documentDeleted', { id: row.id, type: 'declarant' })
        } else {
          await this.$store.dispatch(`service/deleteDocument`, row.id)
          this.$emit('documentDeleted', { id: row.id, type: 'service' })
        }
        this.deleteLoading = false
      } catch (e) {
        this.deleteLoading = false
        console.log(e)
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status == 'task') {
        return 'task-row'
      }
      if (row.type == 'service') {
        return 'service-row'
      }
      if (row.type == 'declarant') {
        return 'declarant-row'
      }
      return ''
    },
  },
}
</script>
<style>
.el-table .service-row {
  background-color: rgba(252, 0, 0, 0.25);
}
.el-table .declarant-row {
  background-color: rgba(1, 69, 255, 0.2);
}
.el-table .task-row {
  background-color: rgba(248, 232, 85, 0.4);
}
</style>
<style lang="scss" scoped>
.total-sum {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
}
</style>
