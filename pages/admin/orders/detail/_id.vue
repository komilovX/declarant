<template>
  <div>
    <div class="header df p1 bb">
      <i class="el-icon-arrow-left mr1 arrow-back" @click="$router.back()" />
      <h2>#{{ $route.params.id }}</h2>
    </div>
    <el-row :gutter="20" class="p1">
      <el-col :span="24" :md="12" :sm="24">
        <h4 class="text-center mb1">
          Входящие документы
        </h4>
        <el-table border :data="incoming_documents" size="mini" class="mb2">
          <el-table-column width="100" label="№" align="center" prop="number" />
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
                download
              >Скачать</a>
              <span v-else>No file</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" :md="12" :sm="24">
        <h4 class="text-center mb1">
          Документы офорленные
        </h4>
        <el-table border :data="decorated_documents" size="mini" class="mb2">
          <el-table-column width="80" label="№" align="center" prop="number" />
          <el-table-column
            width="150"
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
      <el-col :span="24" :md="14" :offset="5" :sm="24" class="mb2">
        <h4 class="text-center mb1">
          Необходимые документы
        </h4>
        <el-table border :data="declarant_documents" size="mini" class="mb1">
          <el-table-column width="100" label="№" align="center" prop="number" />
          <el-table-column
            width="150"
            label="Наименование"
            align="center"
            prop="name"
          />
          <el-table-column
            width="180"
            label="Исполнитель"
            align="center"
            prop="declarant"
          />
          <el-table-column label="Обязательно" align="center">
            <template slot-scope="{ row: { status }, row }">
              <el-switch
                :value="status != 'disable'"
                :disabled="status == 'finish'"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="onSwitchChange(row)">
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" :md="22" :offset="1" :sm="24" class="mb2">
        <h4 class="text-center mb1">
          Необходимые услуги документы
        </h4>
        <el-table border :data="serviceList" size="mini">
          <el-table-column width="100" label="№" align="center" prop="number" />
          <el-table-column
            width="180"
            label="Наименование"
            align="center"
            prop="name"
          />
          <el-table-column
            width="180"
            label="Сумма"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row: {price, currency} }">
              {{price}}&nbsp; {{currency}}
            </template>
          </el-table-column>
          <el-table-column
            width="180"
            label="Итог Сумма"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row: {changed, total_price}, $index}">
              <span v-if="!changed">{{total_price}}</span>
              <el-input v-else type="number" v-model="serviceList[$index].total_price" />
            </template>
          </el-table-column>
          <el-table-column label="Изм Сумма" align="center">
            <template slot-scope="{row: {changed}, row}">
              <el-button
                v-if="!changed"
                type="primary"
                @click="changeStatus(row)"
                size="small"
                icon="el-icon-edit"
                circle
                plain
              />
              <div v-else class="df" style="display: inline-block">
                <el-button
                  type="success"
                  :loading="loading"
                  @click="updatePrice(row)"
                  size="small"
                  icon="el-icon-check"
                  circle
                  plain
                />
                <el-button
                  type="danger"
                  @click="() => {row.changed = false, row.total_price = row.price}"
                  size="small"
                  icon="el-icon-close"
                  circle
                  plain
                />
              </div>

            </template>
          </el-table-column>
          <el-table-column
            label="Примечание"
            align="center"
            prop="comment"
            show-overflow-tooltip
          />
        </el-table>
        <div class="total-sum">
          <h2 class="mr2">Итого:</h2>
          <h2 class="mr2">{{getTotalSum}}</h2>
            <el-button
              size="medium"
              v-if="order.percent == 100 && order.status == 'active'"
              type="success"
              @click="changeOrderStatus()"
              :loading="finishLoading"
            >
              Закончить
            </el-button>
        </div>
      </el-col>
    </el-row>
    <!-- Decorated_File Dialog -->
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
</template>

<script>
export default {
  async asyncData({ $axios, route }) {
    try {
      const {
        order = [],
        incoming_documents = [],
        declarant_documents = [],
        decorated_documents = []
      } = await $axios.$get(`api/orders/${route.params.id}/details`)
      const services = await $axios.$get(`api/service/order/${route.params.id}`)

      return { order, incoming_documents, declarant_documents, decorated_documents, services }
    } catch (e) {
      console.log(e)
    }
  },
  data() {
    return {
      loading: false,
      loading2: false,
      finishLoading: false,
      visibleDialog: false,
      newFile: null,
      rawId: null,
    }
  },
  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
    serviceList() {
      let service = this.services
        .map(({id, name, number, price, total_price, comment, currency}) =>
          ({id, name, number, price, total_price, currency, comment, changed: false, type: 'service'} ))
      let declarant = this.declarant_documents
        .filter(d => d.status == 'finish')
        .map(({id, name, number, price, total_price, comment, currency}) =>
          ({id, name, number, price, total_price, currency, comment, changed: false, type: 'declarant' } ))

      return service.concat(declarant)
    },
    getTotalSum() {
      let dollar = 0
      let sum = 0
      this.serviceList.forEach(s => {
        s.currency == '$' ? dollar += s.total_price : sum += s.total_price
      });

      return `${dollar} $  ${sum} сум`
    }
  },
  methods: {
    async onSwitchChange(row) {
      try {
        let status = row.status == 'active' ? 'disable' : 'active'
        const formData = { status }
        await this.$store.dispatch('orders/updateStatusDeclarantDocumentById', {id: row.id, formData})
        row.status = status
      } catch (e) {
        console.log(e)
      }
    },
    async changeOrderStatus() {
      try {
        this.finishLoading = true
        let status = 'done'
        const formData = { status }
        await this.$axios.$put(`api/orders/${this.order.id}/status`, formData)
        this.finishLoading = false
        this.$router.push('/admin/orders')
      } catch (e) {
        this.finishLoading = false
        console.log(e)
      }
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
          `api/orders/${this.rawId}/decorated`,
          fd
        )
        const document = this.decorated_documents.find((d) => d.id == this.rawId)
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
    async updatePrice(row) {
      try {
        this.loading = true
        const formData = { total_price: row.total_price }
        console.log('row', row)
        if (row.type == 'service') {
          console.log('enter')
          await this.$axios.$put(`api/services/${row.id}`, formData)
        }
        else {
          await this.$axios.$put(`api/orders/declarant/${row.id}`, formData)
        }
        row.changed = false
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    changeStatus(row) {
      row.changed = true
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
.total-sum {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: .5rem 1rem;
}
</style>
