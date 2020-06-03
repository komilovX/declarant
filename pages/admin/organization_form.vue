<template>
  <div id="scrollinElement">
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="$router.back()" />
      <h2>Добавление организации</h2>
    </div>
    <div class="form p1">
      <el-form
        ref="organizationForm"
        :model="organizationForm"
        status-icon
        :rules="rules"
        label-width="180px"
        class="demo-ruleForm"
      >
        <el-form-item label="Название организации" prop="name">
          <el-input
            v-model="organizationForm.name"
            type="text"
            class="maxW35"
          />
        </el-form-item>
        <el-form-item label="ИНН" prop="inn">
          <el-input v-model="organizationForm.inn" type="text" class="maxW35" />
        </el-form-item>
        <el-form-item id="submit-button">
          <el-button
            type="success"
            :loading="loading"
            @click="submitForm('organizationForm')"
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
  data() {
    return {
      loading: false,
      organizationForm: {
        name: '',
        inn: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
        inn: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  validate({ store, error }) {
    const { role = null } = store.getters['auth/user']
    if (role == 1 || role == 2) {
      return true
    }
    return false
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            name: this.organizationForm.name,
            inn: this.organizationForm.inn,
          }
          this.loading = true
          try {
            await this.$store.dispatch(
              'organization/createOrganization',
              formData
            )
            this.loading = false
            this.$message.success('Организация успешна добавлена')
            this.$router.push('/admin/organization')
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
</style>
