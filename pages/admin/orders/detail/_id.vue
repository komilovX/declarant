<template>
  <div>
    <div class="header df p1 bb">
      <i class="el-icon-arrow-left mr1 arrow-back" @click="$router.back()" />
      <h2>#{{ $route.params.id }}</h2>
    </div>
    <el-row :gutter="20" class="p1">
      <el-col :span="24" :md="12" :sm="24">
        <h4 class="mb1">
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
                target="_blank"
              >Посмотреть</a>
              <span v-else>No file</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" :md="12" :sm="24">
        <div class="df-sb">
          <h4>
            Документы оформленные
          </h4>
          <el-button
            @click="visibleDialog = true"
            type="text" style="font-size: 25px" icon="el-icon-plus" />
        </div>
        <el-table border :data="decorated_documents" size="mini" class="mb2">
          <el-table-column width="80" label="№" align="center" prop="number" />
          <el-table-column
            width="200"
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
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="Удалить" align="center">
            <template slot-scope="{ row: { id } }">
              <el-button
                @click="deleteDecoratedDocument(id)"
                :loading="decoratedLoading"
                icon="el-icon-delete" size="small" circle plain type="danger" />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" :md="14" :offset="5" :sm="24" class="mb2">
        <div class="df-sb">
          <h4>
            Необходимые документы
          </h4>
          <el-button
            @click="declarantDialog = true"
            type="text" style="font-size: 25px" icon="el-icon-plus" />
        </div>
        <el-table border :data="declarant_documents" size="mini" class="mb1">
          <el-table-column width="100" label="№" align="center" prop="number" />
          <el-table-column
            width="200"
            label="Наименование"
            align="center"
            prop="name"
          />
          <el-table-column
            width="200"
            label="Исполнитель"
            align="center"
            prop="declarant"
          />
          <el-table-column label="Удалить" align="center">
            <template slot-scope="{ row: { id, status } }">
              <el-button
                v-if="status == 'active'"
                @click="deleteDeclarantdDocument(id)"
                :loading="declarantdLoading"
                icon="el-icon-delete" size="small" circle plain type="danger" />
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
    <el-dialog title="Загрузить" :visible.sync="visibleDialog" width="40%">
      <el-table
        ref="multipleTable"
        :data="getDecorated"
        @selection-change="handleDecoratedSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55" />
        <el-table-column
          width="150"
          label="№"
          align="center"
          prop="number"
        />
        <el-table-column
          label="Наименование"
          align="center"
          prop="name"
        />
      </el-table>
      <el-button
        @click="addDecoratedDocuments"
        :loading="loading"
        size="medium"
        type="primary"
        class="mt1"
      >
        Добавить
      </el-button>
    </el-dialog>

    <!-- Declarant_Document file -->
    <el-dialog title="Загрузить" :visible.sync="declarantDialog" width="40%">
      <el-table
        ref="multipleTable"
        :data="getDeclarant"
        @selection-change="handleDeclarantSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55" />
        <el-table-column
          width="150"
          label="№"
          align="center"
          prop="number"
        />
        <el-table-column
          label="Наименование"
          align="center"
          prop="name"
        />
      </el-table>
      <el-button
        @click="addDeclarantDocuments"
        :loading="loading2"
        size="medium"
        type="primary"
        class="mt1"
      >
        Добавить
      </el-button>
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
      const documents = await $axios.$get('api/document')
      return { order, incoming_documents, declarant_documents, decorated_documents, services, documents }
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
      declarantDialog: false,
      multipleDecoratedSelection: [],
      multipleDeclarantSelection: [],
      decoratedLoading: false,
      declarantdLoading: false,
    }
  },
  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
    getDecorated() {
      let numbers = this.decorated_documents.map(p => p.number)
      let documents = this.documents.filter(d => d.type == 'decorated')
      return documents.filter(d => !numbers.includes(d.number))
    },
    getDeclarant() {
      let numbers = this.declarant_documents.map(p => p.number)
      let documents = this.documents.filter(d => d.type == 'declarant')
      return documents.filter(d => !numbers.includes(d.number))
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
    //// Decorated ////

    handleDecoratedSelectionChange(val) {
      this.multipleDecoratedSelection = val
    },
    async addDecoratedDocuments() {
      if (this.multipleDecoratedSelection.length > 0) {
        try {
          this.loading = true
          const formData = {
            id: this.$route.params.id,
            form: this.multipleDecoratedSelection
          }
          await this.$store.dispatch('orders/addDecoratedDocuments', formData)
          const documents = await this.$axios.$get('api/document?type=decorated')
          this.decorated_documents = documents
          this.visibleDialog = false
          this.loading = false
        } catch (e) {
          this.loading = false
          console.log(e)
        }
        this.visibleDialog = false
      }
      else {
        this.$message.info('No data')
      }
    },
    async deleteDecoratedDocument(id) {
      try {
        this.decoratedLoading = true
        await this.$store.dispatch('orders/deleteDecoratedDocument', id)
        this.decoratedLoading = false
        this.decorated_documents = this.decorated_documents.filter(d => d.id != id)
      } catch (e) {
        this.decoratedLoading = false
        console.log(e)
      }
    },
    // ////
    ////// Declarant /////
    handleDeclarantSelectionChange(val) {
      this.multipleDeclarantSelection = val
    },
    async addDeclarantDocuments() {
      if (this.multipleDeclarantSelection.length > 0) {
        try {
          this.loading2 = true
          const formData = {
            id: this.$route.params.id,
            form: this.multipleDeclarantSelection
          }
          await this.$store.dispatch('orders/addDeclarantDocuments', formData)
          const documents = await this.$store.dispatch(
            'orders/findDeclarantDocumentsByOrderId', this.$route.params.id )

          this.declarant_documents = documents
          this.declarantDialog = false
          this.loading2 = false
        } catch (e) {
          this.loading2 = false
          console.log(e)
        }
        this.visibleDialog = false
      }
      else {
        this.$message.info('No data')
      }
    },
    async deleteDeclarantdDocument(id) {
      try {
        this.declarantdLoading = true
        await this.$store.dispatch('orders/deleteDeclarantdDocument', id)
        this.declarantdLoading = false
        this.declarant_documents = this.declarant_documents.filter(d => d.id != id)
      } catch (e) {
        this.declarantdLoading = false
        console.log(e)
      }
    },

    // ////
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
