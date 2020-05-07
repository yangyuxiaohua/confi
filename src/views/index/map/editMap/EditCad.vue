<template>
  <div class="editCadWrapper">
    <div class="iconList">
      <div class='chosedIconBox '>
        <!-- <img src="../../../../assets/imgs/01.jpg" alt="" class="nav-imgs mozgat img1" id="img1" data-name='img1'>
        <img src="../../../../assets/imgs/02.jpg" alt="" class="nav-imgs mozgat img2" data-name='img2'>
        <img src="../../../../assets/imgs/03.jpg" alt="" class="nav-imgs mozgat img3" data-name='img3'> -->

        <div v-for="(item,index) in draggableIconList" :key="index" class="iconBox nav-imgs mozgat">
          <img :src="item.icon" alt="" class="nav-imgs mozgat" @mousedown="chosedDraggableImg(item)">
        </div>
      </div>
      <div class="unfold">
        <el-select v-model="iconValue" placeholder="请选择图标类型" @change="chosedIcon()">
          <el-option v-for="item in IconOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="left" id="imgBoxWrapper">
      <div id="imgBox" class="div-rows-col" @mousewheel="theZoom($event)">
        <img :src="bgcImg" alt="">
        <div id="iconBox">
          <img :src="item.icon" v-for="item in iconList" :key="item.id" :style="{left:item.x+'px',top:item.y+'px'}" @contextmenu='rightClickImg($event,item)' class='equipIcon' @mousedown="chosedEquipmentIcon(item)">
          <div class="choseMenu" :style="{left:choseMenuX+'px',top:choseMenuY+'px'}" v-show="showChoseMenu">
            <p @click="deletwIcon()">删除</p>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="rightTop">
        <div class="scenarioProperties">场景属性</div>
        <div>
          <span>属性名</span>
          <div>
            <span>属性值</span>
          </div>
        </div>
        <div>
          <span>场景类型</span>
          <div>
            <span>图片型</span>
          </div>
        </div>
        <div>
          <span>图片</span>
          <div>
            <el-upload class="avatar-uploader" :action="getIp" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <!-- <i class="el-icon-plus avatar-uploader-icon"></i> -->
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </div>
        <div class="savePositionBtn" v-show="updataIconPosition">
          <el-button type="primary" @click="savePosition()">保存位置</el-button>
        </div>
      </div>

      <div class="rightBottom" v-show="showEquipSelect">
        <div class="scenarioProperties">
          <p>衔接场景</p>
        </div>
        <div class="saveBtn">
          <el-button type="primary" @click="savePoints()">保存</el-button>
        </div>
        <div class="shoseEquip">
          <el-select v-model="equipValue" placeholder="请选择图标类型">
            <el-option v-for="item in equipOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import $ from "jquery";
