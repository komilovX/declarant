<template>
  <div>
    <div class="header df-sb p1 bb mb1">
      <h2>Данные</h2>
      <div class="buttons">
        <el-button
          type="primary"
          size="medium"
          plain
          @click="productDialog = true"
        >
          Добавить продукт
        </el-button>
        <el-button
          type="primary"
          size="medium"
          plain
          @click="shopDialog = true"
        >
          Добавить цех
        </el-button>
        <el-button type="primary" size="medium" plain @click="carDialog = true">
          Добавить машина
        </el-button>
      </div>
    </div>
    <div class="table p05">
      <el-row :gutter="15">
        <el-col :span="8" :xs="24">
          <h4 class="mb1 text-center">
            Продукты
          </h4>
          <el-table
            border
            :data="products"
            tooltip-effect="light"
            style="width: 100%;"
          >
            <el-table-column type="index" align="center" width="50" />
            <el-table-column
              width="200"
              label="Названия"
              prop="name"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column label="Удалить" align="center">
              <template slot-scope="{ row: { id } }">
                <el-button
                  :loading="loading"
                  type="danger"
                  size="small"
                  plain
                  icon="el-icon-delete"
                  circle
                  @click="deleteProduct(id)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8" :xs="24">
          <h4 class="mb1 text-center">
            Цехы
          </h4>
          <el-table
            border
            :data="shops"
            tooltip-effect="light"
            style="width: 100%;"
          >
            <el-table-column type="index" align="center" width="50" />
            <el-table-column
              width="200"
              label="Названия"
              prop="name"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column label="Удалить" align="center">
              <template slot-scope="{ row: { id } }">
                <el-button
                  :loading="loading"
                  type="danger"
                  size="small"
                  plain
                  icon="el-icon-delete"
                  circle
                  @click="deleteShop(id)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8" :xs="24">
          <h4 class="mb1 text-center">
            Машины
          </h4>
          <el-table
            border
            :data="cars"
            tooltip-effect="light"
            style="width: 100%;"
          >
            <el-table-column type="index" align="center" width="50" />
            <el-table-column
              width="200"
              label="Названия"
              prop="name"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column label="Удалить" align="center">
              <template slot-scope="{ row: { id } }">
                <el-button
                  :loading="loading"
                  type="danger"
                  size="small"
                  plain
                  icon="el-icon-delete"
                  circle
                  @click="deleteCar(id)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- product -->
      <el-dialog
        title="Добавление продукт"
        :visible.sync="productDialog"
        width="50%"
      >
        <el-form ref="productForm" :model="productForm" :rules="rules">
          <el-form-item prop="name">
            <el-input v-model="productForm.name" type="text" />
          </el-form-item>
          <el-form-item id="submit-button">
            <el-button
              type="success"
              :loading="loading2"
              @click="submitProductForm('productForm')"
            >
              Сохранить
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- Shop -->
      <el-dialog title="Добавление цех" :visible.sync="shopDialog" width="50%">
        <el-form ref="shopForm" :model="shopForm" :rules="rules">
          <el-form-item prop="name">
            <el-input v-model="shopForm.name" type="text" />
          </el-form-item>
          <el-form-item id="submit-button">
            <el-button
              type="success"
              :loading="loading2"
              @click="submitShopForm('shopForm')"
            >
              Сохранить
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- Car -->
      <el-dialog
        title="Добавление машина"
        :visible.sync="carDialog"
        width="50%"
      >
        <el-form ref="carForm" :model="carForm" :rules="rules">
          <el-form-item prop="name">
            <el-input v-model="carForm.name" type="text" />
          </el-form-item>
          <el-form-item id="submit-button">
            <el-button
              type="success"
              :loading="loading2"
              @click="submitCarForm('carForm')"
            >
              Сохранить
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({ store, error }) {
    try {
      const products = await store.dispatch('data/getProducts')
      const shops = await store.dispatch('data/getShops')
      const cars = await store.dispatch('data/getCars')
      return { products, shops, cars }
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
    loading: false,
    loading2: false,
    productDialog: false,
    shopDialog: false,
    carDialog: false,
    productForm: {
      name: '',
    },
    shopForm: {
      name: '',
    },
    carForm: {
      name: '',
    },
    rules: {
      name: [
        {
          required: true,
          message: 'Пожалуйста, введите название деятельности',
          trigger: 'blur',
        },
      ],
    },
  }),
  validate({ store, error }) {
    const { role = null } = store.getters['auth/user']
    if (role == 1 || role == 2) {
      return true
    }
    return false
  },
  methods: {
    goToForm() {
      this.$router.push(`/admin/organization_form`)
    },
    deleteProduct(id) {
      const text = 'Уверены, что хотите удалить этого организациа?'
      this.$confirm(text, 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await this.$store.dispatch('data/deleteProduct', id)
            this.products = this.products.filter((t) => t.id != id)
            this.$message.success('Продукт удалена')
          } catch (e) {
            console.log(e)
          }
        })
        .catch(() => {})
    },
    deleteShop(id) {
      const text = 'Уверены, что хотите удалить этого цех?'
      this.$confirm(text, 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await this.$store.dispatch('data/deleteShop', id)
            this.shops = this.shops.filter((t) => t.id != id)
            this.$message.success('Цех удалена')
          } catch (e) {
            console.log(e)
          }
        })
        .catch(() => {})
    },
    deleteCar(id) {
      const text = 'Уверены, что хотите удалить этого машина?'
      this.$confirm(text, 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await this.$store.dispatch('data/deleteCar', id)
            this.cars = this.cars.filter((t) => t.id != id)
            this.$message.success('Машина удалена')
          } catch (e) {
            console.log(e)
          }
        })
        .catch(() => {})
    },
    submitProductForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            name: this.productForm.name,
          }
          this.loading2 = true
          try {
            const product = await this.$store.dispatch(
              'data/createProduct',
              formData
            )
            this.products.push(product)
            this.loading2 = false
            this.$refs.productForm.resetFields()
            this.$message.success('Продукт успешна добавлена')
          } catch (e) {
            this.loading2 = false
            console.log(e)
          }
        } else {
          return false
        }
      })
    },

    submitShopForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            name: this.shopForm.name,
          }
          this.loading2 = true
          try {
            const shop = await this.$store.dispatch('data/createShop', formData)
            this.shops.push(shop)
            this.loading2 = false
            this.$refs.shopForm.resetFields()
            this.$message.success('Цех успешна добавлена')
          } catch (e) {
            this.loading2 = false
            console.log(e)
          }
        } else {
          return false
        }
      })
    },
    submitCarForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            name: this.carForm.name,
          }
          this.loading2 = true
          try {
            const shop = await this.$store.dispatch('data/createCar', formData)
            this.cars.push(shop)
            this.loading2 = false
            this.$refs.carForm.resetFields()
            this.$message.success('Машина успешна добавлена')
          } catch (e) {
            this.loading2 = false
            console.log(e)
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
</style>
