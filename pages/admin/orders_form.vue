<template>
  <div>
    <div class="header df p1 bb mb1">
      <i class="el-icon-arrow-left arrow-back mr1" @click="$router.back()" />
      <h2>Cоздание заявки</h2>
    </div>
    <div class="form p1">
      <el-row :gutter="20">
        <el-col :span="24" :md="12" :sm="24">
          <el-form
            ref="ordersForm"
            :model="ordersForm"
            status-icon
            :rules="rules"
            label-width="160px"
            label-position="top"
          >
            <el-col :span="24" :md="12" :sm="24">
              <el-form-item label="Дата" prop="date">
                <el-date-picker
                  v-model="ordersForm.date"
                  disabled
                  type="date"
                  placeholder="Pick a day"
                  class="mr2"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="12" :sm="24">
              <el-form-item label="Пост номер" prop="post_number">
                <el-input v-model="ordersForm.post_number" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="12" :sm="24">
              <el-form-item label="Номер контейнера" prop="container">
                <el-input v-model="ordersForm.container" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="12" :sm="24">
              <el-form-item label="Название товара" prop="product">
                <el-input v-model="ordersForm.product" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Клиент фирма" prop="client_company">
                <el-select
                  v-model="ordersForm.client_company"
                  style="width: 100%;"
                  placeholder="Клиент фирма"
                >
                  <el-option
                    v-for="(c, index) in clients"
                    :key="index"
                    :label="c.name"
                    :value="c.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="12" :sm="24">
              <el-form-item label="ИНВ" prop="inv">
                <el-input v-model="ordersForm.inv" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="12" :sm="24">
              <el-form-item label="Сумма" prop="inv_price">
                <el-input v-model="ordersForm.inv_price" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="24" class="mb1" style="padding: 1rem;">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-change="handleOrderFileChange"
              >
                <el-button size="small" type="primary"
                  >Загрузить файл</el-button
                >
              </el-upload>
            </el-col>
            <el-col>
              <el-form-item id="submit-button">
                <el-button
                  type="success"
                  :loading="loading"
                  @click="submitForm('ordersForm')"
                  >Сохранить</el-button
                >
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
        <el-col :span="24" :md="12" :sm="24">
          <h3 class="mb1">Входящие документы</h3>
          <el-table :data="filteredDocuments">
            <el-table-column
              width="120"
              label="№"
              align="center"
              prop="number"
            />
            <el-table-column
              width="130"
              label="Наименование"
              align="center"
              prop="name"
            />
            <el-table-column label="Файл" align="center">
              <template slot-scope="{ $index }">
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-change="(file) => handleChange(file, $index)"
                >
                  <el-button size="small" type="primary"
                    >Загрузить файл</el-button
                  >
                </el-upload>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            @click="visibleDialog = true"
            size="medium"
            type="success"
            plain
            class="mt1"
            >Добавить</el-button
          >
        </el-col>
      </el-row>

      <!-- Dialog -->
      <el-dialog title="Загрузить" :visible.sync="visibleDialog" width="40%">
        <el-table
          ref="multipleTable"
          :data="documents"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column width="150" label="№" align="center" prop="number" />
          <el-table-column label="Наименование" align="center" prop="name" />
        </el-table>
        <el-button
          @click="addDocuments"
          size="medium"
          type="primary"
          class="mt1"
          >Добавить</el-button
        >
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ["admin-auth"],
  async asyncData({ $axios, store, error }) {
    try {
      const documents = await $axios.$get("api/document?type=incoming");
      const clients = await store.dispatch("auth/findAllClients");
      return { documents, clients };
    } catch (e) {
      console.log(e);
    }
  },
  data: () => ({
    visibleDialog: false,
    filteredDocuments: [],
    multipleSelection: [],
    loading: false,
    fileList: [],
    ordersForm: {
      date: new Date(),
      container: "",
      client_company: "",
      product: "",
      post_number: "",
      inv_price: "",
      inv_file: "",
    },
    rules: {
      container: [
        {
          required: true,
          message: "Пожалуйста, введите название деятельности",
          trigger: "blur",
        },
      ],
      product: [
        {
          required: true,
          message: "Пожалуйста, введите название деятельности",
          trigger: "blur",
        },
      ],
      client_company: [
        {
          required: true,
          message: "Пожалуйста, введите название деятельности",
          trigger: "blur",
        },
      ],
      post_number: [
        {
          required: true,
          message: "Пожалуйста, введите название деятельности",
          trigger: "blur",
        },
      ],
      inv_price: [
        {
          required: true,
          message: "Пожалуйста, введите название деятельности",
          trigger: "blur",
        },
      ],
    },
  }),
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            var fd = new FormData();
            const {
              date,
              client_company,
              inv = null,
              product,
              inv_price,
              inv_file,
              container,
              post_number,
            } = this.ordersForm;
            fd.append("date", date);
            fd.append("client_company", client_company);
            fd.append("container", container);
            fd.append("product", product);
            fd.append("post_number", post_number);
            fd.append("inv", inv);
            fd.append("inv_price", inv_price);
            fd.append("fileDocuments", JSON.stringify(this.filteredDocuments));
            if (inv_file) {
              fd.append("file", inv_file.raw, inv_file.name);
            }
            this.fileList.forEach((d) => {
              if (d) {
                fd.append("files", d.raw, d.name);
              }
            });
            this.loading = true;
            await this.$store.dispatch("orders/createOrder", fd);
            this.loading = false;
            this.$message.success("Заявки успешна добавлена");
            const user = this.$store.getters["auth/user"];
            this.$router.push(`/admin${user.role == "admin" ? "/orders" : ""}`);
          } catch (error) {
            this.loading = false;
            console.log(error);
          }
        } else {
          return false;
        }
      });
    },
    goToForm() {
      this.$router.push(`/admin/organization_form`);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleOrderFileChange(file) {
      let type = file.raw.type;
      const idx = type.search(/png|jpeg|docx|doc|pdf/);
      if (idx == -1) {
        fileList = [];
        this.$message.error("файлы толка с расширением png|jpeg|docx|doc|pdf ");
        return;
      }
      this.ordersForm.inv_file = file;
    },
    handleChange(file, $index) {
      let type = file.raw.type;
      const idx = type.search(/png|jpeg|docx|doc|pdf/);
      if (idx == -1) {
        fileList = [];
        this.$message.error("файлы толка с расширением png|jpeg|docx|doc|pdf ");
        return;
      }
      this.filteredDocuments[$index].file = file.name;
      this.fileList[$index] = file;
    },
    addDocuments() {
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach((d) => {
          this.fileList.push("");
          this.filteredDocuments.push({
            id: d.id,
            number: d.number,
            name: d.name,
            file: "",
          });
        });
        const documentIds = this.multipleSelection.map((p) => p.id);
        this.documents = this.documents.filter(
          (d) => !documentIds.includes(d.id)
        );
        this.visibleDialog = false;
      } else {
        this.$message.info("No data");
      }
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
.table i {
  font-size: 18px;
  cursor: pointer;
  color: #2688cd;
}
.red {
  color: #2688cd;
}
.el-form-item__label {
  text-align: left;
}
</style>
