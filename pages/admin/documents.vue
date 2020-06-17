<template>
  <div>
    <el-tabs type="border-card" stretch class="mt1">
      <el-tab-pane label="Документы">
        <div class="table p05">
          <el-row :gutter="15" class="mt1">
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
                  width="80"
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
              <el-row :gutter="15" class="mt1">
                <el-form
                  ref="incomingForm"
                  :model="incomingForm"
                  :rules="rules"
                >
                  <el-col :span="6">
                    <el-form-item prop="number">
                      <el-input
                        placeholder="№"
                        v-model="incomingForm.number"
                        type="number"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item prop="name">
                      <el-input
                        placeholder="Название"
                        v-model="incomingForm.name"
                        type="text"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item id="submit-button">
                      <el-button
                        type="success"
                        size="small"
                        :loading="loading2"
                        @click="submitForm('incomingForm')"
                        >Добавить</el-button
                      >
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
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
                  width="80"
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
              <el-row :gutter="15" class="mt1">
                <el-form
                  ref="decoratedForm"
                  :model="decoratedForm"
                  :rules="rules"
                >
                  <el-col :span="6">
                    <el-form-item prop="number">
                      <el-input
                        placeholder="№"
                        v-model="decoratedForm.number"
                        type="number"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item prop="name">
                      <el-input
                        placeholder="Название"
                        v-model="decoratedForm.name"
                        type="text"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item id="submit-button">
                      <el-button
                        type="success"
                        size="small"
                        :loading="loading2"
                        @click="submitForm('decoratedForm')"
                        >Добавить</el-button
                      >
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
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
                  width="80"
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
              <el-row :gutter="15" class="mt1">
                <el-form
                  ref="declarantForm"
                  :model="declarantForm"
                  :rules="rules"
                >
                  <el-col :span="6">
                    <el-form-item prop="number">
                      <el-input
                        placeholder="№"
                        v-model="declarantForm.number"
                        type="number"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item prop="name">
                      <el-input
                        placeholder="Название"
                        v-model="declarantForm.name"
                        type="text"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item id="submit-button">
                      <el-button
                        type="success"
                        size="small"
                        :loading="loading2"
                        @click="submitForm('declarantForm')"
                        >Добавить</el-button
                      >
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Услуги">
        <el-row class="mt1">
          <el-col :span="10">
            <el-table
              border
              :data="service_documents"
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
                width="250"
                label="Названия"
                prop="name"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column label="Удалить" align="center">
                <template slot-scope="{ row: { id } }">
                  <i
                    @click="deleteService(id)"
                    class="el-icon-delete delete-button"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
            <el-row :gutter="15" class="mt1">
              <el-form ref="serviceForm" :model="serviceForm" :rules="rules">
                <el-col :span="6">
                  <el-form-item prop="number">
                    <el-input
                      placeholder="№"
                      v-model="serviceForm.number"
                      type="number"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item prop="name">
                    <el-input
                      placeholder="Название"
                      v-model="serviceForm.name"
                      type="text"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item id="submit-button">
                    <el-button
                      type="success"
                      size="small"
                      :loading="loading2"
                      @click="submitService('serviceForm')"
                      >Добавить</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  middleware: ["admin-auth"],
  async asyncData({ $axios, error, store }) {
    try {
      const documents = await $axios.$get("api/document");
      const service_documents = await store.dispatch("service/getDocuments");
      return { documents, service_documents };
    } catch (e) {
      console.log(e);
    }
  },
  data: () => ({
    loading: false,
    loading2: false,
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
    serviceForm: {
      number: "",
      name: "",
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
    deleteService(id) {
      const text = "Уверены, что хотите удалить этот документ?";
      this.$confirm(text, "Подтверждение", {
        confirmButtonText: "Да",
        cancelButtonText: "Отменить",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$store.dispatch("service/deleteDocument", id);
            this.service_documents = this.service_documents.filter(
              (d) => d.id != id
            );
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
    submitService(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            const document = await this.$store.dispatch(
              "service/createDocument",
              this.serviceForm
            );
            this.service_documents.push(document);
            this.loading = false;
            this.$refs[formName].resetFields();
            this.$message.success("Документ успешна добавлена");
          } catch (e) {
            this.loading = false;
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
