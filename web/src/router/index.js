// import { createRouter, createWebHistory } from 'vue-router'


// const routes = [
  
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// export default router
import { createRouter, createWebHistory } from 'vue-router'
import PkIndex from '../views/pk/PkIndex'
import NotFound from '../views/error/NotFound'
import RanklistIndex from '../views/ranklist/RanklistIndex'
import UserBotIndex from '../views/user/bots/UserBotIndex'
import RecordIndex from '../views/record/RecordIndex'


const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/pk/"
  },
  {
    path: "/pk/",
    name: "pk_index",
    component: PkIndex,
  },
  {
    path: "/ranklist/",
    name: "RanklistIndex",
    component: RanklistIndex,
  },
  {
    path: "/user/bots/",
    name: "UserBotIndex",
    component: UserBotIndex,
  },
  {
    path: "/record/",
    name: "RecordIndex",
    component: RecordIndex,
  },
  {
    path: "/404/",
    name: "404",
    component: NotFound,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404/",
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
