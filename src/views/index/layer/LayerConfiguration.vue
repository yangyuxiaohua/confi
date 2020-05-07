<template>
  <div id="LayerConfigurationWrapper">
    <canvas id="customPositionImg2" ref="table2" style=" display:none;"></canvas>
    <!--显示层 增加鼠标按下，移动，松开事件-->
    <canvas id="customPositionImg" ref="table" @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup" style=""></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      c: {},
      ctx: {},
      cw: 1000,
      ch: 700,
      imgSrc:require('../../../assets/iotdevicetype/安全阀.png')
    };
  },
  mounted() {
    // this.c = document.getElementById("canvasrect");
    // this.ctx = this.c.getContext("2d");
    // this.init();
    // this.drawReact();
  },
  methods: {
    init() {
      this.c = document.getElementById("canvasrect");
      this.ctx = this.c.getContext("2d");
      this.cw = this.cw * 0.7;
      this.ch = this.ch * 0.7;
    },
    drawReact() {
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(0, 0, 300, 150);
      this.ctx.clearRect(20, 20, 100, 50);
    },
    show() {
      this.nextTick(()=> {
        let customCanvas = this.$refs.table; // canvas显示层
        this.customstyle = "";
        customCanvas.height = 740;
        customCanvas.width = 1460;
        this.customcxt = customCanvas.getContext("2d");
        let img = new Image();
        img.src = this.imgSrc;
        let that = this;
        img.onload = function() {
          that.customRwidth = customCanvas.width / img.width; //原图与展示图片的宽高比
          that.customRheight = customCanvas.height / img.height;
          that.customcxt.drawImage(
            img,
            0,
            0,
            customCanvas.width,
            customCanvas.height
          );
        };
      });
    },
    mousedown(e) {
      this.isMouseDownInCanvas = true;
      // 鼠标按下时开始位置与结束位置相同 防止鼠标在画完矩形后 点击图画形成第二个图形
      this.endX = e.offsetX;
      this.endY = e.offsetY;
      this.startX = e.offsetX;
      this.startY = e.offsetY;
    },
    mousemove(e) {
      if (this.isMouseDownInCanvas) {
        // 当鼠标有按下操作时执行
        console.log(e.offsetX, e.offsetY);
        if (this.endX != e.offsetX || this.endY != e.offsetY) {
          this.endX = e.offsetX;
          this.endY = e.offsetY;
          let wwidth = this.endX - this.startX;
          let wheigth = this.endY - this.startY;
          let tempCanvas = this.$refs.table2; // canvas临时层
          let tempCtx = tempCanvas.getContext("2d");
          tempCanvas.width = 1460;
          tempCanvas.height = 740; // 设置宽高
          // 清除临时层指定区域的所有像素
          tempCtx.clearRect(0, 0, 1460, 740);
          // 重新展示图片
          let img = new Image();
          img.src = this.imgSrc;
          let that = this;
          img.onload = function() {
            that.customcxt.drawImage(img, 0, 0, 1460, 740);
          };
          this.customcxt.strokeStyle = " #00ff00"; //矩形框颜色
          this.customcxt.lineWidth = "2"; //矩形框宽度
          this.customcxt.strokeRect(this.startX, this.startY, wwidth, wheigth); //绘制矩形
        } else {
          //鼠标按下静止时显示矩形的大小。
          let wwidth2 = this.endX - this.startX;
          let wheigth2 = this.endY - this.startY;
          this.customcxt.strokeRect(
            this.startX,
            this.startY,
            wwidth2,
            wheigth2
          );
        }
      }
    },
    mouseup() {
      this.isMouseDownInCanvas = false; // 绘制最终的矩形框
      let wwidth = this.endX - this.startX;
      let wheigth = this.endY - this.startY;
      this.customcxt.strokeRect(this.startX, this.startY, wwidth, wheigth);
    }
  }
};
</script>

<style lang="less" scoped>
#LayerConfigurationWrapper {
  width: 100%;
  height: 100%;
}
</style>