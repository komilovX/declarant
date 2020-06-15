<template>
  <div>
    <div class="header df-sb p1 bb mb1">
      <h2>Документы</h2>
      <div class="buttons">
        <el-button
          type="primary"
          size="medium"
          plain
          @click="incomingDialog = true"
          >Добавить вход док</el-button
        >
        <el-button
          type="primary"
          size="medium"
          plain
          @click="decoratedDialog = true"
          >Добавить док офорл</el-button
        >
        <el-button
          type="primary"
          size="medium"
          plain
          @click="declarantDialog = true"
          >Добавить необх док</el-button
        >
      </div>
    </div>
    <div class="table p05">
      <el-row :gutter="15">
        <el-col :span="8" :xs="24">
          <h4 class="mb1 text-center">Входящие документы</h4>
          <el-table
            border
            :data="incomindDocuments"
            tooltip-effect="light"
            style="width: 100%;"
          >
            <el-table-column
              label="№"
              prop="number"
              align="center"
              width="100"
            />
            <el-table-column
              width="180"
              label="Названия"
              prop="name"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column label="Удалить" align="center">
              <template slot-scope="{ row: { id } }">
                <i
                  @click="deleteProduct(id)"
                  class="el-icon-delete delete-button"
                ></i>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8" :xs="24">
          <h4 class="mb1 text-center">Документы офорленные</h4>
          <el-table
            border
            :data="decoratedDocuments"
            tooltip-effect="light"
            style="width: 100%;"
          >
            <el-table-column
              label="№"
              prop="number"
              align="center"
              width="100"
            />
            <el-table-column
              width="180"
              label="Названия"
              prop="name"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column label="Удалить" align="center">
              <template slot-scope="{ row: { id } }">
                <i
                  @click="deleteProduct(id)"
                  class="el-icon-delete delete-button"
                ></i>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8" :xs="24">
          <h4 class="mb1 text-center">Необходимые документы</h4>
          <el-table
            border
            :data="declarantDocuments"
            tooltip-effect="light"
            style="width: 100%;"
          >
            <el-table-column
              label="№"
              prop="number"
              align="center"
              width="100"
            />
            <el-table-column
              width="180"
              label="Названия"
              prop="name"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column label="Удалить" align="center">
              <template slot-scope="{ row: { id } }">
                <i
                  @click="deleteProduct(id)"
                  class="el-icon-delete delete-button"
                ></i>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- product -->
      <el-dialog
        title="Необходимые услуги документы"
        :visible.sync="declarantDialog"
        width="50%"
      >
        <el-form ref="declarantForm" :model="declarantForm" :rules="rules">
          <el-form-item prop="number" label="Номер">
            <el-input v-model="declarantForm.number" type="number" />
          </el-form-item>
          <el-form-item prop="name" label="Название">
            <el-input v-model="declarantForm.name" type="text" />
          </el-form-item>
          <el-form-item id="submit-button">
            <el-button
              type="success"
              :loading="loading2"
              @click="submitForm('declarantForm')"
              >Сохранить</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- Shop -->
      <el-dialog
        title="Входящие документы"
        :visible.sync="incomingDialog"
        width="50%"
      >
        <el-form ref="incomingForm" :model="incomingForm" :rules="rules">
          <el-form-item prop="number" label="Номер">
            <el-input v-model="incomingForm.number" type="number" />
          </el-form-item>
          <el-form-item prop="name" label="Название">
            <el-input v-model="incomingForm.name" type="text" />
          </el-form-item>
          <el-form-item id="submit-button">
            <el-button
              type="success"
              :loading="loading2"
              @click="submitForm('incomingForm')"
              >Сохранить</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- Car -->
      <el-dialog
        title="Документы офорленные"
        :visible.sync="decoratedDialog"
        width="50%"
      >
        <el-form ref="decoratedForm" :model="decoratedForm" :rules="rules">
          <el-form-item prop="number" label="Номер">
            <el-input v-model="decoratedForm.number" type="number" />
          </el-form-item>
          <el-form-item prop="name" label="Название">
            <el-input v-model="decoratedForm.name" type="text" />
          </el-form-item>
          <el-form-item id="submit-button">
            <el-button
              type="success"
              :loading="loading2"
              @click="submitForm('decoratedForm')"
              >Сохранить</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ["admin-auth"],
  async asyncData({ $axios, error }) {
    try {
      const documents = await $axios.$get("api/document");
      return { documents };
    } catch (e) {
      console.log(e);
    }
  },
  data: () => ({
    loading: false,
    loading2: false,
    incomingDialog: false,
    declarantDialog: false,
    decoratedDialog: false,
    incomingForm: {
      number: "",
      name: "",
      type: "incoming",
    },
    decoratedForm: {
      number: "",
      name: "",
      type: "decorated",
    },
    declarantForm: {
      number: "",
      name: "",
      type: "declarant",
    },
    rules: {
      number: [
        {
          required: true,
          message: "Пожалуйста, введите название деятельности",
          trigger: "blur",
        },
      ],
      name: [
        {
          required: true,
          message: "Пожалуйста, введите название деятельности",
          trigger: "blur",
        },
      ],
    },
  }),
  computed: {
    incomindDocuments() {
      return this.documents.filter((p) => p.type == "incoming");
    },
    decoratedDocuments() {
      return this.documents.filter((p) => p.type == "decorated");
    },
    declarantDocuments() {
      return this.documents.filter((p) => p.type == "declarant");
    },
  },
  validate({ store, error }) {
    const { role = null } = store.getters["auth/user"];
    if (role == "admin") {
      return true;
    }
    return false;
  },
  methods: {
    goToForm() {
      this.$router.push(`/admin/organization_form`);
    },
    deleteProduct(id) {
      const text = "Уверены, что хотите удалить этот документ?";
      this.$confirm(text, "Подтверждение", {
        confirmButtonText: "Да",
        cancelButtonText: "Отменить",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$axios.$delete(`api/document/${id}`);
            this.documents = this.documents.filter((d) => d.id != id);
            this.$message.success("Документ удалена");
          } catch (e) {
            console.log(e);
          }
        })
        .catch(() => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading2 = true;
          try {
            const document = await this.$axios.$post(
              "api/document",
              this[formName]
            );
            this.documents.push(document);
            this.loading2 = false;
            this.$refs[formName].resetFields();
            this.$message.success("Документ успешна добавлена");
          } catch (e) {
            this.loading2 = false;
            console.log(e);
          }
        } else {
          return false;
        }
      });
    },
  },
};
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
</style>
