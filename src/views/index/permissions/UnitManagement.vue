<template>
  <div class="unitWrapper">
    <div class="title">
      <Title>
        <template #TitleBox>单位管理</template>
      </Title>
    </div>
    <div class="unitContainer">
      <div class="left">
        <div class="enterpriseType">
          <span :class="{'currentEnterpriseType':index==enterpriseTypeNum}" @click='checkedEnterpriseType(index)' v-for="(item,index) in enterpriseTypeList" :key="item">{{item}}</span>
        </div>
        <div class="searchUnit">
          <el-input placeholder="请输入内容" v-model="searchUnit" clearable size="small">
          </el-input>
          <el-button size="mini" type="primary">搜索</el-button>
          <!-- <el-button size="mini" type="primary">新增系统</el-button> -->
          <el-button size="mini" type="primary" @click="dialogUnitFormVisible = true">新增单位</el-button>
          <el-dialog title="新增单位" :visible.sync="dialogUnitFormVisible">
            <el-form :model="unitForm">
              <el-form-item label="单位名称" :label-width="formLabelWidth">
                <el-input v-model="unitForm.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="单位类型" :label-width="formLabelWidth">
                <el-radio v-model="unitForm.factoryType" label="1">政企</el-radio>
                <el-radio v-model="unitForm.factoryType" label="2">维保</el-radio>
                <el-radio v-model="unitForm.factoryType" label="3">伙伴</el-radio>
                <el-radio v-model="unitForm.factoryType" label="4">监管</el-radio>
              </el-form-item>
              <el-form-item label="存在隧道" :label-width="formLabelWidth">
                <el-radio v-model="unitForm.hasImageType" label="1">是</el-radio>
                <el-radio v-model="unitForm.hasImageType" label="2">否</el-radio>
              </el-form-item>
              <el-form-item label="邮 箱" :label-width="formLabelWidth">
                <el-input v-model="unitForm.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" :label-width="formLabelWidth">
                <el-input v-model="unitForm.phone" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="单位简介" :label-width="formLabelWidth">
                <el-input v-model="unitForm.describe" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogUnitFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="sureUnit()">确 定</el-button>
            </div>
          </el-dialog>

        </div>
        <div class="units">
          <div class="unitBox">
            <div class="unit" v-for="(item,index) in unitList" :key="index">
              <div class="unitInfor">
                <p class="unitName">{{item.name}}</p>
                <p class="CreateTime">创建时间：
                  <span>{{item.createTime}}</span>
                </p>
                <p>邮箱：
                  <span>{{item.email}}</span>
                </p>
                <p>描述：
                  <span>{{item.describe}}</span>
                </p>
              </div>
              <!-- <div class="timeLength">
                <span>{{item.timeLength}}</span>
              </div>
              <div class="unitDescribe">
                <span>{{item.discripition}}</span>
              </div> -->
            </div>
          </div>

          <div class="systemPaging">
            <el-pagination background layout="prev, pager, next" :total="unitTotal" :pager-count='unitPagingCount' :page-size='unitNum' :current-page.sync='unitCurrentPage' @current-change='unitCurrentChange'>
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="addArea">
          <el-button type="primary" @click="dialogAreaFormVisible = true">新增区域</el-button>
          <el-dialog title="新增区域" :visible.sync="dialogAreaFormVisible">
            <el-form :model="areaForm">
              <el-form-item label="站点名称" :label-width="formLabelWidth">
                <el-input v-model="areaForm.siteName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="存在监管" :label-width="formLabelWidth">
                <el-radio v-model="areaForm.isManager" label="1">是</el-radio>
                <el-radio v-model="areaForm.isManager" label="2">否</el-radio>
              </el-form-item>
              <el-form-item label="图形" :label-width="formLabelWidth">
                <el-radio v-model="areaForm.imageType" label="1">楼栋图</el-radio>
                <el-radio v-model="areaForm.imageType" label="2">隧道图</el-radio>
              </el-form-item>
              <!-- <el-form-item label="维保单位" :label-width="formLabelWidth">
                <el-input v-model="areaForm.maintenance" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="本地服务器ip" :label-width="formLabelWidth">
                <el-input v-model="areaForm.local" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="监控中心ip" :label-width="formLabelWidth">
                <el-input v-model="areaForm.monitor" autocomplete="off"></el-input>
              </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogAreaFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="sureArea()">确 定</el-button>
            </div>
          </el-dialog>

        </div>
        <div class="areas">
          <div class="areaList">
            <div class="area" v-for="(item,index) in areaList" :key="index">
              <p class="areaName">{{item.siteName}}</p>
              <p>创建时间：{{item.createTime}}</p>
              <p class="operation">
                <el-button type="primary" icon="el-icon-edit" circle size='mini' @click="dialogAreaModifyFormVisible = true"></el-button>
                <el-dialog title="修改区域" :visible.sync="dialogAreaModifyFormVisible">
                  <el-form :model="areaModifyForm">
                    <el-form-item label="业主单位" :label-width="formLabelWidth">
                      <el-input v-model="areaModifyForm.owner" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="区域名称" :label-width="formLabelWidth">
                      <el-input v-model="areaModifyForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="维保单位" :label-width="formLabelWidth">
                      <el-input v-model="areaModifyForm.maintenance" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="本地服务器ip" :label-width="formLabelWidth">
                      <el-input v-model="areaModifyForm.local" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="监控中心ip" :label-width="formLabelWidth">
                      <el-input v-model="areaModifyForm.monitor" autocomplete="off"></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogAreaModifyFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureModifyArea()">确 定</el-button>
                  </div>
                </el-dialog>

                <el-button type="danger" icon="el-icon-delete" circle size='mini' @click="delateArea(item.siteId)"></el-button>
              </p>
            </div>
          </div>
          <div class="areaPaging">
            <el-pagination background layout="prev, pager, next" :total="areaTotal" :pager-count='unitPagingCount' @current-change='changeAreaPage' :page-size='areaCurrentNum' :current-page.sync='areaCurrentPage'>
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../../../components/Title";
import { addFactory } from "@/apis/unit";
import {
  addFactorySite,
  // getListFactorySite,
  deletedFactorySite
} from "@/apis/unitSite";
import { getKey } from "@/utils/local";
// import { getTime } from "@/utils/publictool";
// import { getUserInfor } from "@/apis/user";
import { pageFactory } from "@/apis/unit";
import { pageFactorySite } from "@/apis/unitSite";
export default {
  components: {
    Title
  },
  data() {
    return {
      //企业类型选择
      enterpriseTypeNum: 0,
      enterpriseTypeList: ["政企", "维保", "伙伴", "监管"],
      searchUnit: "", //搜索单位
      unitTotal: 0, //单位分页总数
      unitPagingCount: 5, //单位分页显示页码数
      unitNum: 4,
      unitCurrentPage: 1,
      //控制新增单位
      dialogUnitFormVisible: false,
      formLabelWidth: "100px", //对话框宽
      unitForm: {
        name: "",
        factoryType: "1",
        hasImageType: "1",
        describe: "",
        email: "",
        phone: ""
      },
      unitList: [],
      //新增区域
      dialogAreaFormVisible: false,
      areaForm: {
        imageType: "1", //楼栋图，隧道图
        isManager: "2", //是否存在监管单位
        // localIp:'',// 本地ip
        siteName: "" // 站点名称
        // siteServer: "",//服务器ip
        // system:'',//系统标识
      },
      areaList: [], //区域列表
      areaTotal: 0, //区域分页总数
      areaCurrentNum:9,
      areaCurrentPage:1,
      //修改区域
      dialogAreaModifyFormVisible: false,
      areaModifyForm: {
        name: "",
        type: "",
        describe: "",
        email: "",
        phone: ""
      }
    };
  },
  created() {
      this.unitCurrentChange(this.unitCurrentPage) //分页获取单位
      //分页获取单位站点
      this.changeAreaPage(this.areaCurrentPage)
  },
  methods: {
    //单位分页
    unitCurrentChange(val) {
      val = val <= 0 ? 1 : val;
      pageFactory({
        size: this.unitNum,
        start: val,
        factoryId: getKey("userInfor".factoryId)
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.unitTotal = res.result.countRows;
            this.unitList = res.result.result;
            console.log(res);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //切换企业类型
    checkedEnterpriseType(index) {
      this.enterpriseTypeNum = index;
    },
    //增加单位的确定
    sureUnit() {
      // this.dialogUnitFormVisible = false;
      addFactory(this.unitForm)
        .then(res => {
          if (res.httpStatus == 200) {
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
          // console.log("添加单位成功res", res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 增加区域确定函数
    sureArea() {
      let areaForm = {
        factoryId: getKey("userInfor").factoryId,
        ...this.areaForm
      };
      // this.dialogAreaFormVisible = false;
      addFactorySite(areaForm)
        .then(res => {
          if (res.httpStatus == 200) {
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
          this.$message({
            type: "warning",
            message: "网络请求失败"
          });
        });
      console.log(areaForm);
    },
    //删除区域
    delateArea(siteId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(siteId);
          deletedFactorySite({ siteId })
            .then(res => {
              console.log(res);
              if (res.httpStatus == 200) {
                this.getUnitSites();
                this.$message({
                  type: "success",
                  message: "删除成功!"
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //修改区域
    sureModifyArea() {
      // this.dialogAreaModifyFormVisible = false;
      // console.log(this.areaModifyForm);
    },
    changeAreaPage(val) {
        val = val <= 0 ? 1 : val;
      pageFactorySite({
        size: this.areaCurrentNum,
        start: val,
        factoryId: getKey("factoryId")
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.areaTotal = res.result.countRows;
            this.areaList = res.result.result;
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
      .areas {
        .areaList {
          .area {
            display: inline-block;
            margin: 20px 20px 0 20px;
            padding: 20px 10px 10px 10px;
            width: 210px;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0 2px 2px #888888;
            p {
              line-height: 20px;
            }
            .areaName {
              font-size: 20px;
              line-height: 30px;
            }
            .operation {
              padding: 10px 0;
              display: flex;
              justify-content: flex-end;
            }
          }
        }
        .areaPaging {
          padding: 20px 0;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>