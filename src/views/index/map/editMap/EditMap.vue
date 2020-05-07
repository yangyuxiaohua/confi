<template>
  <div class="MapWraaper">
    <div class="left">
      <div id="hello">
        <div id="dbmap"></div>
      </div>
    </div>
    <div class="right">
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
        <span>中心位置</span>
        <div>
          <span>{{centerLat}}
            <span v-show="showComma">,</span>
          </span>
          <span>{{centerLng}}</span>
        </div>
      </div>
      <div>
        <span>图片</span>
        <div>
          <div>
            <el-button type="primary" @click="editLocation()">保存位置</el-button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
let BMap = window.BMap;
let BMapLib = window.BMapLib;
import { updateArea } from "@/apis/bmap";
import { getKey, setKey } from "@/utils/local";
import { getObjStr } from "@/utils/publictool";
export default {
  name: "dbmap",

  data() {
    return {
      map: null,
      drawingManager: null,
      overlays: [], //存放点的数组
      centerLat: "", //中心店经度
      centerLng: "", //中心店维度
      showComma: false, //显示逗号
      showPolyonList: [] // 显示的多边形覆盖物数组
    };
  },
  created() {
    if (getKey("currentMsg").points && getKey("currentMsg").points !== "null") {
      this.showPolyonList = getKey("currentMsg").points;
      // console.log(typeof this.showPolyonList);
    }
  },
  mounted() {
    this.map = new BMap.Map("dbmap", {
      enableMapClick: false // 禁止底图点击事件
    });
    this.map.centerAndZoom(new BMap.Point(104.070665,30.575413), 15);
    this.map.enableScrollWheelZoom();

    var styleOptions = {
      strokeColor: "blue", //边线颜色。
      fillColor: "rgba(102,168,255)", //填充颜色。当参数为空时，圆形将没有填充效果。
      strokeWeight: 2, //边线的宽度，以像素为单位。
      strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
      fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
      strokeStyle: "solid" //边线的样式，solid或dashed。
    };
    //实例化鼠标绘制工具
    this.drawingManager = new BMapLib.DrawingManager(this.map, {
      isOpen: false, //是否开启绘制模式
      enableDrawingTool: true, //是否显示工具栏
      drawingToolOptions: {
        anchor: "BMAP_ANCHOR_TOP_RIGHT", //位置
        offset: new BMap.Size(5, 5) //偏离值
      },
      polygonOptions: styleOptions //多边形的样式
    });
    //添加鼠标绘制工具监听事件，用于获取绘制结果
    this.drawingManager.addEventListener(
      "overlaycomplete",
      this.overlaycomplete
    );
    // 初始化地图上的多边形覆盖物
    this.showPolyon();
  },
  methods: {
    overlaycomplete(e) {
      this.overlays = e.overlay.ia;
      console.log(e)
      console.log(e.overlay.ia)
    },
    //保存位置
    editLocation() {
      console.log(this.overlays)
      if (this.overlays.length >= 3) {
        this.showComma = true;
        let lat = 0,
          lng = 0;
        this.overlays.forEach(item => {
          lat += item.lat;
          lng += item.lng;
        });
        this.centerLat = lat / this.overlays.length;
        this.centerLng = lng / this.overlays.length;
        console.log({
          id: getKey("currentMsg"),
          points: getObjStr(this.overlays),
          lat:this.centerLat,
          lon:this.centerLng
        });
        updateArea({
          areaId: getKey("currentMsg").currentId,
          points: getObjStr(this.overlays),
          // lat:this.centerLat,
          // lon:this.centerLng
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.showPolyonList = this.overlays;
              setKey("currentMsg", {
                currentId: getKey("currentMsg").currentId,
                points: this.overlays
              });
              this.map.clearOverlays();
              this.showPolyon();
              this.$message({
                type: "success",
                message: "保存成功"
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
        this.showComma = false;
        this.$message({
          type: "warning",
          message: "请绘制区域且坐标点大于三个"
        });
      }
    },
    //在地图上显示多边形
    showPolyon() {
      console.log(this.showPolyonList);

      var polygon = new BMap.Polygon(
        this.showPolyonList.map(item => {
          return new BMap.Point(item.lng, item.lat);
        }),
        { strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5 }
      );

      this.map.addOverlay(polygon);
    }
  }
};
</script>

<style lang="less" scoped>
.MapWraaper {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    height: 100%;
    flex: 1;
    border: 1px solid #e7e7e7;
    margin: 0 10px;
    #hello {
      width: 100%;
      height: 100%;
      #dbmap {
        width: 100%;
        height: 100%;
      }
    }
  }
  .right {
    flex: 0 0 350px;
    border: 1px solid #e7e7e7;
    margin-right: 10px;
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
        border-right: 1px solid #e7e7e7;
        overflow: hidden;
      }
    }
    .scenarioProperties {
      background-color: #475669;
      color: #fff;
      text-indent: 10px;
    }
  }
}
</style>