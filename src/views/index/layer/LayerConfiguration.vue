<template>
  <div id='InternetConfigurationWrapper'>
    <!-- <h2>物联网配置</h2> -->
    <div class="imgList">
      <img v-for="(item,index) in draggableIconList" :key="index" class="nav-imgs mozgat" :src="item.icon">
    </div>
    <div id="canvasWrapper">
      <div id="imgCanvas" @mousewheel="theZoom($event)">
        <canvas id="canvasImg" :width="cw" :height="ch" @mousedown="clickCanvas($event)"></canvas>
        <canvas id="newCanvas" :width="cw" :height="ch" @mousedown="clickNewCanvas($event)"></canvas>
        <!-- <div id="equipImgBox">

            </div> -->
      </div>

    </div>
  </div>
</template>

<script>
import $ from "jquery";
import "webpack-jquery-ui";
import "webpack-jquery-ui/css";
import { isPointRect, getOffset } from "@/utils/publictool.js";
export default {
  data() {
    return {
      cw: 1200, //canvas宽
      ch: 750,
      draggableIconList: [
        {
          icon: require("../../../assets/iotdevicetype/水泵控制柜.png")
        },
        {
          icon: require("../../../assets/iotdevicetype/安全阀.png")
        },
        {
          icon: require("../../../assets/iotdevicetype/水泵接合器.png")
        },
        {
          icon: require("../../../assets/iotdevicetype/流向-右.png")
        },
        {
          icon: require("../../../assets/iotdevicetype/消火栓.png")
        },
        {
          icon: require("../../../assets/iotdevicetype/消防水池.png")
        },
        {
          icon: require("../../../assets/iotdevicetype/溢流管.png")
        }
      ],
      c: {},
      ctx: {},
      //   drawImgList: [] //在canvas上的图片列表
      drawImgList: [
        {
          url: require("../../../assets/iotdevicetype/安全阀.png"),
          x: 10,
          y: 10,
          w: 50,
          h: 50
        },
        {
          url: require("../../../assets/iotdevicetype/水泵接合器.png"),
          x: 100,
          y: 100,
          w: 50,
          h: 50
        },
        {
          url: require("../../../assets/iotdevicetype/流向-右.png"),
          x: 200,
          y: 200,
          w: 50,
          h: 50
        },
        {
          url: require("../../../assets/iotdevicetype/消火栓.png"),
          x: 300,
          y: 300,
          w: 50,
          h: 50
        },
        {
          url: require("../../../assets/iotdevicetype/消防水池.png"),
          x: 400,
          y: 400,
          w: 50,
          h: 50
        },
        {
          url: require("../../../assets/iotdevicetype/溢流管.png"),
          x: 500,
          y: 500,
          w: 50,
          h: 50
        }
      ], //在canvas上的图片列表
      reactWidth: 300,
      reactHeight: 300,
      littleRectArr: [], //小矩形数组
      curentDrawObj: {}, // 拖进画布的对象
      clickX: 0, //数遍点击的坐标
      clickY: 0,
      currentDrawRect: {}, //当前选中的图片对象
      scaleSize: 1,
      bgX: 0,
      bgY: 0,
      imgBoxW: 1200,
      imgBoxH: 750,
      startX: 0, //图片盒子拖动之前位置
      startY: 0,
      endX: 0,
      endY: 0,
      tempCanvas: {},
      tempCtx: {},
      clickFlag: false, //判断是否已经点击
      drawRect: {} //点击的对象
    };
  },
  mounted() {
    let that = this;
    this.initCanvas();
    this.drawImg();
    // this.derawReact(100, 100, 300, 300);

    this.draggableImg();

    // 设置canvas盒子可以拖动
    $("#imgCanvas").draggable({
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
  updated() {
    this.$nextTick(this.draggableImg);
    // this.$nextTick(this.draggableCanvasImg);
    // this.$nextTick(this.derawReact);
  },
  methods: {
    initCanvas() {
      //初始化画布
      // console.log(this.cw, this.ch);
      this.c = document.getElementById("canvasImg");
      this.ctx = this.c.getContext("2d");
      this.tempCanvas = document.getElementById("newCanvas");
      this.tempCtx = this.tempCanvas.getContext("2d");
      this.tempCanvas.width = 1200;
      this.tempCanvas.height = 750;
    },
    draggableImg() {
      let _this = this;
      $(".nav-imgs").draggable({
        helper: "clone", //如果设置为 "clone"，元素将被克隆，且克隆将被拖拽
        start: function() {},
        stop: function(event, ui) {
          _this.curentDrawObj = {
            url: event.target.currentSrc,
            x: ui.position.left - 266 - _this.bgX,
            y: ui.position.top - 126 - _this.bgY,
            w: 100,
            h: 100
          };
          _this.drawImgList.push(_this.curentDrawObj);
          _this.drawImg();
          _this.derawReact(
            _this.curentDrawObj.x,
            _this.curentDrawObj.y,
            _this.curentDrawObj.w,
            _this.curentDrawObj.h
          );
        }
      });
    },
    // 绘制图片
    drawImg() {
      let that = this;
      // let num = 0;
      this.drawImgList.forEach(item => {
        let img = new Image();
        img.src = item.url;
        img.onload = function() {
          //   num++;
          //   if (num == that.drawImgList.length) {
          //     that.drawImgList.forEach(item => {
          // let img = new Image();
          // img.src = item.url;
          that.ctx.drawImage(img, item.x, item.y, item.w, item.h);
          // });
        };
        // };
      });
    },
    drawNewImg(imgObj) {
      let that = this;
      let img = new Image();
      img.src = imgObj.url;
      img.onload = function() {
        that.tempCtx.drawImage(img, imgObj.x, imgObj.y, imgObj.w, imgObj.h);
      };
    },
    // 绘制可编辑矩形
    derawReact(x, y, w, h) {
      this.tempCtx.lineWidth = "2";
      this.tempCtx.strokeStyle = "#3385FF";
      //绘制大矩形
      this.tempCtx.strokeRect(x, y, w, h);
      // 绘制小矩形
      this.littleRectArr = [
        {
          fun: "w",
          x: x + w - 10,
          y: y + h / 2 - 10,
          w: 20,
          h: 20,
          img: {
            x,
            y,
            w,
            h
          }
        },
        {
          fun: "h",
          x: x + w / 2 - 10,
          y: y + h - 10,
          w: 20,
          h: 20,
          img: {
            x,
            y,
            w,
            h
          }
        }
      ];
      this.tempCtx.fillStyle = "#3385FF";
      this.littleRectArr.forEach(item => {
        this.tempCtx.fillRect(item.x, item.y, item.w, item.h);
      });
    },
    //画布点击拖动事件
    clickCanvas(e) {
      e.preventDefault();

      let that = this;
      if (e.offsetX || e.layerX) {
        this.clickX = e.offsetX == undefined ? e.layerX : e.offsetX;
        this.clickY = e.offsetY == undefined ? e.layerY : e.offsetY;
      }
      let clickObj = {
        x: this.clickX,
        y: this.clickY
      };

      //判断点击在哪个矩形图像内且重新绘制图片和矩形
      let drawRect = isPointRect(clickObj, this.drawImgList);
      if (drawRect) {
        // if (!this.clickFlag) {
        console.log(this.clickFlag);
        e.stopPropagation();
        this.currentDrawRect = Object.assign(drawRect);
        // console.log(this.currentDrawRect);
        var x = e.clientX - drawRect.x;
        var y = e.clientY - drawRect.y;
        this.ctx.clearRect(0, 0, this.cw, this.ch);
        //绘制新的删除项之后的图
        let clickNum;
        this.drawImgList.forEach((item, index) => {
          if (
            item.x == drawRect.x &&
            item.y == drawRect.y &&
            item.w == drawRect.w &&
            item.h == drawRect.h
          ) {
            clickNum = index;
          }
        });

        this.drawImgList.splice(clickNum, 1);
        this.drawImg();
        this.tempCanvas.style.zIndex = 20;
        this.tempCtx.clearRect(0, 0, this.cw, this.ch);
        this.drawNewImg(drawRect);
        this.derawReact(drawRect.x, drawRect.y, drawRect.w, drawRect.h);
        that.drawRect = drawRect;

        // 拖动
        document.onmousemove = function(e) {
          e.stopPropagation();
          that.tempCtx.clearRect(0, 0, that.cw, that.ch);
          that.drawNewImg(drawRect);
          that.derawReact(drawRect.x, drawRect.y, drawRect.w, drawRect.h);
          drawRect.x = e.clientX - x;
          drawRect.y = e.clientY - y;
        };
        document.onmouseup = function() {
          document.onmousemove = null;
          that.clickFlag = true;
          // console.log(that.drawRect);
        };
      }
    },
    clickNewCanvas(e) {
      e.preventDefault();
      e.stopPropagation()
      let that = this;
      if (e.offsetX || e.layerX) {
        this.clickX = e.offsetX == undefined ? e.layerX : e.offsetX;
        this.clickY = e.offsetY == undefined ? e.layerY : e.offsetY;
      }
      let clickObj = {
        x: this.clickX,
        y: this.clickY
      };
      if (
        clickObj.x >= that.drawRect.x &&
        clickObj.x <= that.drawRect.x + that.drawRect.w &&
        clickObj.y >= that.drawRect.y &&
        clickObj.y <= that.drawRect.y + that.drawRect.h
      ) {
        var x = e.clientX - that.drawRect.x;
        var y = e.clientY - that.drawRect.y;
        document.onmousemove = function(e) {
          e.stopPropagation();
          that.tempCtx.clearRect(0, 0, that.cw, that.ch);
          that.drawNewImg(that.drawRect);
          that.derawReact(
            that.drawRect.x,
            that.drawRect.y,
            that.drawRect.w,
            that.drawRect.h
          );
          that.drawRect.x = e.clientX - x;
          that.drawRect.y = e.clientY - y;
        };
        document.onmouseup = function() {
          document.onmousemove = null;
        };
      } else if (isPointRect(clickObj, this.littleRectArr)) {
        let drawLittleRect = isPointRect(clickObj, this.littleRectArr);
        var y1 = e.clientY - drawLittleRect.img.y - 2 * drawLittleRect.img.h;
        var x1 = e.clientX - drawLittleRect.img.x - 2 * drawLittleRect.img.w;
        if (drawLittleRect.fun === "h") {
          document.onmousemove = function(e) {
            that.tempCtx.clearRect(0, 0, that.cw, that.ch);
            that.drawNewImg(that.drawRect);
            that.derawReact(
              drawLittleRect.img.x,
              drawLittleRect.img.y,
              drawLittleRect.img.w,
              drawLittleRect.img.h
            );
            drawLittleRect.img.h = e.clientY - y1 - drawLittleRect.y;
            that.drawRect.h = drawLittleRect.img.h;
          };
        } else {
          document.onmousemove = function(e) {
            that.tempCtx.clearRect(0, 0, that.cw, that.ch);
            that.drawNewImg(that.drawRect);
            that.derawReact(
              drawLittleRect.img.x,
              drawLittleRect.img.y,
              drawLittleRect.img.w,
              drawLittleRect.img.h
            );
            drawLittleRect.img.w = e.clientX - x1 - drawLittleRect.x;
            that.drawRect.w = drawLittleRect.img.w;
          };
        }
        document.onmouseup = function() {
          document.onmousemove = null;
        };
      } else {
        this.drawImgList.push(that.drawRect);
        if (isPointRect(clickObj, this.drawImgList)) {
          that.drawRect = isPointRect(clickObj, this.drawImgList);
          let clickNum;
          this.drawImgList.forEach((item, index) => {
            if (
              item.x == that.drawRect.x &&
              item.y == that.drawRect.y &&
              item.w == that.drawRect.w &&
              item.h == that.drawRect.h
            ) {
              clickNum = index;
            }
          });
          this.drawImgList.splice(clickNum, 1);
          this.ctx.clearRect(0, 0, that.cw, that.ch);
          this.drawImg();

          that.tempCtx.clearRect(0, 0, that.cw, that.ch);
          that.drawNewImg(that.drawRect);
          that.derawReact(
            that.drawRect.x,
            that.drawRect.y,
            that.drawRect.w,
            that.drawRect.h
          );
          x = e.clientX - that.drawRect.x;
          y = e.clientY - that.drawRect.y;
          document.onmousemove = function(e) {
            e.stopPropagation();
            that.tempCtx.clearRect(0, 0, that.cw, that.ch);
            that.drawNewImg(that.drawRect);
            that.derawReact(
              that.drawRect.x,
              that.drawRect.y,
              that.drawRect.w,
              that.drawRect.h
            );
            that.drawRect.x = e.clientX - x;
            that.drawRect.y = e.clientY - y;
          };
        } else {
          that.tempCtx.clearRect(0, 0, that.cw, that.ch);
          this.tempCanvas.style.zIndex = 0;
          that.ctx.clearRect(0, 0, that.cw, that.ch);
          that.drawImg();
        }
      }
    },
    theZoom(e) {
      this.tempCanvas.style.zIndex = 0;
      if (this.drawRect) {
        this.drawImgList.push(this.drawRect);
        this.tempCtx.clearRect(0, 0, this.cw, this.ch);
        this.ctx.clearRect(0, 0, this.cw, this.ch);
        this.drawImg();
        this.drawRect = {};
      }

      var $b = document.getElementById("canvasWrapper"), //大盒子
        i = document.getElementById("imgCanvas"), //小盒子
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
      img.top = this.bgY + "px";
      img.left = this.bgX + "px";
      this.cw = this.imgBoxW * ns;
      this.ch = this.imgBoxH * ns;
      // 用一下图片高度的一半*变化率
      this.drawImgList = this.drawImgList.map(item => {
        item.y = item.y + item.y * (ns - this.scaleSize) / this.scaleSize;
        item.x = item.x + item.x * (ns - this.scaleSize) / this.scaleSize;
        // item.x = item.x + item.x * (ns - this.scaleSize) / this.scaleSize;
        // console.log(ns);
        item.w = item.w + item.w * (ns - this.scaleSize) / this.scaleSize;
        item.h = item.h + item.h * (ns - this.scaleSize) / this.scaleSize;
        // console.log(item.w);
        // console.log((ns - this.scaleSize) / this.scaleSize);
        return item;
      });
      // // 处理新画布上的对象
      // // console.log(this.drawRect);
      // this.drawRect.y =
      //   this.drawRect.y +
      //   this.drawRect.y * (ns - this.scaleSize) / this.scaleSize;
      // this.drawRect.x =
      //   this.drawRect.x +
      //   this.drawRect.x * (ns - this.scaleSize) / this.scaleSize;
      // // item.x = item.x + item.x * (ns - this.scaleSize) / this.scaleSize;
      // // console.log(ns);
      // this.drawRect.w =
      //   this.drawRect.w +
      //   this.drawRect.w * (ns - this.scaleSize) / this.scaleSize;
      // this.drawRect.h =
      //   this.drawRect.h +
      //   this.drawRect.h * (ns - this.scaleSize) / this.scaleSize;
      // console.log(this.drawRect);
      // console.log(this.drawImgList);
      // console.log(this.derawReact);

      this.scaleSize = ns; //更新倍率
      this.drawImg();
    }
  }
};
</script>

<style lang="less" scoped>
#InternetConfigurationWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .imgList {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    // padding-right:20px;
    .mozgat {
      cursor: move;
      //   margin-bottom: 7px;
      // position: absolute;
      width: 40px;
      height: 40px;
      margin-left: 20px;
      z-index: 100;
    }
  }
  #canvasWrapper {
    flex: 1;
    position: relative;
    background-color: #819bb4;
    overflow: hidden;
    #imgCanvas {
      position: absolute;
      // background-color: #000;
      width: 1200px;
      height: 750px;
      left: 0;
      right: 0;
      // img {
      //   position: absolute;
      //   width: 30px;
      //   height: 30px;
      //   left: 0;
      //   top: 0;
      //   z-index: 100;
      // }
      #canvasImg {
        position: absolute;
        left: 0;
        right: 0;
        z-index: 10;
      }
      #newCanvas {
        position: absolute;
        left: 0;
        right: 0;
        z-index: 0;
      }
    }
  }
}
</style>