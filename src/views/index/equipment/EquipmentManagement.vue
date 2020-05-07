<template>
  <!-- <h1>设备管理</h1> -->
  <div class="unitWrapper">
    <div class="title">
      <Title>
        <template #TitleBox>设备管理</template>
      </Title>
    </div>
    <div class="unitContainer">
      <div class="left">
        <div class="searchUnit">
          <el-input placeholder="请输入内容" v-model="searchUnit" clearable size="small">
          </el-input>
          <el-button size="mini" type="primary">搜索</el-button>
        </div>
        <div class="units">
          <div class="unitBox">
            <div class="unit" v-for="(item,index) in unitList" :key="index">
              <div class="unitInfor">
                <span class="unitName">{{item.siteName}}</span>
                <span class="CreateTime">创建时间：
                  <span>{{item.createTime}}</span>
                </span>
              </div>
              <div class="timeLength">
                <span>使用时限：{{item.timeLength}}</span>
              </div>
              <div class="unitDescribe">
                <span>项目描述：{{item.discripition}}</span>
              </div>
            </div>
          </div>

          <div class="systemPaging">
            <el-pagination background layout="prev, pager, next" :total="unitSitePagingCount" :pager-count='unitSitePagingCount' :page-size='unitSiteNum' :current-page.sync='unitSiteCurrentPage' @current-change='unitSiteCurrentChange'>
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="addEquip">
          <el-button type="primary">批量导入</el-button>
          <el-button type="primary" @click="dialogEquipFormAddVisible = true">增加设备</el-button>
          <el-dialog title="增加设备" :visible.sync="dialogEquipFormAddVisible">
            <el-form :model="addEquipmentForm">
              <el-form-item label="设备名称" :label-width="formLabelWidth">
                <el-input v-model="addEquipmentForm.deviceName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="型号" :label-width="formLabelWidth">
                <el-input v-model="addEquipmentForm.model" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="厂商" :label-width="formLabelWidth">
                <el-input v-model="addEquipmentForm.madeFactory" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="位置" :label-width="formLabelWidth">
                <el-input v-model="addEquipmentForm.position" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="生产时间" :label-width="formLabelWidth">
                <el-input v-model="addEquipmentForm.madeDate" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="mac" :label-width="formLabelWidth">
                <el-input v-model="addEquipmentForm.mac" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogEquipFormAddVisible = false">取 消</el-button>
              <el-button type="primary" @click="sureAddEquip()">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <div class="equipments">
          <el-table :data="equipmentTableData" stripe style="width: 100%">
            <el-table-column prop="deviceName" label="设备名称" width='100' align="center">
            </el-table-column>
            <el-table-column prop="model" label="型号" width='100' align="center">
            </el-table-column>
            <el-table-column prop="madeFactory" label="厂商" align="center">
            </el-table-column>
            <el-table-column prop="position" label="位置" align="center">
            </el-table-column>
            <el-table-column prop="madeDate" label="生产时间" align="center">
            </el-table-column>
            <el-table-column prop="mac" label="mac" align="center">
            </el-table-column>
            <el-table-column prop="address" label="操作" width='110' align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <el-dialog title="修改设备" :visible.sync="dialogEquipFormModifyVisible">
                  <el-form :model="modifyEquipmentForm">
                    <el-form-item label="设备名称" :label-width="formLabelWidth">
                      <el-input v-model="modifyEquipmentForm.deviceName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="型号" :label-width="formLabelWidth">
                      <el-input v-model="modifyEquipmentForm.model" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="厂商" :label-width="formLabelWidth">
                      <el-input v-model="modifyEquipmentForm.madeFactory" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="位置" :label-width="formLabelWidth">
                      <el-input v-model="modifyEquipmentForm.position" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="生产时间" :label-width="formLabelWidth">
                      <el-input v-model="modifyEquipmentForm.madeDate" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="mac" :label-width="formLabelWidth">
                      <el-input v-model="modifyEquipmentForm.mac" autocomplete="off"></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogEquipFormModifyVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureModifyEquip()">确 定</el-button>
                  </div>
                </el-dialog>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>

            </el-table-column>
          </el-table>
        </div>
        <div class="equipPaging">
          <el-pagination background layout="prev, pager, next" :total="equipListTotal" :pager-count="pageCount" :page-size='equipCurrentNum' :current-page.sync='equipCurrentPage' @current-change='equipCurrentChange'>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../../../components/Title";
