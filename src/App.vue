<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/rating">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import util from './common/js/util.js'
import Header from '@@/header/Header'

export default {
  name: 'app',
  data() {
    return {
      seller: {
        id: (() => {
          let queryparam = util.urlParse()
          return queryparam.id
        })()
      }
    }
  },
  created() {
    this.$http.get('api/seller').then((res) => {
      res = res.body
      if (res.errno === 0) {
        this.seller = Object.assign({}, this.seller, res.data)
      }
    })
  },
  components: {
    'v-header': Header
  }
}
</script>

<style <style lang="scss">
@import 'common/scss/mixin.scss';


  .tab {
    display: flex;
    @include border-1px(rgba(7,17,27,0.1));
    .tab-item {
      flex: 1 1 0;
      height: 40px;
      text-align: center;
      line-height: 40px;

      a {
        font-size: 14px;
        text-decoration: none;
        color: rgb(77, 85, 93);
        &.active{
          color:rgb(240,20,20)
        }
      }
    }
  }

</style>

