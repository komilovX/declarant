<template>
  <div id="scrollinElement">
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="$router.back()" />
      <h2>Добавление пользователя</h2>
    </div>
    <div class="form p1">
      <el-form
        ref="employerForm"
        :model="employerForm"
        status-icon
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="Имя" prop="name">
          <el-input v-model="employerForm.name" type="text" class="maxW35" />
        </el-form-item>
        <el-form-item label="Логин" prop="login">
          <el-input v-model="employerForm.login" type="text" class="maxW35" />
        </el-form-item>
        <el-form-item label="Пароль" prop="password">
          <el-input
            v-model="employerForm.password"
            type="password"
            class="maxW35"
          />
        </el-form-item>
        <el-form-item label="Роль" prop="role" class="mb2">
          <el-select v-model="employerForm.role" style="min-width: 35vw;">
            <el-option
              v-for="s in roles"
              :key="s.role"
              :label="s.label"
              :value="s.role"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="employerForm.role === 'declarant'"
          prop="departments"
          label="Отдел"
          class="mb1"
        >
          <el-checkbox-group
            style="max-width: 38vw;"
            v-model="employerForm.departments"
          >
            <el-checkbox
              v-for="d in departments"
              :key="d.value"
              :label="d.label"
            />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item id="submit-button">
          <el-button
            type="success"
            :loading="loading"
            @click="submitForm('employerForm')"
          >
            Сохранить
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import accessForm from '@/mixins/accessForm'
export default {
  mixins: [accessForm],
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            name: this.employerForm.name,
            login: this.employerForm.login,
            password: this.employerForm.password,
            role: this.employerForm.role,
          }
          if (this.employerForm.role === 'declarant') {
            const departments = []
            this.employerForm.departments.forEach((dep) => {
              const department = this.departments.find((d) => d.label == dep)
              departments.push(department.value)
            })
            formData['departments'] = JSON.stringify(departments)
          }
          this.loading = true
          try {
            await this.$store.dispatch('auth/create', formData)
            this.loading = false
            this.$message.success('сотрудник успешна добавлена')
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
