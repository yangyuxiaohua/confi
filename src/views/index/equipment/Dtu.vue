<template>
    <!-- Dtu管理 -->
    <div class="DtuWrapper">
        <div class="title">
            <Title>
                <template #TitleBox>Dtu配置</template>
            </Title>
        </div>
        <div class="dtuContainer">
            <el-button type="primary" class="newConstruction" @click="dialogDtuFormVisible = true">新建</el-button>
            <el-dialog title="新建" :visible.sync="dialogDtuFormVisible">
                <el-form :model="newDtuForm">
                    <el-form-item label="网关序列号" :label-width="formLabelWidth">
                        <el-input v-model="newDtuForm.gatewaySerialnumber" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="网关接入点" :label-width="formLabelWidth">
                        <el-input v-model="newDtuForm.gatewayPort" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" :label-width="formLabelWidth">
                        <el-input v-model="newDtuForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="编码" :label-width="formLabelWidth">
                        <el-input v-model="newDtuForm.code" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" :label-width="formLabelWidth">
                        <el-input v-model="newDtuForm.type" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="位置" :label-width="formLabelWidth">
                        <el-input v-model="newDtuForm.position" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="最小值" :label-width="formLabelWidth">
                        <el-input v-model="newDtuForm.valueMin" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="最大值" :label-width="formLabelWidth">
                        <el-input v-model="newDtuForm.valueMax" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="单位" :label-width="formLabelWidth">
                        <el-input v-model="newDtuForm.valueUnit" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogDtuFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureAddDtu()">提 交</el-button>
                </div>
            </el-dialog>
            <div class="dtuList">
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column prop="gatewaySerialnumber" label="网关序列号" width="100">
                    </el-table-column>
                    <el-table-column prop="gatewayPort" label="网关接入点" width="100">
                    </el-table-column>
                    <el-table-column prop="name" label="名称">
                    </el-table-column>
                    <el-table-column prop="code" label="编码">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="position" label="位置">
                    </el-table-column>
                    <el-table-column prop="valueMin" label="最小值">
                    </el-table-column>
                    <el-table-column prop="valueMax" label="最大值">
                    </el-table-column>
                    <el-table-column prop="valueUnit" label="单位">
                    </el-table-column>
                    <el-table-column width="195">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                            <el-dialog title="修改资源" :visible.sync="dialogmodifyDtuFormVisible">
                                <el-form :model="modifyDtuForm">
                                    <el-form-item label="网关序列号" :label-width="formLabelWidth">
                                        <el-input v-model="modifyDtuForm.gatewaySerialnumber" autocomplete="gatewayPort"></el-input>
                                    </el-form-item>
                                    <el-form-item label="名称" :label-width="formLabelWidth">
                                        <el-input v-model="modifyDtuForm.name" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="编码" :label-width="formLabelWidth">
                                        <el-input v-model="modifyDtuForm.code" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="类型" :label-width="formLabelWidth">
                                        <el-input v-model="modifyDtuForm.type" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="位置" :label-width="formLabelWidth">
                                        <el-input v-model="modifyDtuForm.position" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="最小值" :label-width="formLabelWidth">
                                        <el-input v-model="modifyDtuForm.valueMin" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="最大值" :label-width="formLabelWidth">
                                        <el-input v-model="modifyDtuForm.valueMax" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="单位" :label-width="formLabelWidth">
                                        <el-input v-model="modifyDtuForm.valueUnit" autocomplete="off"></el-input>
                                    </el-form-item>
                                </el-form>
                                <div slot="footer" class="dialog-footer">
                                    <el-button @click="dialogmodifyDtuFormVisible = false">取 消</el-button>
                                    <el-button type="primary" @click="sureModifyDtu()">确 定</el-button>
                                </div>
                            </el-dialog>
                            <el-button @click="handleDelete(scope.$index, scope.row)" class="deleteResource">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import Title from "../../../components/Title";
import { getDtuList, addDtu, modifyDtu, deleteDtu } from "@/apis/dtu";
export default {
  components: {
    Title
  },
  data() {
    return {
      tableData: [
        //dtu数组
        {
          gatewaySerialnumber: "00000001",
          gatewayPort: "2",
          name: "水位",
          code: "KONNAD-255",
          type: "level",
          position: "演示系统",
          valueMin: "0",
          valueMax: "6",
          valueUnit: "m"
        }
      ],
      dialogDtuFormVisible: false, //新建
      dialogmodifyDtuFormVisible: false, //修改
      newDtuForm: {
        gatewaySerialnumber: "",
        gatewayPort: 0,
        name: "",
        code: "",
        type: "",
        position: "",
        valueMin: 0,
        valueMax: 0,
        valueUnit: "",
        deviceId: 1,
        floorId: 1
      },
      formLabelWidth: "150px",
      modifyDtuForm: {
        //修改
        gatewaySerialnumber: "",
        gatewayPort: 0,
        name: "",
        code: "",
        type: "",
        position: "",
        valueMin: 0,
        valueMax: 0,
        valueUnit: ""
      }
    };
  },
  created() {
    // 获取dtu列表
    this.getDtuLists();
  },
  methods: {
    sureAddDtu() {
      //新建提交按钮
      console.log(this.newDtuForm);
      addDtu(this.newDtuForm)
        .then(res => {
          console.log(res);
          if (res.httpStatus == 200) {
              this.dialogDtuFormVisible = false
              this.getDtuLists()
             this.$message({
              type: "success",
              message: "添加成功"
            });
          } else {
            this.$message({
              type: "warning",
              message: "网络请求失败"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    sureModifyDtu() {
      //修改提交按钮
      modifyDtu(this.modifyDtuForm)
        .then(res => {
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.dialogmodifyDtuFormVisible = false;
          } else {
            this.$message({
              type: "warning",
              message: "网络请求失败"
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "warning",
            message: "网络请求失败"
          });
        });
    },
    handleEdit(a, b) {
      //修改按钮
      this.modifyDtuForm = b;
      this.dialogmodifyDtuFormVisible = true;
    },
    handleDelete(a, b) {
      //删除dtu
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDtu()
            .then(res => {
              console.log(a,b,res);
            //   if (res.httpStatus == 200) {
            //     this.getDtuLists();
            //     this.$message({
            //       type: "success",
            //       message: "删除成功!"
            //     });
            //   }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                type: "warning",
                message: "网络请求失败"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 获取dtu列表
    getDtuLists() {
      getDtuList({index:1,size:10})
        .then(res => {
          console.log(res);
          if (res.httpStatus == 200) {
            this.tableData = res.result.result;
          } else {
            this.$message({
              type: "warning",
              message: "网络请求失败"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.DtuWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    width: 100%;
    flex: 0 0 56px;
  }
  .dtuContainer {
    flex: 1;
    width: 100%;
    background-color: #f4f4f4;
    font-size: 14px;
    line-height: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .newConstruction {
      width: 80px;
    }
    .dtuList {
      margin-top: 20px;
      flex: 1;
      .el-button {
        margin-left: 10px;
      }
    }
  }
}
</style>
