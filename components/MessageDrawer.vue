<template>
  <el-drawer
    title="Уведомления"
    :visible.sync="drawer"
    direction="rtl"
    :before-close="handleClose"
  >
    <div class="container">
      <div
        class="message-card mb1"
        v-for="v in messages"
        :key="v.id"
        :class="{ greyBorder: v.watched == 1 }"
      >
        <div class="header df-sb mb05">
          <span>{{ new Date(v.createdAt).toLocaleDateString('ru-RU') }}</span>
          <i class="el-icon-delete-solid" @click="removeMessageById(v.id)" />
        </div>
        {{ v.content }}
      </div>
    </div>
  </el-drawer>
</template>
<script>
export default {
  props: {
    drawer: false,
    messages: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    async handleClose() {
      this.$emit('handleClose')
      const needUpdata =
        this.messages.length && this.messages.find((m) => !m.watched)
      if (needUpdata) {
        try {
          await this.$store.dispatch('notification/changeToWatched')
        } catch (e) {
          console.log(e)
        }
      }
    },
    async removeMessageById(id) {
      try {
        await this.$store.dispatch('notification/deleteNotification', id)
        this.$message.success('Cобщения успешна удалена')
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
<style>
.el-drawer__body {
  overflow-y: auto;
}
</style>
<style scoped>
.container {
  padding: 8px;
}
.message-card {
  padding: 8px;
  height: 100px;
  overflow-y: auto;
  border-radius: 5px;
  border: 2px solid #60db23;
}
.greyBorder {
  border: 2px solid #adb6a9;
}
.message-card .header i {
  color: #f56c6c;
  cursor: pointer;
}
.message-card .header span {
  color: #888;
}
</style>
