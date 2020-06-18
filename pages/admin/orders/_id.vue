<template>
  <div>
    <div class="header df p1 bb mb1">
      <i class="el-icon-arrow-left arrow-back mr1" @click="$router.back()" />
      <h2># {{ $route.params.id }}</h2>
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
                <el-input v-model="ordersForm.client_company" type="text" />
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
            <el-col :span="24" class="mb1 df-sb" style="padding: 1rem;">
              <div>
                <a
                  v-if="order.inv_file"
                  :href="`/uploads/${order.inv_file}`"
                  class="download-url"
                  style="padding: 0.5rem 0.8rem;"
                  target="_blank"
                  >Посмотреть файл</a
                >
                <span v-else>No file</span>
              </div>
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-change="handleOrderFileChange"
              >
                <el-button size="small" type="primary">
                  Изменить файл
                </el-button>
              </el-upload>
            </el-col>
            <el-col>
              <el-form-item id="submit-button">
                <el-button
                  type="success"
                  :loading="loading"
                  @click="submitForm('ordersForm')"
                >
                  Сохранить
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
        <el-col :span="24" :md="12" :sm="24">
          <h3 class="mb1">Входящие документы</h3>
          <el-table :data="incoming_documents">
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
              <template slot-scope="{ row: { file } }">
                <a
                  v-if="file"
                  :href="`/uploads/${file}`"
                  class="download-url"
                  target="_blank"
                  >Посмотреть</a
                >
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
      </el-row>
      <el-dialog title="Загрузить" :visible.sync="fileDialog" width="50%">
        <div class="file-dialog">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
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
  </div>
</template>

<script>
export default {
  middleware: ["admin-auth"],
  async asyncData({ $axios, error, route }) {
    try {
      const { order, incoming_documents } = await $axios.$get(
        `api/orders/${route.params.id}`
      );
      const documents = await $axios.$get("api/document?type=incoming");
      return { order, incoming_documents, documents };
    } catch (e) {
      error(e);
    }
  },
  data: () => ({
    fileDialog: false,
    loading: false,
    loading2: false,
    newFile: null,
    rawId: null,
    orderFile: "",
    ordersForm: {
      date: new Date(),
      container: "",
      client_company: "",
      product: "",
      post_number: "",
      inv: "",
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
  beforeMount() {
    if (this.order.creator_id != this.user.userId) {
      this.$router.push("/404");
    }
  },
  mounted() {
    Object.keys(this.ordersForm).forEach((o) => {
      this.ordersForm[o] = this.order[o];
    });
  },
  validate({ store, route, error }) {
    const { role = null } = store.getters["auth/user"];
    if (role == "admin" || role == "declarant") {
      return true;
    }
    return false;
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
  },
  methods: {
    goToForm() {
      this.$router.push(`/admin/organization_form`);
    },
    handleOrderFileChange(file) {
      let type = file.raw.type;
      const idx = type.search(/png|jpeg|docx|doc|pdf/);
      if (idx == -1) {
        fileList = [];
        this.$message.error("файлы толка с расширением png|jpeg|docx|doc|pdf ");
        return;
      }
      this.orderFile = file;
    },
    handleChange(file, raw) {
      let type = file.raw.type;
      const idx = type.search(/png|jpeg|docx|doc|pdf/);
      if (idx == -1) {
        fileList = [];
        this.$message.error("файлы толка с расширением png|jpeg|docx|doc|pdf ");
        return;
      }
      this.newFile = file;
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
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
          console.log("this.ordersForm", this.ordersForm);
          fd.append("date", date);
          fd.append("client_company", client_company);
          fd.append("container", container);
          fd.append("product", product);
          fd.append("post_number", post_number);
          fd.append("inv", inv);
          fd.append("inv_price", inv_price);
          if (this.orderFile) {
            fd.append("file", this.orderFile.raw, this.orderFile.name);
          }
          this.loading = true;
          try {
            await this.$axios.$put(`api/orders/${this.$route.params.id}`, fd);
            this.loading = false;
            this.$message.success("заявка успешна обнавлена");
            await this.$router.push("/admin/orders");
          } catch (error) {
            this.loading = false;
            console.log(error);
          }
        } else {
          return false;
        }
      });
    },
    async updateFile() {
      if (!this.newFile) {
        this.$message.error("Файл не выбран");
        return;
      }
      try {
        this.loading2 = true;
        const fd = new FormData();
        fd.append("file", this.newFile.raw, this.newFile.name);
        const newDocument = await this.$axios.$put(
          `api/orders/${this.rawId}/file`,
          fd
        );
        const document = this.incoming_documents.find(
          (d) => d.id == this.rawId
        );
        document.file = newDocument.file;
        this.rawId = null;
        this.newFile = null;
        this.loading2 = false;
        this.fileDialog = false;
      } catch (e) {
        this.loading2 = false;
        console.log(e);
      }
    },
    openDialog(id) {
      this.rawId = id;
      this.fileDialog = true;
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
.download-url {
  display: inline-block;
  padding: 0.2rem 0.8rem;
  background: #555;
  color: #f1f1f1;
  border-radius: 2px;
  &:hover {
    background: #444;
    color: #fff;
  }
}
.file-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
