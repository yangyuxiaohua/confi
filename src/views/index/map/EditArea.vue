<template>
  <div class="editAreaWrapper">
    <div class="layerMenu" id="layerMenu">
      <!-- <p class="menuTitle">项目列表</p> -->
      <div class="menuTrees">
        <div class="unit" v-for="(item,index) in unit" :key="index">
          <p class="unitName">
            单位： {{item.name}}
          </p>
          <!-- <div class="site" v-for="(i,j) in item.children" :key="j"> -->
          <!-- <p class="siteName"> 站点：{{i.name}}</p> -->
          <div class="area">
            <el-tree :data="item.children" node-key="id" default-expand-all :props="defaultProps" :expand-on-click-node='onNode' @node-click='clickNode'>
              <span class="custom-tree-node" slot-scope="{node}">
                <span>{{node.label }}</span>
                <span>
                  <span class="el-icon-circle-plus-outline operation" @click="clickBtnCircle(node)" v-show='node.data.children'>
                  </span>
                  <el-dialog title="新增" :visible.sync="dialogAddFormVisible">
                    <el-form :model="addFrom">
                      <el-form-item label="系统" :label-width="formLabelWidth">
                        <el-radio v-model="addFrom.system" label="1">预警系统</el-radio>
                        <el-radio v-model="addFrom.system" label="2">平台系统</el-radio>
                      </el-form-item>
                      <el-form-item label="名称" :label-width="formLabelWidth">
                        <el-input v-model="addFrom.name" autocomplete="off"></el-input>
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="dialogAddFormVisible = false">取 消</el-button>
                      <el-button type="primary" @click="sureAdd(node)">确 定</el-button>
                    </div>
                  </el-dialog>
                  <span class="el-icon-edit operation" @click="clickBtnEdit(node)" v-show='node.data.url'>
                  </span>
                  <el-dialog title="修改" :visible.sync="dialogEditFormVisible">
                    <el-form :model="editFrom">
                      <el-form-item label="名称" :label-width="formLabelWidth">
                        <el-input v-model="editFrom.name" autocomplete="off"></el-input>
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="dialogEditFormVisible = false">取 消</el-button>
                      <el-button type="primary" @click="sureEdit(node)">确 定</el-button>
                    </div>
                  </el-dialog>
                  <span class="el-icon-remove-outline operation" @click="clickBtnRemove(node)" v-show='node.data.url'>
                  </span>
                </span>
              </span>
            </el-tree>
            <!-- </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="layerMenuControl" @click="layerMenuClick()" title="点击展开结构图">
      <i class="el-icon-s-fold" />
    </div>
    <div class="toolIcon">
      <div class="toolIconList">
      </div>
    </div>
    <div class="editAreaContainer div-rows-col">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { getKey, setKey } from "@/utils/local";
