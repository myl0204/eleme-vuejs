import Vue from 'vue'
import Router from 'vue-router'
import Goods from '@@/goods/Goods'
import Rating from '@@/rating/Rating'
import Seller from '@@/seller/Seller'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/rating',
      name: 'Rating',
      component: Rating
    },
    {
      path: '/seller',
      name: 'Seller',
      component: Seller
    }
  ]
})
