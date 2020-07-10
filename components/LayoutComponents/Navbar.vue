<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu df">
      <div class="avatar-wrapper" @click="$emit('drawerClick')">
        <el-badge :value="!!value ? value : null" class="item">
          <img src="/email.svg" class="el-dropdown-link user-avatar" />
        </el-badge>
      </div>
      <div class="avatar-wrapper" @click="logout">
        <img src="/user.svg" class="user-avatar" />
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  props: ['value'],
  computed: {
    sidebar() {
      return this.$store.getters['app/sidebar']
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    onClick() {
      this.$emit('drawerClick', true)
    },
    logout() {
      this.$confirm('Вы уверены что хотите выйти из система?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        this.$router.push('/login?message=logout')
        this.$store.dispatch('auth/logout')
      })
    },
  },
}
</script>
<style>
.item .el-badge__content.is-fixed {
  top: 18px;
  right: 22px;
}
</style>
<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    // &:focus {
    //   outline: none;
    // }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .avatar-wrapper {
      position: relative;
    }
    .user-avatar {
      cursor: pointer;
      width: 30px;
      height: 30px;
      margin: 0 1rem;
      margin-top: 15px;
    }
    .bell-avatar {
      cursor: pointer;
      width: 30px;
      height: 26px;
      margin: 13px 0.5rem 0 0;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
</style>