import { getObjStr } from "@/utils/publictool";
import { listSelfFactoryRegionalByUserId } from "@/apis/area";
import {
  addArea,
  addAreaBuild,
  addBuild,
  addFloor,
  updateArea,
  updateAreaBuild,
  updateBuild,
  updateFloor,
  deletedArea,
  deletedAreaBuild,
  deletedBuild,
  deletedFloor
} from "@/apis/bmap";
export default {
  data() {
    return {
      layerMenu: true, //左边菜单默认展开
      unit: [],
      onNode: false, //点击节点不展开
      formLabelWidth: "100px",
      defaultProps: {
        id: "id",
        children: "children",
        label: "label"
      },
      dialogAddFormVisible: false, //增加
      addFrom: {
        system: "1"
      },
      currentAddData: {}, // 点击增加按钮传递的数据
      editFrom: {}, //修改
      dialogEditFormVisible: false,
      currentEditData: {} // 点击修改传递的数据
    };
  },
  created() {
    this.getArea();
  },
  mounted() {},

  methods: {
    // 展开左边菜单
    layerMenuClick() {
      this.layerMenu = this.layerMenu === true ? false : true;
      if (!this.layerMenu) {
        document.getElementById("layerMenu").style.transform =
          "translate(-100%,0)";
      } else {
        document.getElementById("layerMenu").style.transform = "translate(0,0)";
      }
    },
    //获取区域
    getArea() {
      listSelfFactoryRegionalByUserId({ userId: getKey("userInfor").userId })
        .then(res => {
          if (res.httpStatus == 200) {
            console.log(res);
            this.unit = res.result.map(item => {
              let siteArray = item.sites.map(i => {
                let areaArray = i.areas.map(k => {
                  let areaBuildsArray = k.areaBuilds.map(j => {
                    let BuildsArray = j.builds.map(l => {
                      let floorsArray = l.floors.map(m => {
                        return {
                          id: m.floorId,
                          label: m.floorName,
                          url: "/index/map/editArea/editCad",
                          showChildren: false,
                          floor: m.floorId,
                          points: m.points,
                          areaId: m.areaId,
                          buildId: m.buildId,
                          factoryId: m.factoryId,
                          regionId: m.regionId,
                          siteId: m.siteId,
                          system: m.system,
                          backgroundUrl: m.backgroundUrl
                        };
                      });
                      return {
                        id: l.buildId,
                        label: l.buildName,
                        url: "/index/map/editArea/editBuilding",
                        children: floorsArray,
                        showChildren: true,
                        build: l.buildId,
                        buildId: l.buildId,
                        regionId: l.regionId,
                        areaId: l.areaId,
                        factoryId: l.factoryId,
                        siteId: l.siteId,
                        points: l.points,
                        backgroundUrl: l.backgroundUrl
                      };
                    });
                    return {
                      id: j.regionId,
                      label: j.regionName,
                      url: "/index/map/editArea/editRegion",
                      children: BuildsArray,
                      region: j.regionId,
                      regionId: j.regionId,
                      areaId: j.areaId,
                      factoryId: j.factoryId,
                      siteId: j.siteId,
                      points: j.points,
                      backgroundUrl: j.backgroundUrl
                    };
                  });
                  return {
                    id: k.areaId,
                    label: k.areaName,
                    url: "/index/map/editArea/editMap",
                    children: areaBuildsArray,
                    area: k.areaId,
                    areaId: k.areaId,
                    factoryId: k.factoryId,
                    siteId: k.siteId,
                    points: k.points
                  };
                });
                return {
                  id: i.siteId,
                  label: i.siteName,
                  children: areaArray,
                  site: i.siteId,
                  factoryId: i.factoryId,
                  siteId: i.siteId
                };
              });
              return {
                id: item.factoryId,
                name: item.name,
                children: siteArray,
                factoryId: item.factoryId
              };
            });
            // console.log(this.unit);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //tree添加
    clickBtnCircle(node) {
      this.dialogAddFormVisible = true;
      console.log("确定添加", node);
      this.currentAddData = node;
    },
    //确定添加
    sureAdd(node) {
      node = this.currentAddData;
      if (node.data.build) {
        console.log("添加楼层");
        let { buildId, regionId, areaId, factoryId, siteId } = node.data;
        addFloor({
          buildId,
          regionId,
          areaId,
          factoryId,
          siteId,
          system: this.addFrom.system,
          floorName: this.addFrom.name,
          sort: 1
        })
          .then(res => {
            console.log(res);
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getArea();
            } else {
              this.$message({
                type: "warning",
                message: "操作失败"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else if (node.data.region) {
        console.log("添加楼栋");
        let { regionId, areaId, factoryId, siteId } = node.data;
        addBuild({
          regionId,
          areaId,
          factoryId,
          siteId,
          system: this.addFrom.system,
          buildName: this.addFrom.name,
          sort: 1
        })
          .then(res => {
            console.log(res);
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getArea();
            } else {
              this.$message({
                type: "warning",
                message: "操作失败"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else if (node.data.area) {
        // console.log("添加分区");
        let { areaId, factoryId, siteId } = node.data;
        console.log("添加分区", {
          areaId,
          factoryId,
          siteId,
          system: this.addFrom.system,
          regionName: this.addFrom.name,
          sort: 1
        });

        addAreaBuild({
          areaId,
          factoryId,
          siteId,
          system: this.addFrom.system,
          regionName: this.addFrom.name,
          sort: 1
        })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log("报错", err);
          });
      } else {
        console.log("添加区域");
        let { factoryId, siteId } = node.data;
        addArea({
          factoryId,
          siteId,
          system: this.addFrom.system,
          areaName: this.addFrom.name,
          sort: 1
        })
          .then(res => {
            console.log(res);
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getArea();
            } else {
              this.$message({
                type: "warning",
                message: "操作失败"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // tree 编辑
    clickBtnEdit(node) {
      console.log(node);
      //判断是否为undefind，是的话则其没有父级
      this.currentEditData = node;
      this.dialogEditFormVisible = true;
    },
    // 确定修改
    sureEdit(node) {
      node = this.currentEditData;
      console.log(node);
      if (node.data.floor) {
        let floorId = node.data.id;
        console.log("修改楼层");
        updateFloor({
          floorId,
          floorName: this.editFrom.name
        })
          .then(res => {
            console.log(res);
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getArea();
            } else {
              this.$message({
                type: "warning",
                message: "操作失败"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else if (node.data.build) {
        console.log("修改楼栋");
        let buildId = node.data.id;
        updateBuild({
          buildId,
          buildName: this.editFrom.name
        })
          .then(res => {
            console.log(res);
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getArea();
            } else {
              this.$message({
                type: "warning",
                message: "操作失败"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else if (node.data.region) {
        console.log("修改分区");
        let regionId = node.data.id;
        updateAreaBuild({
          regionId,
          regionName: this.editFrom.name
        })
          .then(res => {
            console.log(res);
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getArea();
            } else {
              this.$message({
                type: "warning",
                message: "操作失败"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        console.log("修改区域");
        let areaId = node.data.id;
        updateArea({
          areaId,
          areaName: this.editFrom.name
        })
          .then(res => {
            console.log(res);
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getArea();
            } else {
              this.$message({
                type: "warning",
                message: "操作失败"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //tree 删除
    clickBtnRemove(node) {
      console.log(node);
      this.$confirm("此操作将永久删除该资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (node.data.floor) {
            let floorId = node.data.id;
            console.log("删除楼层");
            deletedFloor({
              floorId
            })
              .then(res => {
                console.log(res);
                if (res.httpStatus == 200) {
                  this.$message({
                    type: "success",
                    message: "操作成功"
                  });
                  this.getArea();
                } else {
                  this.$message({
                    type: "warning",
                    message: "操作失败"
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else if (node.data.build) {
            console.log("删除楼栋");
            let buildId = node.data.id;
            deletedBuild({
              buildId
            })
              .then(res => {
                console.log(res);
                if (res.httpStatus == 200) {
                  this.$message({
                    type: "success",
                    message: "操作成功"
                  });
                  this.getArea();
                } else {
                  this.$message({
                    type: "warning",
                    message: "操作失败"
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else if (node.data.region) {
            console.log("删除分区");
            let regionId = node.data.id;
            deletedAreaBuild({
              regionId
            })
              .then(res => {
                console.log(res);
                if (res.httpStatus == 200) {
                  this.$message({
                    type: "success",
                    message: "操作成功"
                  });
                  this.getArea();
                } else {
                  this.$message({
                    type: "warning",
                    message: "操作失败"
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            console.log("删除区域");
            let areaId = node.data.id;
            deletedArea({
              areaId
            })
              .then(res => {
                console.log(res);
                if (res.httpStatus == 200) {
                  this.$message({
                    type: "success",
                    message: "操作成功"
                  });
                  this.getArea();
                } else {
                  this.$message({
                    type: "warning",
                    message: "操作失败"
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      // console.log(node);
    },
    // 点击某一个节点
    clickNode(a, b, c) {
      // this.$router.history.push(a.url);
      if (a.url) {
        // this.$store.commit("getCurrentId",{currentId:a.id})
        console.log(a);
        setKey("currentMsg", {
          allMsg: a,
          currentId: a.id,
          points: getObjStr(a.points),
          backgroundUrl: a.backgroundUrl
        });
        this.$router.history.push(a.url);
      }
      console.log(a, b, c);
      if (a.url == this.$route.path) {
        // console.log('同一级')
        this.$router.go(0);
      }
    }
  }
};
</script>

<style lang="less">
.editAreaWrapper {
  width: 100%;
  height: 100%;
  // .toolIcon{
  //   width: 80%;
  // }
  display: flex;
  flex-direction: column;
  .layerMenu {
    width: 286px;
    // width: 350px;
    // padding: 0 10px;
    height: 95%;
    position: absolute;
    left: 0;
    bottom: 0;
    transition: all 1s;
    background-color: #f1f1f1;
    overflow-y: auto;
    z-index: 100000000;
    // color: #e7e7e7;
    .menuTitle {
      font-size: 16px;
      padding: 15px;
    }
    .menuTrees {
      padding: 10px;
      .unit {
        border: 1px solid #f2f2f2;
        margin-top: 10px;
        .unitName {
          font-size: 16px;
          line-height: 20px;
        }
        .site {
          .siteName {
            font-size: 14px;
            line-height: 18px;
            text-indent: 5px;
          }
        }
      }
      .el-tree {
        // 修改树形样式
        background-color: #f1f1f1;
        .operation {
          font-size: 14px;
          margin-left: 20px;
        }
        .is-current {
          // background-color: salmon !important;
        }
        .is-focusable {
          // background-color: #262a34;
          background-color: #f1f1f1;
        }
        .el-tree-node__content:hover {
          //   background-color: #262a34;
          // background-color: red;
        }
        .el-tree-node__children:hover {
          // background-color: red;
        }
        .el-tree-node:focus > .el-tree-node__content {
          // background-color: yellow;
        }
        .el-tree-node.is-current > .el-tree-node__content {
          background-color: #c2d6ea !important;
        }
      }
    }
  }
  .layerMenu::-webkit-scrollbar {
    width: 4px;
  }
  .layerMenu::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);
  }
  .layerMenu::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .layerMenuControl {
    width: 30px;
    height: 30px;
    position: absolute;
    left: 290px;
    top: 10px;
    font-size: 30px;
    cursor: pointer;
  }
  .toolIcon {
    padding-top: 10px;
    .toolIconList {
      width: 90%;
      height: 36px;
      border: 1px solid #e7e7e7;
      display: flex;
      align-items: center;
      margin-left: 20px;
      img {
        width: 30px;
        height: 30px;
        margin-left: 10px;
      }
    }
  }
  .editAreaContainer {
    flex: 1;
    width: 100%;
    padding: 20px 0;
    display: flex;
  }
}
</style>
