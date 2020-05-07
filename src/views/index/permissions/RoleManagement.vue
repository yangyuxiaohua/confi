<template>
  <div class="roleWrapper">
    <div class="title">
      <Title>
        <template #TitleBox>角色管理</template>
      </Title>
    </div>
    <div class="roleContainer">
      <div class="search">
        <div class="enterpriseType">
          <span :class="{'currentEnterpriseType':index==enterpriseTypeNum}" @click='checkedEnterpriseType(index)' v-for="(item,index) in enterpriseTypeList" :key="item">{{item}}</span>
        </div>
        <div class="searchRole">
          <el-input placeholder="搜索角色" prefix-icon="el-icon-search" v-model="roleInput">
          </el-input>
          <el-button type="primary" size="small">搜索</el-button>
        </div>
        <div class="addRole">
          <el-button type="primary" size="small" @click="dialogRoleFormVisible = true">新增角色</el-button>
          <el-dialog title="新增资源" :visible.sync="dialogRoleFormVisible">
            <el-form :model="roleForm">
             
              <el-form-item label="单位名称" :label-width="formLabelWidth">
                <el-input v-model="roleForm.untilName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="角色名称" :label-width="formLabelWidth">
                <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="继承角色" :label-width="formLabelWidth">
                <el-input v-model="roleForm.inheritance" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogRoleFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="sureRole()">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
      <div class="roleList">
        <div class="role">
          <p class="roleName">单位名称：
            <span></span>
          </p>
          <p class="roleName">单位类型：
            <span></span>
          </p>
          <p class="roleName">使用年限：
            <span></span>
          </p>
          <p class="roleName">单位简介：
            <span></span>
          </p>
        </div>
        <div class="role">
          <p class="roleName">单位名称：
            <span></span>
          </p>
          <p class="roleName">单位类型：
            <span></span>
          </p>
          <p class="roleName">使用年限：
            <span></span>
          </p>
          <p class="roleName">单位简介：
            <span></span>
          </p>
        </div>
        <div class="role">
          <p class="roleName">单位名称：
            <span></span>
          </p>
          <p class="roleName">单位类型：
            <span></span>
          </p>
          <p class="roleName">使用年限：
            <span></span>
          </p>
          <p class="roleName">单位简介：
            <span></span>
          </p>
        </div>
        <div class="role">
          <p class="roleName">单位名称：
            <span></span>
          </p>
          <p class="roleName">单位类型：
            <span></span>
          </p>
          <p class="roleName">使用年限：
            <span></span>
          </p>
          <p class="roleName">单位简介：
            <span></span>
          </p>
        </div>
        <div class="role">
          <p class="roleName">单位名称：
            <span></span>
          </p>
          <p class="roleName">单位类型：
            <span></span>
          </p>
          <p class="roleName">使用年限：
            <span></span>
          </p>
          <p class="roleName">单位简介：
            <span></span>
          </p>
        </div>
        <div class="role">
          <p class="roleName">单位名称：
            <span></span>
          </p>
          <p class="roleName">单位类型：
            <span></span>
          </p>
          <p class="roleName">使用年限：
            <span></span>
          </p>
          <p class="roleName">单位简介：
            <span></span>
          </p>
        </div>
        <div class="role">
          <p class="roleName">单位名称：
            <span></span>
          </p>
          <p class="roleName">单位类型：
            <span></span>
          </p>
          <p class="roleName">使用年限：
            <span></span>
          </p>
          <p class="roleName">单位简介：
            <span></span>
          </p>
        </div>
      </div>
      <div class="rolePaging">
        <el-pagination background layout="prev, pager, next" :total="projectTotal" :pager-count='projectPagingCount'>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../../../components/Title";
export default {
  components: {
    Title
  },
  data() {
    return {
      enterpriseTypeList: ["政企", "维保", "伙伴", "监管"], //企业类型列表
      enterpriseTypeNum: 0, //控制选中的企业类型
      roleInput: "", //搜索角色
      projectTotal: 90, //总条数
      projectPagingCount: 5, //显示的页码数
      //增加资源对话框
      dialogRoleFormVisible: false,
      formLabelWidth:"100px",
      roleForm: {
        untilName: "",
        roleName: "",
        inheritance: ""
      }
    };
  },
  methods: {
    checkedEnterpriseType(index) {
      //选择企业类型
      this.enterpriseTypeNum = index;
    },
    // 增加资源确定函数
    sureRole() {
      this.dialogRoleFormVisible = false;
      console.log(this.roleForm);
     
    }
  }
};
</script>

<style lang="less" scoped>
.roleWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .title {
    width: 100%;
    flex: 0 0 56px;
  }
  .roleContainer {
    flex: 1;
    width: 100%;
    background-color: #f4f4f4;
    font-size: 14px;
    line-height: 20px;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
    .search {
      height: 50px;
      border: 1px solid #e7e7e7;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .enterpriseType {
        span {
          cursor: pointer;
          display: inline-block;
          padding: 0 15px;
          margin: 0 5px;
          background-color: #fff;
          line-height: 40px;
          height: 40px;
          border-radius: 5px;
        }
        .currentEnterpriseType {
          background-color: #409eff;
        }
      }
      .searchRole {
        display: flex;
        .el-button {
          height: 40px;
          margin-left: 10px;
        }
      }
      .addRole {
        margin-right: 10px;
      }
    }
    .roleList {
      flex: 1;
      padding: 20px;
      border: 1px solid #e7e7e7;
      margin-top: 10px;
      .role {
        display: inline-block;
        background-color: #fff;
        margin: 20px 0 0 20px;
        width: 280px;
        padding: 20px;
      }
    }
    .rolePaging {
      width: 100%;
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: 20px;
      left: 0;
    }
  }
}
</style>
