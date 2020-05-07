import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
// import axios from '../utils/request'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: 'index',
    component: () => import( /* webpackChunkName: "about" */ '../views/Index.vue'),
    children: [
      //设备管理
      {
        path: '/index/equipment/equipmentManagement',
        name: 'equipmentManagement',
        component: () => import('../views/index/equipment/EquipmentManagement.vue')
      },
      {
        path: '/index/equipment/dtu',
        name: 'dtu',
        component: () => import('../views/index/equipment/Dtu.vue')
      },
      //地图配置
      {
        path: '/index/map/editArea',
        name: 'editArea',
        component: () => import('../views/index/map/EditArea.vue'),
        children: [{
          path: "/index/map/editArea/editMap",
          name:"editMap",
          component:()=>import('../views/index/map/editMap/EditMap.vue')
        },{
          path: "/index/map/editArea/editCad",
          name:"editCad",
          component:()=>import('../views/index/map/editMap/EditCad.vue')
        },{
          path: "/index/map/editArea/editBuilding",
          name:"editBuilding",
          component:()=>import('../views/index/map/editMap/EditBuilding.vue')
        },{
          path: "/index/map/editArea/editRegion",
          name:"editRegion",
          component:()=>import('../views/index/map/editMap/EditRegion.vue')
        }]
      },
      {
        path: '/index/map/editIcon',
        name: 'editIcon',
        component: () => import('../views/index/map/EditIcon.vue')
      },
      {
        path: '/index/map/areaList',
        name: 'areaList',
        component: () => import('../views/index/map/AreaList.vue')
      },
      //权限配置
      {
        path: '/index/permissions/RoleManagement',
        name: 'roleManagement',
        component: () => import('../views/index/permissions/RoleManagement.vue')
      },
      {
        path: '/index/permissions/resourceManagement',
        name: 'resourceManagement',
        component: () => import('../views/index/permissions/ResourceManagement.vue')
      },
      {
        path: '/index/permissions/userManagement',
        name: 'userManagement',
        component: () => import('../views/index/permissions/UserManagement.vue')
      },
      {
        path: '/index/permissions/unitManagement',
        name: 'unitManagement',
        component: () => import('../views/index/permissions/UnitManagement.vue')
      },
      {
        path: "/index/permissions/roleTemplate",
        name: "roleTemplate",
        component: () => import('../views/index/permissions/RoleTemplate.vue')
      },
      //图层配置
      {
        path: '/index/layer/internetConfiguration',
        name: 'internetConfiguration',
        component: () => import('../views/index/layer/InternetConfiguration.vue')
      },
      {
        path: '/index/layer/layerConfiguration',
        name: 'layerConfiguration',
        component: () => import('../views/index/layer/LayerConfiguration.vue')
      },
      //字典表
      {
        path: '/index/dictionary/dictionary',
        name: 'dictionary',
        component: () => import('../views/index/dictionary/Dictionary.vue')
      },
      //页面找不到
      {
        path: '*',
        name: 404,
        component: () => import('../views/404.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//路由拦截，路由守卫
// router.beforeEach((to, from, next) => {
//   if (to.path != '/') {
//     // console.log(1111,from)
//     axios.get(from.path).then(res => {
//       if (res.status == 403 || res.status == 404) {
//         next('/404')
//       } {
//         next()
//       }
//     })

//   } else {
//     next()
//   }
// })
export default router