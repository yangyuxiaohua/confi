<template>
  <div class="roleTemplateWrapper">
    <div class="title">
      <Title>
        <template #TitleBox>角色模板</template>
      </Title>
    </div>
    <div class="roleType">
      <LinePressing>
        <template #line>角色</template>
        <template #container>
          <div class="role">
            <div class="roleContainer">
              <span v-for="(item,index) in roleList" :key="index" :class="{'checkedRole' : index===currentProjectRole}" @click="checkedRole(index)">{{item}}</span>

              <el-button size="mini" type="primary" @click="dialogRoleFormVisible = true">+</el-button>
              <el-dialog title="新增角色模板" :visible.sync="dialogRoleFormVisible">
                <el-form :model="roleForm">
                  <el-form-item label="公司类型" :label-width="formLabelWidth">
                    <el-radio v-model="roleForm.radio" label="1">政企</el-radio>
                    <el-radio v-model="roleForm.radio" label="2">维保</el-radio>
                    <el-radio v-model="roleForm.radio" label="3">伙伴</el-radio>
                    <el-radio v-model="roleForm.radio" label="4">监管</el-radio>
                  </el-form-item>
                  <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="roleForm.name" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="角色标识" :label-width="formLabelWidth">
                    <el-input v-model="roleForm.logo" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogRoleFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="sureRole()">确 定</el-button>
                </div>
              </el-dialog>

            </div>
          </div>
        </template>
      </LinePressing>
    </div>
    <div class="roleTemplateContainer">
      <div class="left">
        <p class="warningSystem">预警系统</p>
        <el-tree :data="warningData" show-checkbox node-key="id" :default-expanded-keys="[1]" :props="warningDefaultProps" ref='warningTree'>
        </el-tree>
        <el-button type="primary" @click="submit()">提交</el-button>
      </div>
      <div class="right">
        <p class="maintenanceSystem">维保系统</p>
        <el-tree :data="maintenanceData" show-checkbox node-key="id" :default-expanded-keys="[1]" :props="maintenanceDefaultProps" ref='maintenanceTree'>
        </el-tree>
        <el-button type="primary">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../../../components/Title";
import LinePressing from "../../../components/LinePressing";
export default {
  components: {
    Title,
    LinePressing
  },
  data() {
    return {
      roleList: ["项目经理", "负责人", "法人"], //项目角色
      currentProjectRole: 0,
      //左边树形数据
      warningData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      warningDefaultProps: {
        children: "children",
        label: "label"
      },
      //右边树形数据
      maintenanceData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      maintenanceDefaultProps: {
        children: "children",
        label: "label"
      },
      dialogRoleFormVisible: false,
      formLabelWidth: "100px",
      roleForm: {
        radio: "",
        name: "",
        logo: ""
      }
    };
  },
  methods: {
    //控制选中的企业类型
    checkedRole(index) {
      this.currentProjectRole = index;
    },
    // 增加企业类型
    addRole() {
      console.log(this.roleList);
    },
    //获取当前tree返回的数据
    submit() {
      console.log(this.$refs.warningTree.getCheckedNodes());
    },
    //增加角色模板
    sureRole() {
      console.log(this.roleForm);
      this.dialogRoleFormVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.roleTemplateWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4;
  .title {
    width: 100%;
    // flex: 0 0 56px;
  }
  .roleType {
    // flex: 0 0 50px;
    padding: 20px 20px;
    .role {
      .roleContainer {
        span {
          cursor: pointer;
          display: inline-block;
          padding: 5px 10px;
          margin: 0 5px;
          border: 1px solid #e7e7e7;
          border-radius: 5px; 
        }
        .el-button {
          margin-left: 5px;
        }
        .checkedRole {
          border: 1px solid #409eff;
        }
      }
    }
  }
  .roleTemplateContainer {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    padding: 20px 20px 0 20px;
    background-color: #f4f4f4;
    display: flex;
    justify-content: space-between;
    .left {
      width: 48%;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid #e7e7e7;
      .el-tree {
        width: 70%;
        height: 70%;
      }
      .warningSystem {
        font-size: 18px;
        line-height: 50px;
      }
      .el-button {
        margin-top: 20px;
      }
    }
    .right {
      width: 48%;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid #e7e7e7;
      .el-tree {
        width: 70%;
        height: 70%;
      }
      .maintenanceSystem {
        font-size: 18px;
        line-height: 50px;
      }
      .el-button {
        margin-top: 20px;
      }
    }
  }
}
</style>