<template>
  <div class="editIconWrapper">
    <div class="title">
      <Title>
        <template #TitleBox>编辑图标</template>
      </Title>
    </div>
    <div class="editIconContainer">
      <div class="iconbox" v-for="(item,index) in iconList" :key="index">
        <p class="iconTitle">{{item[0][0].parentId}}</p>
        <ul>
          <li v-for="(i,j) in item" :key='j'>
            <div class="iconChose">
              <div class="checkIcon">
                <div v-for="(k,l) in i" :key='l'>
                  <span>{{k.deviceStatus=='1'?'选中':'未选中'}}</span>
                  <img :src="k.icon" alt="">
                </div>
              </div>
            </div>
            <p>设备名称：
              <span>{{i[0].deviceTypeName}}</span>
            </p>
            <p>设备编码：
              <span>00001</span>
            </p>
            <div class="iconHandle">
              <i class="el-icon-edit" @click="clickEdit(i)"></i>
              <el-dialog title="修改图标" :visible.sync="dialogUpDateIconFormyVisible">
                <el-form :model="updateIconForm">
                  <el-form-item label="选择图标" :label-width="formLabelWidth">
                    <el-radio v-model="updateIconForm.deviceStatus" label="1" :disabled='editChoseDeviceStatus' @change="editChoseIcon()">修改选中状态的图标</el-radio>
                    <el-radio v-model="updateIconForm.deviceStatus" label="2" :disabled='editChoseDeviceStatus' @change="editChoseIcon()">修改未选中状态的图标</el-radio>
                  </el-form-item>
                  <el-form-item label="设备名称" :label-width="formLabelWidth">
                    <el-input v-model="updateIconForm.deviceTypeName" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="设备类型" :label-width="formLabelWidth">
                    <el-input v-model="updateIconForm.deviceTypeCode" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="图标地址" :label-width="formLabelWidth" class="updateNewIcon">
                    <el-input v-model="updateIconForm.icon" autocomplete="off"></el-input>
                    <el-upload class="upload-demo" :action="getIp" :show-file-list="false" :on-success="handleEditSuccess" :before-upload="beforeAvatarUpload">
                      <el-button type='primary'>上传</el-button>
                    </el-upload>

                  </el-form-item>
                  <el-form-item label="系统标识" :label-width="formLabelWidth">
                    <el-input v-model="updateIconForm.system" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogUpDateIconFormyVisible = false">取 消</el-button>
                  <el-button type="primary" @click="sureUpdateIcon()">确 定</el-button>
                </div>
              </el-dialog>
              <i class="el-icon-delete" @click="clickDelete(i)"></i>
              <el-dialog title="删除图标" :visible.sync="dialogDeleteIconFormyVisible">
                <el-form :model="deleteIconForm">
                  <el-form-item label="选择状态" :label-width="formLabelWidth">
                    <el-radio v-model="deleteIconForm.deviceStatus" label="1">选中</el-radio>
                    <el-radio v-model="deleteIconForm.deviceStatus" label="2">未选中</el-radio>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogDeleteIconFormyVisible = false">取 消</el-button>
                  <el-button type="primary" @click="sureDeleteIcon()">确 定</el-button>
                </div>
              </el-dialog>
            </div>
          </li>
          <li class="uploadIcon">
            <el-upload class="avatar-uploader" :action="getIp" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog title="增加图标" :visible.sync="dialogUploadFormyVisible">
      <el-form :model="uploadForm">
        <el-form-item label="设备状态" :label-width="formLabelWidth">
          <el-radio v-model="uploadForm.deviceStatus" label="1">选中</el-radio>
          <el-radio v-model="uploadForm.deviceStatus" label="2">未选中</el-radio>
        </el-form-item>
        <el-form-item label="设备名称" :label-width="formLabelWidth">
          <el-input v-model="uploadForm.deviceTypeName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" :label-width="formLabelWidth">
          <el-input v-model="uploadForm.deviceTypeCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父节点" :label-width="formLabelWidth">
          <el-input v-model="uploadForm.parentId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标地址" :label-width="formLabelWidth">
          <el-input v-model="uploadForm.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="系统标识" :label-width="formLabelWidth">
          <el-input v-model="uploadForm.system" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadFormyVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureUpload()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Title from "../../../components/Title";
