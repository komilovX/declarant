<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': true }">
        <navbar @drawerClick="drawer = true" :value="messageCount" />
      </div>
      <div class="app-main">
        <transition name="fade-transform" mode="out-in">
          <nuxt />
        </transition>
        <message-drawer
          :drawer="drawer"
          @handleClose="drawer = false"
          :messages="messages"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar } from '@/components/LayoutComponents'
import ResizeMixin from '@/mixins/ResizeHandler'
import MessageDrawer from '@/components/MessageDrawer.vue'
export default {
  components: {
    Navbar,
    Sidebar,
    MessageDrawer,
  },
  mixins: [ResizeMixin],
  async mounted() {
    if (this.$store.getters['notification/notifications'].length == 0) {
      await this.$store.dispatch('notification/fetchNotifications')
    }
  },
  data() {
    return {
      drawer: false,
    }
  },
  computed: {
    sidebar() {
      return this.$store.getters['app/sidebar']
    },
    device() {
      return this.$store.getters['app/device']
    },
    fixedHeader() {
      return this.$store.getters['settings/fixedHeader']
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      }
    },
    messages() {
      return this.$store.getters['notification/notifications']
    },
    messageCount() {
      return this.$store.getters['notification/notifications'].filter(
        (m) => !m.watched
      ).length
    },
    error() {
      return this.$store.getters.error
    },
  },
  watch: {
    error(value) {
      console.log('value', value)
      if (value.response.data) {
        this.$message.error(value.response.data.message)
      }
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
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
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
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
<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
