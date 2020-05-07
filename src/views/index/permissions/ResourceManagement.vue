<template>
    <div class="resourceWrapper">
        <div class="title">
            <Title>
                <template #TitleBox>资源管理</template>
            </Title>
        </div>
        <div class="resourceContainer">
            <div class="left">
                <div class="searchSystem">
                    <el-input placeholder="请输入内容" v-model="searchSystem" clearable size="small">
                    </el-input>
                    <el-button size="mini" type="primary">搜索</el-button>
                    <!-- <el-button size="mini" type="primary">新增系统</el-button> -->
                    <el-button size="mini" type="primary" @click="dialogSystemFormVisible = true">新增系统</el-button>
                    <el-dialog title="新增系统" :visible.sync="dialogSystemFormVisible">
                        <el-form :model="systemForm">
                            <el-form-item label="系统名称" :label-width="formLabelWidth">
                                <el-input v-model="systemForm.name" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="系统标识" :label-width="formLabelWidth">
                                <el-input v-model="systemForm.logo" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogSystemFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="sureSystem()">确 定</el-button>
                        </div>
                    </el-dialog>

                </div>
                <div class="systems">
                    <div class="systemInfor" v-for="(item,index) in roleList" :key="index">
                        <div class="system">
                            <span class="systemName">{{item.roleName}}</span>
                            <span>创建时间：
                                <span>{{item.createTime}}</span>
                            </span>
                        </div>
                    </div>
                    <div class="systemPaging">
                        <el-pagination background layout="prev, pager, next" :total="roleTotal" :pager-count="pageCount" :page-size='roleCurrentNum' :current-page.sync='roleCurrentPage' @current-change='roleCurrentChange'>
                        </el-pagination>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="addResource">
                    <el-button size="mini" type="primary" @click="dialogResourceFormVisible = true">添加资源</el-button>
                    <el-dialog title="新增资源" :visible.sync="dialogResourceFormVisible">
                        <el-form :model="resourceForm">
                            <el-form-item label="系统" :label-width="formLabelWidth">
                                <el-select v-model="resourceForm.system" placeholder="请选择系统">
                                    <el-option label="预警系统" value="1"></el-option>
                                    <el-option label="平台系统" value="50"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="资源名称" :label-width="formLabelWidth">
                                <el-input v-model="resourceForm.name" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="url地址" :label-width="formLabelWidth">
                                <el-input v-model="resourceForm.url" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="排序" :label-width="formLabelWidth">
                                <el-input v-model="resourceForm.sort" autocomplete="off" readonly></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogResourceFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="sureResource()">确 定</el-button>
                        </div>
                    </el-dialog>
                </div>
                <div class="tableWrapper">
                    <el-table :data="tableData" stripe style="width: 100%">
                        <el-table-column prop="system" label="系统" width="100">
                        </el-table-column>
                        <el-table-column prop="name" label="资源名称" width="200">
                        </el-table-column>
                        <el-table-column prop="url" label="url地址">
                        </el-table-column>
                        <el-table-column prop="icon" label="图标" width="100">
                        </el-table-column>
                        <el-table-column prop="address" label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                                <el-dialog title="修改资源" :visible.sync="dialogResourceFormModifyVisible">
                                    <el-form :model="resourceModifyForm">
                                        <el-form-item label="系统" :label-width="formLabelWidth">
                                            <el-select v-model="resourceModifyForm.system" placeholder="请选择系统">
                                                <el-option value="1" label="预警系统"></el-option>
                                                <el-option value="50" label="平台系统"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="资源名称" :label-width="formLabelWidth">
                                            <el-input v-model="resourceModifyForm.name" autocomplete="off"></el-input>
                                        </el-form-item>
                                        <el-form-item label="url地址" :label-width="formLabelWidth">
                                            <el-input v-model="resourceModifyForm.url" autocomplete="off"></el-input>
                                        </el-form-item>
                                        <el-form-item label="图标" :label-width="formLabelWidth">
                                            <el-input v-model="resourceModifyForm.icon" autocomplete="off"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click="dialogResourceFormModifyVisible = false">取 消</el-button>
                                        <el-button type="primary" @click="sureModify()">确 定</el-button>
                                    </div>
                                </el-dialog>
                                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" class="deleteResource">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Title from "../../../components/Title";