import {
  ip,
  imgIp,
  addIcon,
  listIcon,
  updateIcon,
  deletedIcon
} from "@/apis/upload";
import { compare, getStr } from "@/utils/publictool";
export default {
  components: {
    Title
  },
  data() {
    return {
      formLabelWidth: "100px",
      dialogUploadFormyVisible: false,
      uploadForm: {}, //新增图标
      iconList: [], //图标数组
      updateIconForm: {}, // 修改图标
      dialogUpDateIconFormyVisible: false,
      updateIconArray: [],
      editChoseDeviceStatus: false, //只有一个图标的时候禁用选择
      dialogDeleteIconFormyVisible: false, //删除图标
      deleteIconForm: {}
    };
  },
  created() {
    this.getIconList();
  },
  computed: {
    getIp() {
      return ip;
    }
  },
  methods: {
    // 上传成功
    handleAvatarSuccess(res, file) {
      // console.log(imgIp);
      this.dialogUploadFormyVisible = true;
      this.uploadForm.icon = res.result;
      // console.log(res);
      console.log(file);
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
    },
    //确定上传
    sureUpload() {
      addIcon(this.uploadForm)
        .then(res => {
          console.log(res);
          if (res.httpStatus == 200) {
            this.dialogUploadFormyVisible = false;
            this.$message({
              type: "success",
              message: "添加成功"
            });
            this.getIconList();
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
    // 请求图标列表
    getIconList() {
      this.iconList = [];
      listIcon()
        .then(res => {
          console.log(res);
          if (res.httpStatus == 200) {
            // 分类
            Object.values(
              res.result.reduce((res1, item) => {
                res1[item.parentId]
                  ? res1[item.parentId].push(item)
                  : (res1[item.parentId] = [item]);
                return res1;
              }, {})
            ).forEach(ele => {
              this.iconList.push(
                Object.values(
                  ele.reduce((res2, item) => {
                    res2[item.deviceTypeName]
                      ? res2[item.deviceTypeName].push(item)
                      : (res2[item.deviceTypeName] = [item]);
                    return res2;
                  }, {})
                )
              );
            });
            // 排序
            this.iconList.forEach(item => {
              item.forEach(ele => {
                ele.sort(compare("deviceStatus"));
              });
            });
            // 同一处理图片路径
            this.iconList.forEach(item => {
              item.forEach(ele => {
                ele.forEach(i => {
                  i.icon = imgIp + i.icon;
                  i.deviceStatus = i.deviceStatus.toString();
                });
              });
            });
            console.log(this.iconList);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //修改图标
    clickEdit(item) {
      this.dialogUpDateIconFormyVisible = true;
      this.updateIconForm = Object.assign({}, item[0]);
      console.log(this.updateIconForm.icon)
      console.log(getStr(this.updateIconForm.icon,'image?url='))
      if (item.length <= 1) {
        this.editChoseDeviceStatus = true;
      } else {
        this.editChoseDeviceStatus = false;
        this.updateIconArray = item;
      }
    },
    //选择图标状态
    editChoseIcon() {
      this.updateIconForm =
        this.updateIconForm.deviceStatus == "1"
          ? Object.assign({}, this.updateIconArray[0])
          : Object.assign({}, this.updateIconArray[1]);
    },
    //修改的重新上传
    handleEditSuccess(res) {
      this.updateIconForm.icon = res.result;
    },
    // 确定修改
    sureUpdateIcon() {
      this.updateIconForm.icon = getStr(this.updateIconForm.icon, "image?url=");
      console.log(this.updateIconForm.icon);
      updateIcon(this.updateIconForm)
        .then(res => {
          if (res.httpStatus == 200) {
            this.dialogUpDateIconFormyVisible = false;
            this.getIconList();
            this.$message({
              type: "success",
              message: "修改成功"
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
    //删除图标
    clickDelete(item) {
      console.log(item);
      this.dialogDeleteIconFormyVisible = true;
      this.updateIconArray = item;
    },
    // 确定删除
    sureDeleteIcon() {
      let deviceTypeId = "";
      if (this.updateIconArray.length > 1) {
        deviceTypeId =
          this.deleteIconForm.deviceStatus == "1"
            ? this.updateIconArray[0].deviceTypeId
            : this.updateIconArray[1].deviceTypeId;
      } else {
        deviceTypeId = this.updateIconArray[0].deviceTypeId;
      }
      deletedIcon({ deviceTypeId })
        .then(res => {
          if (res.httpStatus == 200) {
            this.dialogDeleteIconFormyVisible = false;
            this.getIconList();
            this.$message({
              type: "success",
              message: "删除成功"
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
    }
  }
};
</script>

<style lang="less" scoped>
.editIconWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    width: 100%;
    flex: 0 0 56px;
  }
  .editIconContainer {
    flex: 1;
    width: 100%;
    background-color: #f4f4f4;
    // display: flex;
    font-size: 14px;
    line-height: 20px;
    padding: 0 0 20px 0;
    box-sizing: border-box;
    overflow: auto;
    .iconbox {
      width: 100%;
      margin-top: 10px;
      .iconTitle {
        background-color: #e4e8f1;
        padding: 3px 5px;
        // margin-bottom: 10px;
      }
      ul {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding: 0 0 10px 0;
        // justify-content: space-around;
        li {
          //   width: 90px;
          border: 1px solid #e4e8f1;
          font-size: 12px;
          padding: 10px 5px;
          line-height: 26px;
          margin-left: 20px;
          margin-top: 10px;
          .iconChose {
            .checkIcon {
              display: flex;
              justify-content: space-around;
              & > div {
                display: flex;
                flex-direction: column;
                align-items: center;
                img {
                  width: 32px;
                  height: 32px;
                  border: 1px solid red;
                }
              }
            }
          }
          .iconHandle {
            line-height: 30px;
            display: flex;
            justify-content: center;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            i:hover {
              cursor: pointer;
              background-color: #f4f4f4;
            }
            .updateNewIcon {
              position: relative;
              .upload-demo {
                height: 0;
              }
              .el-button {
                position: absolute;
                right: 0;
                top: 0;
              }
            }
          }
        }
        .uploadIcon {
          width: 90px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 30px;
        }
      }
    }
  }
}
</style>