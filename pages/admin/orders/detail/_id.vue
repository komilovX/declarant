<template>
  <div>
    <div class="header df p1 bb">
      <i class="el-icon-arrow-left mr1 arrow-back" @click="$router.back()" />
      <h2>#{{ $route.params.id }}</h2>
    </div>
    <OrderInfo :order="order" />
    <el-row :gutter="20" class="p1">
      <el-col :span="24" :md="12" :sm="24">
        <AdminFileTable
          :documents="incoming_documents"
          name="Входящие документы"
        />
      </el-col>
      <el-col :span="24" :md="12" :sm="24">
        <AdminFileTable
          :documents="decorated_documents"
          name="Документы оформленные"
        />
      </el-col>
      <el-col :span="24" class="mb2">
        <div class="df-sb">
          <div class="df" style="align-items: center;">
            <h4 class="text-center mr1">Необходимые Услуги, Документы</h4>
            <el-button type="text" @click="visibleDialog = true"
              >Добавить услуг</el-button
            >
          </div>
          <el-button type="text" @click="openTaskDialog">
            Дать задание
          </el-button>
        </div>
        <div style="padding: 8px;" class="df">
          <div>
            <span>ИНВ:&nbsp;</span>
            <u>{{ order.inv }}</u
            >&nbsp;|
            <span>ИНВ Сумма:&nbsp;</span>
            <u>{{ order.inv_price }}</u
            >&nbsp;{{ order.currency }}
          </div>
          <div class="cubics df">
            <div class="df">
              <div class="service-row" />
              <span>Услуги</span>
            </div>
            <div class="df">
              <div class="declarant-row" />
              <span>Документы</span>
            </div>
            <div class="df">
              <div class="task-row" />
              <span>Ожидающий</span>
            </div>
          </div>
        </div>
        <AdminInfoTable
          :services="services"
          :declarant_documents="declarant_documents"
          @documentDeleted="deleteTask"
        />
      </el-col>
    </el-row>
    <ServiceDialog
      :visible="visibleDialog"
      :service_documents="service_documents"
      @handleClose="visibleDialog = false"
      @serviceAdded="($event) => services.push($event)"
    />
    <GiveTaskDialog
      :visible="taskDialog"
      :service_documents="service_documents"
      :declarant_documents="documents"
      :declarants="declarants"
      :order_id="order.id"
      @handleClose="taskDialog = false"
      @documentGiven="($event) => declarant_documents.push($event)"
      @serviceGiven="($event) => services.push($event)"
    />
  </div>
</template>

<script>
import AdminInfoTable from '@/components/AdminInfoTable.vue'
import AdminFileTable from '@/components/AdminFileTable.vue'
import OrderInfo from '@/components/OrderInfo.vue'
import ServiceDialog from '@/components/ServiceDialog.vue'
import GiveTaskDialog from '@/components/GiveTaskDialog.vue'
export default {
  async asyncData({ $axios, store, route }) {
    try {
      const {
        order = {},
        incoming_documents = [],
        declarant_documents = [],
        decorated_documents = [],
      } = await $axios.$get(`api/orders/${route.params.id}/details`)
      const services = await $axios.$get(`api/service/order/${route.params.id}`)
      const service_documents = await store.dispatch('service/getDocuments')
      return {
        order,
        incoming_documents,
        declarant_documents,
        decorated_documents,
        service_documents,
        services,
      }
    } catch (e) {
      console.log(e)
    }
  },
  data() {
    return {
      visibleDialog: false,
      taskDialog: false,
      documents: [],
      declarants: [],
    }
  },
  methods: {
    formaterDate(date) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }
      return new Date(date).toLocaleString('ru-RU', options)
    },
    deleteTask({ id, type }) {
      if (type == 'declarant') {
        this.declarant_documents = this.declarant_documents.filter(
          (d) => d.id != id
        )
      } else {
        this.services = this.services.filter((d) => d.id != id)
      }
    },
    async openTaskDialog() {
      try {
        const documents = await this.$axios.$get('api/document?type=declarant')
        const declarants = await this.$store.dispatch('auth/findAllDeclarants')
        this.declarants = declarants
        this.documents = documents
        this.taskDialog = true
      } catch (e) {
        console.log('e', e)
      }
    },
  },
  components: {
    AdminInfoTable,
    AdminFileTable,
    OrderInfo,
    ServiceDialog,
    GiveTaskDialog,
  },
  validate({ store, error }) {
    const { role = null } = store.getters['auth/user']
    if (role == 'admin') {
      return true
    }
    return false
  },
}
</script>
<style lang="scss" scoped>
.cubics {
  padding: 5px;
  margin-left: 2rem;
  [class$='-row'] {
    width: 20px;
    height: 20px;
    margin: 0 8px;
  }
  .service-row {
    background-color: rgba(252, 0, 0, 0.3);
  }
  .declarant-row {
    background-color: rgba(1, 69, 255, 0.3);
  }
  .task-row {
    background-color: rgba(248, 232, 85, 0.5);
  }
}
</style>
