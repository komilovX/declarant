<template>
  <div id="scrollinElement">
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="$router.back()" />
      <h2>Добавление</h2>
    </div>
    <div class="form p1">
      <el-form
        ref="adminForm"
        :model="adminForm"
        status-icon
        :rules="rules"
        label-width="200px"
        class="demo-ruleForm"
      >
        <el-form-item label="Имя" prop="name">
          <el-input v-model="adminForm.name" type="text" class="maxW35" />
        </el-form-item>
        <el-form-item label="Логин" prop="login">
          <el-input v-model="adminForm.login" type="text" class="maxW35" />
        </el-form-item>
        <el-form-item label="Пароль" prop="password">
          <el-button v-if="!changePassword" type="text" @click="needPassword()">
            Сменить пароль
          </el-button>
          <el-input
            v-else
            v-model="adminForm.password"
            type="password"
            class="maxW35"
          />
        </el-form-item>
        <el-form-item label="Должность" prop="role">
          <el-select v-model="adminForm.role" style="min-width: 35vw;">
            <el-option
              v-for="r in roles"
              :key="r.role"
              :label="r.label"
              :value="r.role"
            />
          </el-select>
        </el-form-item>
        <el-form-item id="submit-button">
          <el-button
            type="success"
            :loading="loading"
            @click="submitForm('adminForm')"
          >
            Сохранить
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({ store, route, error }) {
    try {
      const admin = await store.dispatch('auth/findById', route.params.id)
      console.log('admin', admin)
      return { admin }
    } catch (e) {
      error(e)
    }
  },
  data() {
    return {
      loading: false,
      changePassword: false,
      adminForm: {
        name: '',
        login: '',
        password: '',
        comment: '',
        role: '',
      },
      roles: [
        { role: 'admin', label: 'Администратор' },
        { role: 'declarant', label: 'Исполнитель' },
        { role: 'client', label: 'КЛИЕНТ', },
      ],
      rules: {
        name: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
        login: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: false,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
        role: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  validate({ store }) {
    let { role = null } = store.getters['auth/user']
    if (role == 1) {
      return true
    }
    return false
  },
  mounted() {
    this.adminForm.name = this.admin.name
    this.adminForm.login = this.admin.login
    this.adminForm.role = this.admin.role
  },
  methods: {
    needPassword() {
      this.changePassword = true
      this.rules.password[0].required = true
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            name: this.adminForm.name,
            login: this.adminForm.login,
            password: this.adminForm.password,
            role: this.adminForm.role,
          }
          this.loading = true
          try {
            await this.$store.dispatch('auth/updateById', {
              id: this.$route.params.id,
              formData,
            })
            this.loading = false
            this.$message.success('Сотрудник успешна обнавлена')
            this.$router.push('/admin/access')
          } catch (e) {
            this.loading = false
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
<style>
.el-form label {
  text-align: left;
}
</style>
<style lang="scss" scoped>
.header i {
  font-weight: 800;
  font-size: 20px;
  color: #2688cd;
  cursor: pointer;
}
img {
  max-width: 125px;
  max-height: 95px;
}
.el-table i {
  font-size: 20px;
  font-weight: 800;
  line-height: 40px;
  vertical-align: -webkit-baseline-middle;
}
.addmore {
  display: inline;
  cursor: pointer;
  color: #2688cd;
}
#submit-button {
  margin-top: 2rem;
}
</style>
