<template>
  <div class="areaWrapper">
    <div class="title">
      <Title>
        <template #TitleBox>区域列表</template>
      </Title>
    </div>
    <div class="areaContainer">
      <div class="left">
        <div class="searchArea">
          <el-input placeholder="请输入内容" v-model="searchArea" clearable size="small">
          </el-input>
          <el-button size="mini" type="primary">搜索</el-button>
        </div>
        <div class="projects">
          <div class="project" v-for="(item,index) in siteList" :key="index">
            <div class="projectTop">
              <div>
                项目名：
                <span>{{item.siteName}}</span>
              </div>
              <div>
                创建时间：
                <span>{{item.createTime}}</span>
              </div>
            </div>
            <div>
              <el-button type='primary'>编辑位置</el-button>
            </div>
            <!-- <div class="useTime">
              使用时限：
              <span></span>
            </div>
            <div class="describe">
              项目描述：
              <span></span>
            </div> -->
          </div>
          <div class="projectPaging">
            <el-pagination background layout="prev, pager, next" :total="siteTotal" :pager-count='pageCount' @current-change='changeSitePage' :page-size='sitetNum' :current-page.sync='sitetCurrentPage'>
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="middle">
        <div class="systemList">
          <div class="system">
            <div class="systemIcon">
              <img src="../../../assets/logo.png" alt="" class="systemImg">
            </div>
            <div class="systemContainer">
              <div class="systemTitle">
                <span>火灾自动报警系统</span>
              </div>
              <div class="systemDescribe">
                是撒达斯北大街号大号大嘎啥的嘎红色的vas与的VS啊u的VSadv深渊大撒到VS阿含经
              </div>
            </div>
          </div>
          <div class="systemPaging">
            <!-- <el-pagination background layout="prev, pager, next" :total="projectTotal" :pager-count='projectPagingCount'>
            </el-pagination> -->
          </div>
        </div>
      </div>
      <div class="right">
        <div class="unit" v-for="(item,index) in unit" :key="index">
          <p class="unitName">
           单位： {{item.name}}
          </p>
          <div class="site" v-for="(i,j) in item.sites" :key="j">
            <p class="siteName"> 站点：{{i.siteName}}</p>
            <div class="area">
              <el-tree :data="i.areas" node-key="id" default-expand-all :props="defaultProps">
                <span class="custom-tree-node" slot-scope="{node}">
                  <span>{{node.label }}</span>
                  <span>
                    <span class="el-icon-circle-plus-outline operation" @click="clickBtnCircle($event,node.key)">
                    </span>
                    <span class="el-icon-edit operation" @click="clickBtnEdit($event,node.parent.key)">
                    </span>
                    <span class="el-icon-remove-outline operation" @click="clickBtnRemove($event,node.key)">
                    </span>
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../../../components/Title";
import { pageFactorySite } from "@/apis/unitSite";
import { getKey } from "@/utils/local";
import { listSelfFactoryRegionalByUserId } from "@/apis/area";
export default {
  components: {
    Title
  },
  data() {
    return {
      searchArea: "", //搜索区域
      siteTotal: 10, //总条数
      sitetNum: 4,
      sitetCurrentPage: 1,
      pageCount: 5, //显示的页码数
      siteList: [],
      unit: [],
      defaultProps: {
        id: "id",
        children: "children",
        label: "label"
      }
    };
  },
  created() {
    this.changeSitePage(this.sitetCurrentPage);
    this.getArea();
  },
  methods: {
    //站点分页
    changeSitePage(val) {
      val = val <= 0 ? 1 : val;
      pageFactorySite({
        size: this.sitetNum,
        start: val,
        factoryId: getKey("userInfor".factoryId)
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.siteTotal = res.result.countRows;
            this.siteList = res.result.result;
            // console.log(res);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取区域
    getArea() {
      listSelfFactoryRegionalByUserId({ userId: getKey("userInfor").userId })
        .then(res => {
          if (res.httpStatus == 200) {
            console.log(res);
            this.unit = res.result;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //tree添加
    clickBtnCircle(e, key) {
      e.stopPropagation();
      console.log(key);
    },
    // tree 编辑
    clickBtnEdit(e, key) {
      e.stopPropagation();
      console.log(key);
      //判断是否为undefind，是的话则其没有父级
    },
    //tree 删除
    clickBtnRemove(e, key) {
      e.stopPropagation();
      console.log(key);
    }
  }
};
</script>

<style lang="less" scoped>
.areaWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    width: 100%;
    flex: 0 0 56px;
  }
  .areaContainer {
    flex: 1;
    width: 100%;
    background-color: #f4f4f4;
    font-size: 14px;
    line-height: 20px;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    .left {
      height: 100%;
      flex: 0 0 370px;
      .searchArea {
        display: flex;
        .el-button {
          margin: 0 20px;
        }
      }
      .projects {
        width: 350px;
        border-top: 2px solid #e7e7e7;
        box-sizing: border-box;
        margin-top: 20px;
        line-height: 20px;
        position: relative;
        .project {
          margin-top: 20px;
          padding: 20px 5px;
          border-bottom: 2px solid #e7e7e7;
          background-color: #fff;
          .projectTop {
            display: flex;
            justify-content: space-between;
          }
        }
        .projectPaging {
          position: absolute;
          bottom: -60px;
          left: 0;
        }
      }
    }
    .middle {
      height: 100%;
      flex: 0 0 370px;
      margin: 0 10px;
      .systemList {
        margin-top: -10px;
        position: relative;
        .system {
          display: flex;
          background-color: #fff;
          padding: 20px 0;
          margin-top: 10px;
          .systemIcon {
            flex: 0 0 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            .systemImg {
              width: 40px;
              height: 40px;
            }
          }
          .systemContainer {
            flex: 1;
            padding: 0 5px 0 0;
            .systemTitle {
              font-size: 20px;
              line-height: 30px;
            }
            .systemDescribe {
              line-height: 16px;
            }
          }
        }
        .systemPaging {
          position: absolute;
          left: 0;
          bottom: -60px;
        }
      }
    }
    .right {
      height: 100%;
      flex: 1;
      background-color: #fff;
      padding: 10px;
      .el-tree {
        .operation {
          font-size: 14px;
          margin-left: 20px;
        }
      }
      .unit{
        border: 1px solid #f2f2f2;
        margin-top: 10px;
        .unitName{
            font-size: 16px;
        }
        .site{
          .siteName{
            text-indent: 5px;
          }
        }
      }
    }
  }
}
</style>