import {
  addResource,
  getResource,
  deleteResource,
  modifyResource
} from "@/apis/resource";
import { listPublicRoleIncludeUnable } from "@/apis/role";
import { getKey } from "@/utils/local";
import { Message } from "element-ui";
export default {
  components: {
    Title
  },
  data() {
    return {
      searchSystem: "",
      roleTotal: 0,
      pageCount: 5,
      roleCurrentNum: 5,
      roleCurrentPage: 1,
      roleList: [], //显示的角色数组
      rolePageList: [], //总数
      tableData: [], //资源列表
      //增加系统对话框
      systemForm: {
        name: "",
        logo: ""
      },
      dialogSystemFormVisible: false,
      formLabelWidth: " px",
      //增加资源对话框
      dialogResourceFormVisible: false,
      resourceForm: {
        system: "", //下拉框value
        name: "",
        sort: "1",
        url: ""
      },
      //修改资源对话框
      dialogResourceFormModifyVisible: false,
      resourceModifyForm: {
        system: "",
        name: "",
        url: "",
        icon: ""
      },
      currentId: "" //当前修改的resourceId
    };
  },
  created() {
    //初始化获取资源列表
    this.getResourceList(1);
    // this.getRoleList()
    this.roleCurrentChange(this.roleCurrentPage)
  },
  methods: {
    //角色分页
    roleCurrentChange(val) {
      val = val <= 0 ? 1 : val;
      console.log(val);
      listPublicRoleIncludeUnable({
        system: getKey("userInfor".system)
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.roleTotal = res.result.length;
            console.log(this.roleTotal)
            this.roleList = res.result.slice(this.roleCurrentNum*(val-1),this.roleCurrentNum*val)
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //资源表格修改操作按钮
    handleEdit(a, b) {
      this.dialogResourceFormModifyVisible =
        this.dialogResourceFormModifyVisible == false ? true : false;
      this.currentId = b.id;
    },
    //确定修改资源
    sureModify() {
      console.log(this.resourceModifyForm);
      this.dialogResourceFormModifyVisible = false;
      console.log(this.currentId);
      //   console.log(modifyResource)
      modifyResource({ resourceId: this.currentId })
        .then(res => {
          if (res.httpStatus) {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          } else {
            this.$message({
              type: "warning",
              message: "修改失败!"
            });
          }
          console.log(res);
        })
        .catch(err => {
          {
            console.log(err);
            Message.error("修改失败");
          }
        });
    },
    //确定删除函数
    handleDelete(a, b) {
      this.$confirm("此操作将永久删除该资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteResource({ resourceId: b.id })
            .then(res => {
              if (res.httpStatus === 200) {
                this.tableData.splice(a, 1);
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                Message.error("网络请求发生错误，请稍后再试");
              }
            })
            .catch(err => {
              console.log(err);
              Message.error("网络请求发生错误，请稍后再试");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //增加系统确定函数
    sureSystem() {
      this.dialogSystemFormVisible = false;
      console.log(this.form);
    },
    // 增加资源确定函数
    sureResource() {
      this.dialogResourceFormVisible = false;
      console.log(this.resourceForm);
      if (this.resourceForm.name === "") {
        Message.error("请填写资源名称");
      } else if (this.resourceForm.url === "") {
        Message.error("请填写url地址");
      } else if (this.resourceForm.sort === "") {
        Message.error("请选择系统");
      } else {
        addResource(this.resourceForm)
          .then(res => {
            console.log(res);
            if (res.httpStatus === 200) {
              this.getResourceList(1);
              Message({
                type: "success",
                message: "添加成功!"
              });
            } else {
              Message.error("网络请求发生错误，请稍后再试");
            }
          })
          .catch(err => {
            console.log(err);
            Message.error("添加失败");
          });
      }
    },
    //获取资源列表函数
    getResourceList(system) {
      getResource({ system: system })
        .then(res => {
          if (res.httpStatus === 200) {
            let resourceList = res.result;
            // console.log(resourceList);
            this.tableData = resourceList.map(item => {
              return {
                id: item.resourceId,
                system: item.system == "1" ? "预警系统" : "平台系统",
                name: item.name,
                icon: item.icon,
                url: item.url
              };
            });
          } else {
            Message.error("网络请求发生错误，请稍后再试");
          }
        //   console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.resourceWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    width: 100%;
    flex: 0 0 56px;
  }
  .resourceContainer {
    flex: 1;
    width: 100%;
    background-color: #f4f4f4;
    display: flex;
    font-size: 14px;
    line-height: 20px;
    .left {
      flex: 0 0 370px;
      padding: 0 10px;
      border: 1px solid #e7e7e7;
      .searchSystem {
        margin: 20px 0;
        .el-input {
          width: 143px;
        }
        .el-button {
          margin-left: 10px;
        }
      }
      .systems {
        .systemInfor {
          margin-top: 20px;
          box-sizing: border-box;
          background-color: #fff;
          padding: 30px 10px 10px 10px;
          .system {
            display: flex;
            justify-content: space-between;
            .systemName {
              font-size: 18px;
            }
          }
        }
        .systemPaging {
          margin-top: 20px;
          display: flex;
          .el-pagination {
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
    .right {
      flex: 1;
      padding: 20px 10px;
      box-sizing: border-box;
      .addResource {
        width: 100%;
        height: 52px;
        display: flex;
        align-items: center;
      }
      .tableWrapper {
        width: 100%;
        .el-table__header {
          padding: 0 !important;
        }
        .cell {
          text-align: center;
        }
        .el-button {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>