import "webpack-jquery-ui";
import "webpack-jquery-ui/css";
import { getOffset } from "@/utils/publictool.js";
import { setKey, getKey } from "@/utils/local.js";
import { updateFloor } from "@/apis/bmap";
import { listNormalIcons, imgIp, ip } from "@/apis/upload";
import { getListDevices } from "@/apis/equipment";
import {
  addFloorDevice,
  listFloorDevice,
  deletedFloorDevice,
  updateFloorDevice
} from "@/apis/cadMap";
export default {
  data() {
    return {
      showIconBox: true,
      hideIconBox: false,
      IconOptions: [], // 图标类型下拉框
      draggableIconList: [], // 用于拖拽的图标数组
      iconValue: "", // 图标类型value
      equipValue: "", // 衔接设备value
      currentIcon: {}, // 当前拖拽图标参数
      equipOptions: [], //衔接设备下拉框
      imgBoxW: 1000, //图片盒子宽
      imgBoxH: 600, //图片盒子高
      scaleSize: 1, //初始化缩放率
      bigBoxW: 0, //大盒子宽
      bigBoxH: 0, //大盒子高
      iconList: [], //cad内的图标位置信息
      iconLists: [], //储存拖拽到cad内图片的
      bgX: 0, //图片盒子在大盒子内的X坐标
      bgY: 0, //图片盒子在大盒子内的Y坐标
      showEquipSelect: false,
      currentIconX: 0,
      currentIconY: 0,
      showChoseMenu: false, // 隐藏右击删除框
      choseMenuX: 0,
      choseMenuY: 0,
      currentIconId: "",
      flag: false, //控制两个拖动之间的影响
      updataIconPosition: false,
      currentEquipIcon: {}, //当前修改位置图标的参数
      currentEquipIconY: 0,
      currentEquipIconX: 0,
      bgcImg: "" //背景图片
    };
  },
  created() {
    // 初始化背景图片
    if (
      getKey("currentMsg").backgroundUrl &&
      getKey("currentMsg").backgroundUrl !== "null"
    ) {
      this.bgcImg = getKey("currentMsg").allMsg.backgroundUrl;
      console.log(this.bgcImg);
    }
    // 获取cad上显示的设备图标
    this.getListFloorDevice();
    // 获取通用图标数组
    listNormalIcons()
      .then(res => {
        if (res.httpStatus == 200) {
          this.IconOptions = res.result.map(item => {
            return {
              value: item.iotSystem,
              label: item.iotSystemName,
              icons: item.icons
            };
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
    //初始化缩放比例
    let that = this;
    this.initNs();
    // 图片盒子可以拖拽
    $("#imgBox").draggable({
      start: function(event) {
        that.startX = event.pageX;
        that.startY = event.pageY;
      },
      stop: function(event) {
        that.endX = event.pageX;
        that.endY = event.pageY;
        that.bgX = that.bgX + that.endX - that.startX;
        that.bgY = that.bgY + that.endY - that.startY;
      }
    });
  },
  computed: {
    getIp() {
      return ip;
    }
  },
  updated() {
    this.$nextTick(this.draggableImg);
    this.$nextTick(this.draggableEquipImg);
  },
  methods: {
    theZoom(e) {
      var $b = document.getElementById("imgBoxWrapper"), //大盒子
        i = document.getElementById("imgBox"), //小盒子
        img = i.style;
      //鼠标坐标
      let l = getOffset($b);
      let x = e.pageX;
      let y = e.pageY;
      //相对坐标
      x = x - l.left;
      y = y - l.top;
      var p = e.wheelDelta / 1200;
      var ns = this.scaleSize;
      ns += p;
      ns = ns < 1 ? 1 : ns > 10 ? 10 : ns; //可以缩小到0.1,放大到5倍

      //计算位置，以鼠标所在位置为中心
      //以每个点的x、y位置，计算其相对于图片的位置，再计算其相对放大后的图片的位置
      this.bgX =
        this.bgX - (x - this.bgX) * (ns - this.scaleSize) / this.scaleSize;
      this.bgY =
        this.bgY - (y - this.bgY) * (ns - this.scaleSize) / this.scaleSize;
      //设置放大的宽度和新坐标
      img.width = this.imgBoxW * ns + "px";
      img.height = this.imgBoxH * ns + "px";
      // 用一下图片高度的一半*变化率
      this.iconList = this.iconList.map(item => {
        item.y = item.y + item.y * (ns - this.scaleSize) / this.scaleSize;
        item.x = item.x + item.x * (ns - this.scaleSize) / this.scaleSize;
        // console.log((ns - this.scaleSize) / this.scaleSize);
        return item;
      });
      img.top = this.bgY + "px";
      img.left = this.bgX + "px";
      this.scaleSize = ns; //更新倍率
      console.log(this.scaleSize);
    },
    //初始化图片坐标
    initNs() {
      this.bigBoxH = parseInt(
        document.getElementById("imgBoxWrapper").offsetHeight
      );
      this.bigBoxW = parseInt(
        document.getElementById("imgBoxWrapper").offsetWidth
      );
      this.bgX = -(this.imgBoxW - this.bigBoxW) / 2;
      this.bgY = -(this.imgBoxH - this.bigBoxH) / 2;
      document.getElementById("imgBox").style.left = this.bgX + "px";
      document.getElementById("imgBox").style.top = this.bgY + "px";
    },
    //选择图标类型
    chosedIcon() {
      this.draggableIconList = this.IconOptions.filter(item => {
        return item.value == this.iconValue;
      })[0].icons;
      this.draggableIconList = this.draggableIconList.map(item => {
        return {
          deleted: item.deleted,
          deviceStatus: item.deviceStatus,
          deviceTypeCode: item.deviceTypeCode,
          deviceTypeId: item.deviceTypeId,
          deviceTypeName: item.deviceTypeName,
          enable: item.enable,
          icon: imgIp + item.icon,
          parentId: item.parentId,
          system: item.system
        };
      });
    },
    // 开启图片拖拽
    draggableImg() {
      let _this = this;
      $(".nav-imgs").draggable({
        helper: "clone", //如果设置为 "clone"，元素将被克隆，且克隆将被拖拽
        revert: "invalid", //如果设置为 "invalid"，还原仅在 draggable 未放置在 droppable 上时发生
        // opacity: 0.7, //不透明度
        // scope: 'drop', //一个“default”与droppable带有相同的scope值的draggable会被该droppable接受
        appendTo: "#imgBox",
        start: function() {
          // console.log("拖拽开始2", event, ui);
          _this.flag = true;
        },
        stop: function(event, ui) {
          _this.currentIconX = ui.position.left / _this.scaleSize;
          _this.currentIconY = ui.position.top / _this.scaleSize;
          // 用了之后再次拖拽失效
          _this.getDevicesList();
          _this.showEquipSelect = true;
          // console.log(event, ui);
          // console.log("拖拽结束2", ui.position, _this.scaleSize);
        }
      });
      //拖动复制到指定的div当中
      $("#imgBox").droppable({
        drop: function(event, ui) {
          if (_this.flag) {
            var ct = $(this);
            var item = $(ui.draggable);
            var origPos;
            var ctPos = ct.offset();

            if (item.is(".tapad")) {
              origPos = ui.offset;
              ct.append(item);
            } else {
              origPos = ui.offset;
              item = item.clone();
              ct.append(item);
              item.removeClass("ui-draggable");
              item.addClass("tapad");
            }
            item.css({
              top: origPos.top - ctPos.top - 1,
              left: origPos.left - ctPos.left - 1
            });
          }
        }
      });
    },
    draggableEquipImg() {
      let _this = this;
      $(".equipIcon").draggable({
        // helper: "clone", //如果设置为 "clone"，元素将被克隆，且克隆将被拖拽
        // revert: "invalid", //如果设置为 "invalid"，还原仅在 draggable 未放置在 droppable 上时发生
        // opacity: 0.7, //不透明度
        // scope: 'drop', //一个“default”与droppable带有相同的scope值的draggable会被该droppable接受
        // appendTo: "#iconBox",
        containment: "#iconBox",
        start: function() {
          // console.log("拖拽开始1", event, ui.position);
          _this.flag = false;
        },
        stop: function(event, ui) {
          // _this.currentIconX = ui.position.left / _this.scaleSize;
          // _this.currentIconY = ui.position.top / _this.scaleSize;
          // 用了之后再次拖拽失效
          // _this.getDevicesList();
          // _this.showEquipSelect = true;
          // console.log("拖拽结束1", event, ui.position, _this.scaleSize);
          _this.updataIconPosition = true;
          _this.currentEquipIconY = ui.position.top;
          _this.currentEquipIconX = ui.position.left;
          // console.log("拖拽结束", ui.position, _this.scaleSize);
        }
      });
    },
    //选中拖拽图标
    chosedDraggableImg(icon) {
      console.log("12341231234");
      this.currentIcon = icon;
    },
    // 拖拽结束之后请求衔接的场景
    getDevicesList() {
      console.log(
        this.currentIcon.deviceTypeCode,
        getKey("currentMsg").currentId
      );
      getListDevices({
        deviceTypeCode: this.currentIcon.deviceTypeCode,
        floorId: getKey("currentMsg").currentId
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.equipOptions = res.result.map(item => {
              return {
                value: item.deviceId,
                label: item.position + item.mac
              };
            });
            console.log(this.equipOptions);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 绑定value
    chosedEquip() {},
    // 保存点位
    savePoints() {
      console.log(getKey("currentMsg"));
      let { areaId, buildId, factoryId, regionId, siteId, system } = getKey(
        "currentMsg"
      ).allMsg;
      if (this.equipValue) {
        addFloorDevice({
          floorId: getKey("currentMsg").currentId,
          areaId,
          buildId,
          factoryId,
          regionId,
          siteId,
          system,
          deviceId: this.equipValue,
          x: this.currentIconX,
          y: this.currentIconY
        })
          .then(res => {
            console.log(res);
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "操作成功"
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
      } else {
        this.$message({
          type: "warning",
          message: "请选择衔接场景"
        });
      }
    },
    // 获取图标列表
    getListFloorDevice() {
      console.log(getKey("currentMsg").currentId);
      listFloorDevice({
        floorId: getKey("currentMsg").currentId
      })
        .then(res => {
          // console.log('图标列表',res);
          if (res.httpStatus == 200) {
            this.iconList = res.result.map(item => {
              item.icon = imgIp + item.icon;
              item.x = item.x * this.scaleSize;
              item.y = item.y * this.scaleSize;
              //  console.log(item)
              return item;
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 鼠标右击事件
    rightClickImg(e, icon) {
      e.preventDefault();
      // 执行代码块
      this.showChoseMenu = true;
      console.log(icon);
      this.choseMenuX = e.clientX + 10;
      this.choseMenuY = e.clientY + 20;
      this.currentIconId = icon.id;
    },
    deletwIcon() {
      deletedFloorDevice({ id: this.currentIconId })
        .then(res => {
          this.showChoseMenu = false;
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getListFloorDevice();
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
    // cad图上当前设备图标信息
    chosedEquipmentIcon(icon) {
      console.log(icon);
      this.currentEquipIcon = icon;
      console.log(this.currentEquipIcon.id);
    },
    // 修改设备图标位置保存按钮
    savePosition() {
      console.log(this.currentEquipIconY);
      console.log(this.currentEquipIconX);
      updateFloorDevice({
        id: this.currentEquipIcon.id,
        x: this.currentEquipIconX / this.scaleSize,
        y: this.currentEquipIconY / this.scaleSize
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.getListFloorDevice();
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
    // 上传成功
    handleAvatarSuccess(res) {
      this.bgcImg = imgIp + res.result;
      updateFloor({
        floorId: getKey("currentMsg").currentId,
        backgroundUrl: this.bgcImg
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "上传成功"
            });
            let allMsg = getKey("currentMsg").allMsg;
            allMsg.backgroundUrl = this.bgcImg;
            setKey("currentMsg", {
              currentId: getKey("currentMsg").currentId,
              points: getKey("currentMsg").points,
              backgroundUrl: this.bgcImg,
              allMsg
            });
          } else {
            this.$message({
              type: "warning",
              message: "上传失败"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 上传之前
    beforeAvatarUpload(file) {
      console.log(file);
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error("上传图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="less" scoped>
.editCadWrapper {
  width: 100%;
  height: 100%;
  // background-color: #000;
  display: flex;
  position: relative;
  .iconList {
    width: 90%;
    height: 50px;
    border: 1px solid #e7e7e7;
    position: absolute;
    left: 20px;
    top: -58px;
    background-color: #fff;
    z-index: 10;
    display: flex;
    align-items: center;
    .chosedIconBox {
      display: flex;
      img {
        width: 30px;
        height: 30px;
        margin-left: 10px;
      }
      .iconBox {
        width: 40px;
        height: 50px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        align-items: center;
        justify-content: center;
      }
    }
    .unfold {
      position: absolute;
      right: 10px;
      .el-select {
        width: 150px;
      }
    }
  }
  .left {
    height: 100%;
    flex: 1;
    border: 1px solid #e7e7e7;
    margin: 0 10px;
    overflow: hidden;
    position: relative;

    #imgBox {
      width: 1000px;
      height: 600px;
      position: absolute;
      border: none;
      img {
        width: 100%;
        height: 100%;
      }
      #iconBox {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        img {
          position: absolute;
          width: 30px;
          height: 30px;
          left: 0;
          top: 0;
          z-index: 100;
        }
        .equipIcon {
          cursor: pointer;
        }
        .choseMenu {
          width: 100px;
          height: 30px;
          line-height: 30px;
          background-color: #fff;
          position: fixed;
          z-index: 100;
          left: 50%;
          top: 50%;
          cursor: pointer;
          p {
            width: 100%;
            text-align: center;
          }
        }
        .choseMenu:hover {
          background-color: #f2f2f2;
        }
      }
      .mozgat {
        cursor: move;
        margin-bottom: 7px;
        position: absolute;
        // z-index: 100000;
        width: 30px;
        height: 30px;
      }
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    .rightTop {
      // flex: 0 0 350px;
      border: 1px solid #e7e7e7;
      margin-right: 10px;
      // flex: 0 0 400px;
      border: 1px solid #e7e7e7;
      margin-right: 10px;
      border-radius: 5px;
      & > div {
        height: 50px;
        display: flex;
        align-items: center;
        & > span {
          display: inline-block;
          height: 100%;
          width: 90px;
          border-bottom: 1px solid #e7e7e7;
          border-right: 1px solid #e7e7e7;
          line-height: 50px;
          text-indent: 10px;
        }
        & > div {
          height: 100%;
          width: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #e7e7e7;
        }
      }
      .scenarioProperties {
        background-color: #475669;
        color: #fff;
        text-indent: 10px;
        width: 352px;
      }
      .savePositionBtn {
        // border-bottom: 1px solid #e7e7e7;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .rightBottom {
      margin-top: 80px;
      & > div {
        height: 50px;
        width: 350px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e7e7e7;
        border-right: 1px solid #e7e7e7;
        border-left: 1px solid #e7e7e7;
      }
      .saveBtn,
      .shoseEquip {
        justify-content: center;
      }
      .scenarioProperties {
        background-color: #475669;
        width: 352px;
        color: #fff;
        text-indent: 10px;
      }
    }
  }
}
</style>