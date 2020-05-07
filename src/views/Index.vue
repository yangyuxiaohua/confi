<template>
  <div class="wrapper">
    <div class="nav">
      <div class="logo">
        <div class="logoImg"><img src="../assets/imgs/configurations.png" alt=""></div>
        <h2>配置中心</h2>
      </div>

      <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" background-color="#2d323e" text-color="#fff" active-text-color="#409EFF" @select='activeMenu' unique-opened router>
        <el-submenu v-for="item in list" :index="item.text" :key="item.text">
          <template slot="title">
            <i :class="item.class"></i>
            <span>{{item.text}}</span>
          </template>
          <el-menu-item-group v-for="i in item.submenu" :key="i.name">
            <el-menu-item :index="i.path">{{i.name}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>

    </div>
    <div class="container">
      <div class="containerTop">
        <div class="userInfor">
          <img src="../assets/logo.png" alt="" class="avatar">
          <span class="userName">{{userName}}</span>
          <div>
            <i class="el-icon-arrow-down" @click="showUser()" v-show="showUserInfor"></i>
            <i class="el-icon-arrow-up" @click="hideUser()" v-show="hideUserInfor"></i>
            <div class="userBox" v-show="hideUserInfor">

            </div>
          </div>

        </div>
      </div>
      <div class="containerWrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { getKey } from "@/utils/local";
export default {
  data() {
    return {
      list: [
        {
          id: 1,
          class: "el-icon-eleme",
          text: "设备管理",
          submenu: [
            { name: "设备管理", path: "/index/equipment/equipmentManagement" },
            { name: "Dtu管理", path: "/index/equipment/dtu" }
          ]
        },
        {
          id: 2,
          class: "el-icon-goods",
          text: "地图配置",
          submenu: [
            { name: "编辑区域", path: "/index/map/editArea" },
            { name: "编辑图标", path: "/index/map/editIcon" },
            { name: "区域列表", path: "/index/map/areaList" }
          ]
        },
        {
          id: 3,
          class: "el-icon-help",
          text: "权限配置",
          submenu: [
            { name: "用户管理", path: "/index/permissions/userManagement" },
            { name: "资源管理", path: "/index/permissions/resourceManagement" },
            { name: "角色管理", path: "/index/permissions/RoleManagement" },
            { name: "单位管理", path: "/index/permissions/unitManagement" },
            {
              name: "角色模板",
              path: "/index/permissions/roleTemplate"
            }
          ]
        },
        {
          id: 4,
          class: "el-icon-picture-outline",
          text: "图层配置",
          submenu: [
            { name: "配置物联网", path: "/index/layer/internetConfiguration" },
            { name: "配置图层", path: "/index/layer/layerConfiguration" }
          ]
        },
        {
          id: 5,
          class: "el-icon-camera",
          text: "字典表",
          submenu: [{ name: "字典表", path: "/index/dictionary/dictionary" }]
        }
      ],
      defaultActive: "/index/equipment/equipmentManagement",
      showUserInfor: true, //显示隐藏个人信息栏
      hideUserInfor: false,
      userName: "请登录"
    };
  },
  created() {
    //刷新之后默认打开菜单
    this.defaultActive = this.$route.path;
  },
  mounted(){
    this.userName = getKey("userInfor").username;

  },
  computed: {},
  methods: {
    activeMenu(index) {
      console.log(index);
    },
    showUser() {
      this.showUserInfor = false;
      this.hideUserInfor = true;
    },
    hideUser() {
      this.showUserInfor = true;
      this.hideUserInfor = false;
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  .nav {
    height: 100%;
    overflow-y: auto;
    flex: 0 0 286px;
    background-color: #2d323e;
    .logo {
      height: 46px;
      display: flex;
      .logoImg {
        flex: 0 0 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 20px;
          height: 20px;
        }
      }
      h2 {
        flex: 1;
        line-height: 46px;
        color: #fff;
      }
    }
    .el-menu {
      border: none;
    }
  }
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    .containerTop {
      flex: 0 0 46px;
      padding-right: 20px;
      display: flex;
      justify-content: flex-end;
      .userInfor {
        display: flex;
        align-items: center;
        position: relative;
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 32px;
          background-color: #2d323e;
        }
        .userName {
          margin: 0 15px 0 5px;
          line-height: 46px;
        }
        .userBox {
          width: 200px;
          height: 200px;
          border: 1px solid red;
          position: absolute;
          left: 0;
          top: 40px;
        }
      }
    }
    .containerWrapper {
      width: 100%;
      flex: 1;
      overflow-y: auto;
    }
  }
}
</style>