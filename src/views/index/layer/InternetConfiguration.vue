<template>
  <div id='InternetConfigurationWrapper'>
    <!-- <h2>物联网配置</h2> -->
    <div class="imgList">
      <img v-for="(item,index) in draggableIconList" :key="index" class="nav-imgs mozgat" :src="item.icon">
    </div>
    <div id="canvasWrapper">
      <div id="imgCanvas" @mousewheel="theZoom($event)">
        <canvas id="canvasImg" :width="cw" :height="ch" @mousedown="clickCanvas($event)"></canvas>
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
      tempCtx: {}
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
      this.tempCanvas = document.createElement("canvas"); // 新建一个 canvas 作为缓存 canvas
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
    drawImg(a = function() {}) {
      let that = this;
      let num = 0;
      this.drawImgList.forEach(item => {
        let img = new Image();
        img.src = item.url;
        img.onload = function() {
          num++;
          if (num == that.drawImgList.length) {
            that.drawImgList.forEach(item => {
              let img = new Image();
              img.src = item.url;
              that.ctx.drawImage(img, item.x, item.y, item.w, item.h);
            });
            a();
          }
        };
      });
    },
    // 绘制可编辑矩形
    derawReact(x, y, w, h) {
      this.ctx.lineWidth = "2";
      this.ctx.strokeStyle = "#3385FF";
      //绘制大矩形
      this.ctx.strokeRect(x, y, w, h);
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
      this.ctx.fillStyle = "#3385FF";
      this.littleRectArr.forEach(item => {
        this.ctx.fillRect(item.x, item.y, item.w, item.h);
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
      let drawLittleRect = isPointRect(clickObj, this.littleRectArr);
      if (drawRect) {
        e.stopPropagation();
        this.currentDrawRect = Object.assign(drawRect);
        // console.log(this.currentDrawRect);
        var x = e.clientX - drawRect.x;
        var y = e.clientY - drawRect.y;
        this.ctx.clearRect(0, 0, this.cw, this.ch);
        this.drawImg(this.derawReact(drawRect.x, drawRect.y, drawRect.w, drawRect.h));
        
        // 拖动
        document.onmousemove = function(e) {
          that.ctx.clearRect(0, 0, that.cw, that.ch);
          that.drawImg();
          that.derawReact(drawRect.x, drawRect.y, drawRect.w, drawRect.h);
          drawRect.x = e.clientX - x;
          drawRect.y = e.clientY - y;
        };
        document.onmouseup = function() {
          document.onmousemove = null;
        };
      } else if (drawLittleRect) {
        e.stopPropagation();

        var y1 = e.clientY - drawLittleRect.img.y - 2 * drawLittleRect.img.h;
        var x1 = e.clientX - drawLittleRect.img.x - 2 * drawLittleRect.img.w;

        if (drawLittleRect.fun === "h") {
          document.onmousemove = function(e) {
            that.ctx.clearRect(0, 0, that.cw, that.ch);
            that.drawImgList.map(item => {
              // console.log(that.currentDrawRect);
              if (
                item.x == that.currentDrawRect.x &&
                item.y == that.currentDrawRect.y &&
                item.h == that.currentDrawRect.h &&
                item.w == that.currentDrawRect.w &&
                item.url == that.currentDrawRect.url
              ) {
                item.h = drawLittleRect.img.h;
              }
            });
            that.drawImg();
            that.derawReact(
              drawLittleRect.img.x,
              drawLittleRect.img.y,
              drawLittleRect.img.w,
              drawLittleRect.img.h
            );
            drawLittleRect.img.h = e.clientY - y1 - drawLittleRect.y;
            that.currentDrawRect.h = drawLittleRect.img.h;
          };
        } else {
          document.onmousemove = function(e) {
            that.ctx.clearRect(0, 0, that.cw, that.ch);

            that.drawImgList.map(item => {
              if (
                item.x == that.currentDrawRect.x &&
                item.y == that.currentDrawRect.y &&
                item.h == that.currentDrawRect.h &&
                item.w == that.currentDrawRect.w &&
                item.url == that.currentDrawRect.url
              ) {
                item.w = drawLittleRect.img.w;
              }
              // console.log(item)
            });
            that.drawImg();
            that.derawReact(
              drawLittleRect.img.x,
              drawLittleRect.img.y,
              drawLittleRect.img.w,
              drawLittleRect.img.h
            );
            drawLittleRect.img.w = e.clientX - x1 - drawLittleRect.x;
            that.currentDrawRect.w = drawLittleRect.img.w;
          };
        }
        document.onmouseup = function() {
          //  that.drawImg();
          // that.derawReact(drawRect.x, drawRect.y, drawRect.w, drawRect.h);
          document.onmousemove = null;
        };
      } else {
        that.littleRectArr = [];
        that.ctx.clearRect(0, 0, that.cw, that.ch);
        that.drawImg();
      }
    },
    theZoom(e) {
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
    }
  }
}
</style>