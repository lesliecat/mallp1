<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log v-if="errorLogs.length>0" class="errLog-container right-menu-item" :logsList="errorLogs"></error-log>

      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <el-dropdown trigger="click" class='international' @command="handleSetLanguage">
        <div>
          <svg-icon class-name='right-menu-item international-icon' icon-class="language" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh" :disabled="language==='zh'">中文</el-dropdown-item>
          <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- <el-tooltip effect="dark" content="换肤" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip> -->

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <span class="user-name">{{name}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ThemePicker from '@/components/ThemePicker'
import Screenfull from '@/components/Screenfull'
import ErrorLog from '@/components/ErrorLog'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ThemePicker,
    ErrorLog,
    Screenfull
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'language', 'errorLogs'])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('toggleSideBar')
    },
    handleSetLanguage (lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang)
      this.$message({
        message: 'switch language success',
        type: 'success'
      })
    },
    logout () {
      // TODO 前端登出
      this.$store.dispatch('LogOut')
      // 清空tag
      this.$store.state.tagsView.visitedViews = []
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 5px;
      vertical-align: top;
    }
    .international {
      vertical-align: top;
      .international-icon {
        font-size: 20px;
        cursor: pointer;
        vertical-align: middle;
      }
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        .user-name {
        }
        .el-icon-caret-bottom {
        }
      }
    }
  }
}
</style>