import { pageDevices } from "@/apis/equipment";
import { pageFactorySite } from "@/apis/unitSite";
import { getKey } from "@/utils/local";
export default {
  components: {
    Title
  },
  data() {
    return {
      formLabelWidth: "100px",
      searchUnit: "", //搜索单位
      unitSiteTotal: 0, //单位分页总数
      unitSitePagingCount: 5, //单位分页显示页码数
      unitSiteCurrentPage: 1, //当前页
      unitSiteNum: 5, //每页显示条数
      //控制新增单位
      unitList: [],
      //设备数据
      dialogEquipFormAddVisible: false, // 增加对话框
      equipmentTableData: [], //设备数组
      dialogEquipFormModifyVisible: false, //修改的对话框
      addEquipmentForm: {}, // 增加的对象
      modifyEquipmentForm: {}, // 修改的对象
      equipCurrentPage: 1, //当前页
      equipCurrentNum: 10, //每页显示条数
      pageCount: 5, // 按钮数
      equipListTotal: 0 //总条数
    };
  },
  created() {
    this.equipCurrentChange(this.equipCurrentPage);
     this.unitSiteCurrentChange(this.unitSiteCurrentPage)
  },
  methods: {
    // 单位站点分页
    unitSiteCurrentChange(val) {
      val = val <= 0 ? 1 : val;
      pageFactorySite({
        size: this.unitSiteNum,
        start: val,
        factoryId: getKey("userInfor".factoryId)
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.unitSiteTotal = res.result.countRows;
            this.unitList = res.result.result;
            console.log(res);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //确定增加
    sureAddEquip() {
      console.log(this.addEquipmentForm);
    },
    //   修改
    handleEdit(a, b) {
      console.log(a, b);
      this.dialogEquipFormModifyVisible = true;
    },
    // 确定修改
    sureModifyEquip() {},
    //    删除
    handleDelete(a, b) {
      console.log(a, b);
      this.$confirm("确定删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {})
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //设备分页
    equipCurrentChange(val) {
      val = val <= 0 ? 1 : val;
      pageDevices({ size: this.equipCurrentNum, start: val })
        .then(res => {
          if (res.httpStatus == 200) {
            this.equipListTotal = res.result.countRows;
            this.equipmentTableData = res.result.result;
            console.log(res);
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
.unitWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    width: 100%;
    flex: 0 0 56px;
  }
  .unitContainer {
    flex: 1;
    width: 100%;
    background-color: #f4f4f4;
    display: flex;
    font-size: 14px;
    line-height: 20px;
    .left {
      .enterpriseType {
        margin: 20px 0 0 0;
        span {
          display: inline-block;
          padding: 0 15px;
          margin: 0 5px;
          background-color: #fff;
          line-height: 40px;
          height: 40px;
        }
        .currentEnterpriseType {
          background-color: #409eff;
        }
      }
      flex: 0 0 370px;
      padding: 0 10px;
      border: 1px solid #e7e7e7;
      .searchUnit {
        margin: 20px 0;
        .el-input {
          width: 143px;
        }
        .el-button {
          margin-left: 10px;
        }
        .el-dialog {
          .el-input {
            width: 80%;
          }
        }
      }
      .units {
        .unitBox {
          .unit {
            margin-top: 20px;
            box-sizing: border-box;
            background-color: #fff;
            padding: 30px 10px 10px 10px;
            .unitInfor {
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }
      .systemPaging {
        margin-top: 20px;
      }
    }
    .right {
      flex: 1;
      padding: 20px 10px;
      box-sizing: border-box;
      position: relative;
      .addEquip {
        padding: 0 0 0 20px;
      }
      .equipments {
        margin-top: 13px;
        .el-button {
          padding: 5px;
          margin-left: 5px;
        }
        .el-select {
          width: 100%;
        }
      }
      .equipPaging {
        width: 100%;
        position: absolute;
        bottom: 10px;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
