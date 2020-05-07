<template>
  <div class="editAreaWrapper">
    <div class="title">
      <Title>
        <template #TitleBox>用户管理</template>
      </Title>
    </div>
    <div class="editAreaContainer">
      <div class="left">
        <div class="donotkonw"></div>
        <div class="searchProject">
          <el-input placeholder="请输入内容" v-model="searchProject" clearable size="small">
          </el-input>
          <el-button size="mini" type="primary">搜索</el-button>
        </div>
        <div class="projects">
          <div class="projectInfor" v-for="(item,index) in projectLists" :key="index">
            <div class="project">
              <span class="projectName">{{item.siteName}}</span>
              <span>创建时间：
                <span>{{item.createTime}}</span>
              </span>
            </div>
            <div class="projecttTime">
              使用期限：
              <span>2年</span>
            </div>
            <div class="owner">业主单位：
              <span></span>
            </div>
            <div class="maintenance">维保单位：
              <span></span>
            </div>
            <div class="regulatory">监管单位：
              <span></span>
            </div>
            <div class="partner">伙伴单位：
              <span></span>
            </div>
          </div>
          <div class="projectPaging">
            <el-pagination background layout="prev, pager, next" :total="projectTotal" :pager-count="pageCount" :page-size='projectCurrentNum' :current-page.sync='projectCurrentPage' @current-change='projectCurrentChange'>
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="userScreening">
          <div class="enterpriseTypeWrapper">
            <div class="enterpriseType">
              <span :class="{'currentEnterpriseType':index==enterpriseTypeNum}" @click='checkedEnterpriseType(index)' v-for="(item,index) in enterpriseTypeList" :key="item">{{item}}</span>
            </div>
            <el-button type="primary">批量导入</el-button>
          </div>
          <div class="roleWrapper">
            <LinePressing>
              <template #line>角色</template>
              <template #container>
                <div class="companyRole">
                  <span class="companyRoleTit">公司角色：</span>
                  <div class="companyRoleContainer">
                    <span v-for="(item,index) in companyRoleList" :key="index" :class="{'checkedRole' : index===currentCompanyRole}" @click="checkedRole(index,'currentCompanyRole')">{{item}}</span>
                  </div>
                </div>
                <div class="projectRole">
                  <span class="projectRoleTit">项目角色：</span>
                  <div class="projectRoleContainer">
                    <span v-for="(item,index) in projectRoleList" :key="index" :class="{'checkedRole' : index===currentProjectRole}" @click="checkedRole(index,'currentProjectRole')">{{item}}</span>
                    <label>+</label>
                  </div>
                </div>
              </template>
            </LinePressing>
          </div>
          <div class="areaWrapper">
            <LinePressing>
              <template #line>区域</template>
              <template #container>
                <div class="screenArea">
                  <span>全国</span>
                  <el-select v-model="value" clearable placeholder="省/直辖市/自治区/特别行政区" class="province">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="value" clearable placeholder="州/市" class="municipal">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="value" clearable placeholder="区/县" class="county">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <el-button type="primary">搜索</el-button>
                </div>
                <div class="importForm">
                  <el-checkbox v-model="importFormChecked"></el-checkbox>
                  <el-button type="primary">Excel导入人员信息</el-button>
                  <el-button type="primary">添加服务区域</el-button>
                </div>
              </template>
            </LinePressing>
          </div>
        </div>
        <div class="userList">
          <div class="addUser">
            <el-button type="primary" @click="dialogAdduserFormVisible = true">新增用户</el-button>
            <el-dialog title="新增用户" :visible.sync="dialogAdduserFormVisible">
              <el-form :model="addUserForm">
                <el-form-item label="昵称" :label-width="formLabelWidth">
                  <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth">
                  <el-input v-model="addUserForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证" :label-width="formLabelWidth">
                  <el-input v-model="addUserForm.idcard" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                  <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机" :label-width="formLabelWidth">
                  <el-input v-model="addUserForm.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="系统" :label-width="formLabelWidth">
                  <el-radio v-model="addUserForm.system" label="1" @change="choseSystem(addUserForm.system)">预警系统</el-radio>
                  <el-radio v-model="addUserForm.system" label="50" @change="choseSystem(addUserForm.system)">平台系统</el-radio>
                </el-form-item>
                <el-form-item label="单位" :label-width="formLabelWidth">
                  <el-select v-model="addUserForm.factoryId" placeholder="请选择单位" @change="choseUnit(addUserForm.factoryId)">
                    <el-option v-for="(item,index) in unitOptions" :key="index" :label="item.value" :value="item.lable">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth">
                  <el-select v-model="addUserForm.role" placeholder="请选择角色" @change="choseRole(addUserForm.role)">
                    <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.roleName" :value="item.roleId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="站点" :label-width="formLabelWidth">
                  <el-select v-model="addUserForm.site" placeholder="请选择站点" @change="choseSite(addUserForm.site)">
                    <el-option v-for="(item,index) in siteOptions" :key="index" :label="item.siteName" :value="item.siteId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAdduserFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureAddUser()">提 交</el-button>
              </div>
            </el-dialog>
            <div class="searchUser">
              <el-input placeholder="搜索用户" prefix-icon="el-icon-search" v-model="userInput">
              </el-input>
              <el-button type="primary" size="small">搜索</el-button>
            </div>
          </div>
          <div class="userInforList">
            <div class="userInfor" v-for="(item,index) in userList" :key="index">
              <div class="userInforHeader">
                <div class="headPortrait"><img src="" alt=""></div>
                <div class="PersonalInformation">
                  <p>
                    姓名：
                    <span>{{item.username}}</span>
                  </p>
                  <p>电话：
                    <span>{{item.phone}}</span>
                  </p>
                  <p>邮箱：
                    <span>{{item.email}}</span>
                  </p>
                  <p>在职情况：
                    <span>{{item.leave}}</span>
                  </p>
                  <p>
                    单位：
                    <span>{{item.factoryName}}</span>
                  </p>
                </div>
              </div>
              <div class="operation">
                <el-button type="primary" icon="el-icon-edit" circle @click="editUserInfor(item.userId)"></el-button>
                <el-dialog title="修改信息" :visible.sync="dialogUserInforFormModifyVisible">
                  <el-form :model="userInforForm">
                    <el-form-item label="姓名" :label-width="formLabelWidth">
                      <el-input v-model="userInforForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" :label-width="formLabelWidth">
                      <el-input v-model="userInforForm.phone" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称" :label-width="formLabelWidth">
                      <el-input v-model="userInforForm.username" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证" :label-width="formLabelWidth">
                      <el-input v-model="userInforForm.idcard" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="离职" :label-width="formLabelWidth">
                      <el-input v-model="userInforForm.leave" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth">
                      <el-input v-model="userInforForm.email" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" :label-width="formLabelWidth">
                      <el-input v-model="userInforForm.description" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="系统" :label-width="formLabelWidth">
                      <el-radio v-model="userInforForm.system" label="1" @change="editChoseSystem(userInforForm.system)">预警系统</el-radio>
                      <el-radio v-model="userInforForm.system" label="50" @change="editChoseSystem(userInforForm.system)">平台系统</el-radio>
                    </el-form-item>
                    <el-form-item label="单位" :label-width="formLabelWidth">
                      <el-select v-model="userInforForm.unit" placeholder="请选择单位" @change="editChoseUnit(userInforForm.unit)">
                        <el-option v-for="(item,index) in unitLists" :key="index" :label="item.name" :value="item.factoryId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="角色" :label-width="formLabelWidth">
                      <el-select v-model="userInforForm.role" placeholder="">
                        <el-option v-for="(item,index) in roleLists" :key="index" :label="item.roleName" :value="item.roleId">
                          <span style="float: left;color:#000">{{ item.roleName }}</span>
                          <span style="float: right;">
                            <el-button type="success" icon="el-icon-check" circle size="mini" @click="addUserRole($event,item)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteUserRole($event,item.userRoleId)"></el-button>
                          </span>
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="站点" :label-width="formLabelWidth">
                      <el-select v-model="userInforForm.site" placeholder="">
                        <el-option v-for="(item,index) in siteLists" :key="index" :label="item.siteName" :value="item.siteId">
                          <span style="float: left;color:#000">{{ item.siteName }}</span>
                          <span style="float: right;">
                            <el-button type="success" icon="el-icon-check" circle size="mini" @click="addUserSite($event,item)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteUserSite($event,item.authServiceId)"></el-button>
                          </span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogUserInforFormModifyVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureModifyUserInfo()">确 定</el-button>
                  </div>
                </el-dialog>

                <el-button type="danger" icon="el-icon-delete" circle @click="deleteUserInfor(item.userId)"></el-button>
              </div>
            </div>

          </div>
          <div class="userInforPaging">
            <el-pagination background layout="prev, pager, next" :total="userListTotal" :pager-count="pageCount" :page-size='userCurrentNum' :current-page.sync='userCurrentPage' @current-change='userCurrentChange'>
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../../../components/Title";
import LinePressing from "../../../components/LinePressing";
import {
  // getProjects,
  addUser,
  getlistUsers,
  deletedUser,
  getUserInfor,
  addUserRole,
  addUserSite,
  deletedUserRole,
  deletedUserSite,
  updateUser,
  pageSelfAllSitesByFactory
} from "@/apis/user";
import { getKey } from "@/utils/local";
// import { getTime } from "@/utils/publictool";
import { getFactoryList } from "@/apis/unit";
import { getRoles } from "@/apis/role";
import { getListFactorySite } from "@/apis/unitSite";
export default {
  components: {
    Title,
    LinePressing
  },
  data() {
    return {
      searchProject: "",
      enterpriseTypeList: ["政企", "维保", "伙伴", "监管"], //企业类型列表
      enterpriseTypeNum: 0, //控制选中的企业类型
      companyRoleList: ["项目经理", "负责人", "法人"], //公司角色
      projectRoleList: ["项目经理", "负责人", "法人"], //项目角色
      currentCompanyRole: 0, //控制选中的公司角色
      currentProjectRole: 0, //控制选中的项目角色
      userInput: "", //搜索用户
      formLabelWidth: "100px", //对话框表格标题名宽度
      dialogAdduserFormVisible: false, //控制新增用户页面显示，隐藏
      addUserForm: {
        //新增用户表单
        factoryId: "",
        idcard: "",
        name: "",
        password: "",
        phone: "",
        username: "",
        // system: "",
        userRoles: [],
        userSites: []
      },
      unitOptions: [], //单位数组
      roleOptions: [], // 角色数组
      siteOptions: [], // 单位站点数组
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎saagajsdasjsjadjaad"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "", //三级联动value
      importFormChecked: true, //导入单选
      projectLists: [], //项目列表
      projectTotal: 0, //项目列表总条数
      projectCurrentNum: 4, //项目列表每页展示的条数
      projectCurrentPage: 1, //项目列表当前页
      pageCount: 5, //超过5页折叠
      userListTotal: 0, // 用户列表分页数据总条数
      userCurrentPage: 1, //当前页码
      userCurrentNum: 8, //每页显示的条数
      userList: [], //用户列表
      dialogUserInforFormModifyVisible: false, //用户信息
      userInforForm: {},
      roleLists: [], // 编辑角色数组
      unitLists: [], // 编辑单位数组
      siteLists: [] // 编辑站点数组
    };
  },
  created() {
    this.projectCurrentChange(this.projectCurrentPage)
    // 获取用户列表
    this.userCurrentChange(this.userCurrentPage);
  },
  computed: {},
  methods: {
    //站点分页
    projectCurrentChange(val) {
      val = val <= 0 ? 1 : val;
      pageSelfAllSitesByFactory({
        size: this.projectCurrentNum,
        start: val,
        factoryId: getKey("userInfor".userId)
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.projectTotal = res.result.countRows;
            this.projectLists = res.result.result;
            console.log(res);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取用户列表
    checkedEnterpriseType(index) {
      //选择企业类型
      this.enterpriseTypeNum = index;
    },
    checkedRole(index, type) {
      if (type === "currentCompanyRole") {
        this.currentCompanyRole = index;
      } else {
        this.currentProjectRole = index;
      }
    },
    sureAddUser() {
      //确定添加新增用户
      // 511121299539634523
      // 15298745895
      console.log(JSON.stringify(this.addUserForm));
      addUser(this.addUserForm)
        .then(res => {
          console.log(res);
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "添加成功"
            });
            this.userCurrentChange(this.userCurrentPage);
          } else {
            this.$message({
              type: "warning",
              message: "请求失败"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 选择系统之后，根据系统等到单位
    choseSystem(value) {
      getFactoryList({ system: value }) //获取单位数组
        .then(res => {
          if (res.httpStatus == 200) {
            this.unitOptions = res.result.map(item => {
              return { lable: item.factoryId, value: item.name };
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      getRoles({ system: value }) //获取角色数组
        .then(res => {
          console.log("角色", res);
          if (res.httpStatus == 200) {
            this.roleOptions = res.result;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    choseUnit(value) {
      console.log("选择单位", value);
      // 获取单位站点
      getListFactorySite({ factoryId: value })
        .then(res => {
          console.log("单位站点", res);
          if (res.httpStatus == 200) {
            this.siteOptions = res.result;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    choseRole(roleId) {
      //选中角色储存参数
      let chosedRole = this.roleOptions.filter(item => {
        if (item.roleId == roleId) {
          return item;
        }
      });
      console.log(chosedRole);
      this.addUserForm.userRoles = [
        {
          factoryId: this.addUserForm.factoryId,
          roleCode: chosedRole[0].roleCode,
          roleId: chosedRole[0].roleId,
          system: chosedRole[0].system
        }
      ];
    },
    choseSite(siteId) {
      //选中单位站点储存参数
      let chosedSite = this.siteOptions.filter(item => {
        if (item.siteId == siteId) {
          return item;
        }
      });
      this.addUserForm.userSites = [
        {
          factoryAuth: "1",
          factoryId: this.addUserForm.factoryId,
          siteId: chosedSite[0].siteId
        }
      ];
    },
    //删除用户
    deleteUserInfor(userId) {
      this.$confirm("此操作将永久删除该资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletedUser({ userId })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.userCurrentPage =
                  this.userCurrentPage >
                  (this.userListTotal - 1) / this.userCurrentNum
                    ? this.userCurrentPage - 1
                    : this.userCurrentPage;
                this.userCurrentChange(this.userCurrentPage);
              } else {
                this.$message({
                  type: "warning",
                  message: "请求失败"
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //编辑页面
    editUserInfor(userId) {
      //修改用户信息
      console.log("个人id", userId);
      this.dialogUserInforFormModifyVisible = true;
      getUserInfor({ userId }) //获取当前选中用户的信息
        .then(res => {
          console.log(res);
          if (res.httpStatus == 200) {
            this.userInforForm = res.result;
            console.log("个人信息", res.result);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    editChoseSystem(value) {
      //选中系统之后
      getRoles({ system: value }) //获取角色数组
        .then(res => {
          console.log("角色", res);
          if (res.httpStatus == 200) {
            this.roleLists = res.result;
          }
        })
        .catch(err => {
          console.log(err);
        });
      //获取单位数组
      getFactoryList({ system: value }) //获取单位数组
        .then(res => {
          if (res.httpStatus == 200) {
            this.unitLists = res.result;
            console.log("单位", this.unitLists);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 编辑用户信息里面的添加用户角色
    addUserRole(e, role) {
      console.log(this.userInforForm.unit);
      e.stopPropagation();

      this.$confirm("确定增加, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          if (
            this.userInforForm.unit == "" ||
            this.userInforForm.unit == undefined
          ) {
            this.$message({
              type: "warning",
              message: "请选择单位"
            });
          } else {
            addUserRole({
              ...role,
              factoryId: this.userInforForm.unit,
              userId: this.userInforForm.userId
            })
              .then(res => {
                if (res.httpStatus == 200) {
                  this.$message({
                    type: "success",
                    message: "添加成功"
                  });
                }
              })
              .catch(err => {
                console.log(err);
                this.$message({
                  type: "warning",
                  message: "请求失败"
                });
              });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //编辑用户信息里面的删除用户角色
    deleteUserRole(e, userRoleId) {
      e.stopPropagation();
      this.$confirm("确定删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          deletedUserRole({ userRoleId })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "删除"
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                type: "warning",
                message: "请求失败"
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
    //编辑用户信息里面的选择单位
    editChoseUnit(value) {
      // 获取单位站点
      getListFactorySite({ factoryId: value })
        .then(res => {
          if (res.httpStatus == 200) {
            this.siteLists = res.result;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //编辑用户信息里面的增加站点
    addUserSite(e, site) {
      e.stopPropagation();
      this.$confirm("确定增加, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          addUserSite({
            ...site,
            factoryAuth: "1"
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                type: "warning",
                message: "请求失败"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //编辑用户信息里面的删除站点
    deleteUserSite(e, authServiceId) {
      e.stopPropagation();
      deletedUserSite({ authServiceId });
    },
    // 确定修改
    sureModifyUserInfo() {
      updateUser(this.userInforForm)
        .then(res => {
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "修改成功"
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "warning",
            message: "请求失败"
          });
        });
    },
    // 分页
    userCurrentChange(val) {
      val = val <= 0 ? 1 : val;
      getlistUsers({ size: this.userCurrentNum, start: val })
        .then(res => {
          console.log(res);
          if (res.httpStatus == 200) {
            this.userList = res.result.result;
            this.userListTotal = parseInt(res.result.countRows);
          } else {
            this.$message({
              type: "warning",
              message: "请求失败1"
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "warning",
            message: "请求失败2"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.editAreaWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .title {
    width: 100%;
    flex: 0 0 56px;
  }
  .editAreaContainer {
    flex: 1;
    width: 100%;
    background-color: #f4f4f4;
    display: flex;
    font-size: 14px;
    line-height: 20px;
    .left {
      flex: 0 0 370px;
      padding: 0 10px;
      border: 1px solid #e7e7e7;
      .searchProject {
        margin: 20px 0;
        .el-input {
          width: 143px;
        }
        .el-button {
          margin-left: 10px;
        }
      }
      .projects {
        .projectInfor {
          margin-top: 20px;
          box-sizing: border-box;
          background-color: #fff;
          padding: 30px 10px 10px 10px;
          .project {
            display: flex;
            justify-content: space-between;
            .projectName {
              font-size: 18px;
            }
          }
        }
        .projectPaging {
          width: 100%;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .right {
      flex: 1;
      padding: 0 5px;
      .userScreening {
        .enterpriseTypeWrapper {
          display: flex;
          justify-content: space-between;
          padding: 10px 20px;
          .enterpriseType {
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
        }
        .roleWrapper {
          .companyRole {
            display: flex;
            .companyRoleTit {
              font-size: 16px;
              line-height: 32px;
            }
            .companyRoleContainer {
              span {
                cursor: pointer;
                display: inline-block;
                padding: 5px 10px;
                margin: 0 5px;
                border: 1px solid #e7e7e7;
                border-radius: 5px;
              }
              .checkedRole {
                border: 1px solid #409eff;
              }
            }
          }
          .projectRole {
            display: flex;
            margin-top: 10px;
            .projectRoleTit {
              font-size: 16px;
              line-height: 32px;
            }
            .projectRoleContainer {
              span {
                cursor: pointer;
                display: inline-block;
                padding: 5px 10px;
                margin: 0 5px;
                border: 1px solid #e7e7e7;
                border-radius: 5px;
              }
              label {
                cursor: pointer;
                padding: 5px 10px;
                background-color: #409eff;
                border-radius: 5px;
              }
              .checkedRole {
                border: 1px solid #409eff;
              }
            }
          }
        }
        .areaWrapper {
          .screenArea {
            span {
              display: inline-block;
              border: 1px solid #e4e4e4;
              width: 60px;
              height: 38px;
              line-height: 38px;
              text-align: center;
              background-color: #fff;
              margin: 0 20px 10px 0;
            }
            .province {
              width: 250px;
              margin: 0 20px 10px 0;
            }
            .municipal {
              margin: 0 20px 10px 0;
              width: 100px;
            }
            .county {
              margin: 0 20px 10px 0;
            }
          }
          .importForm {
            .el-button {
              margin: 0 0 0 20px;
            }
          }
        }
      }
      .userList {
        padding: 10px 0;
        position: relative;
        .el-select {
          width: 100%;
        }
        .addUser {
          height: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .searchUser {
            display: flex;
            align-items: center;
            .el-input {
              margin: 0 10px;
            }
            .el-button {
              height: 35px;
            }
          }
        }
        .userInforList {
          // padding: 20px 10px;
          padding-bottom: 60px;
          display: flex;
          // justify-content: space-around;
          flex-wrap: wrap;
          .userInfor {
            margin: 20px 20px 0 20px;
            padding: 20px 10px 10px 10px;
            width: 210px;
            padding: 10px 10px 20px 10px;
            background-color: #fff;
            box-shadow: 0 2px 2px #888888;
            .userInforHeader {
              display: flex;
              .headPortrait {
                flex: 0 0 30px;
                img {
                  width: 30px;
                  height: 30px;
                }
              }
              .PersonalInformation {
                flex: 1;
              }
            }
            .operation {
              display: flex;
              justify-content: flex-end;
              .el-button {
                padding: 5px;
              }
            }
          }
        }
        .userInforPaging {
          width: 100%;
          display: flex;
          justify-content: center;
          position: absolute;
          bottom: 20px;
        }
      }
    }
  }
}
</style>