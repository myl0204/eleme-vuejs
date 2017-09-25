<template>
  <div class="shop-cart-wrapper">
    <div class="content">
      <div class="content-left" @click="toggleList">
        <div class="shopping-cart-logo">
          <div class="logo" :class="{highlight:hasFood}">
            <i class="icon-shopping_cart" :class="{highlight:hasFood}"></i>
          </div>
        </div>
        <div class="total-price" :class="{highlight:hasFood}">￥{{totalPrice}}</div>
        <div class="delivery-price">另需配送费￥{{deliveryPrice}}</div>
      </div>
      <div class="content-right">
        <div class="payment" :class="{highlight:totalPrice>=minPrice}">{{payInfo}}</div>
      </div>
      <div class="count" v-show="hasFood">{{totalCount}}</div>
    </div>
    <transition-group name="drop" key="ball_drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
      <div class="ball"  v-for="(ball,index) in balls" v-show="ball.show" :key="('ball-'+index)">
        <div class="inner"></div>
      </div>
    </transition-group>
    <transition name="slide">
      <div class="selected-list" v-show="show && hasFood">
        <div class="list-header">
          <span class="clear" @click="emptyList">清空</span>
          <h2 class="title">购物车</h2>
        </div>
        <div class="list-content" ref="list-content">
          <ul>
            <li class="selected-item" v-for="food in selectedFoods">
              <div class="amount-wrapper">
                <Amount :food="food" @drop="dropBall" @delFood="refreshList"></Amount>
              </div>
              <span class="price">￥{{food.price * food.count}}</span>
              <div class="foodname">{{food.name}}</div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="mask_fade">
      <div class="list-mask" v-show="show && hasFood" @click="closeList"></div>
    </transition>
  </div>
</template>

<script>
import eventBus from '@/js/eventBus.js'
import Amount from '@@/amount/Amount'
import BScroll from 'better-scroll'

export default {
  props: {
    deliveryPrice: {
      type: Number,
      defalut: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectedFoods: {
      type: Array
    }
  },
  data() {
    return {
      show: false,
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      droppingBalls: []
    }
  },
  created() {
    eventBus.$on('drop', (el) => {
      this.dropBall(el)
    })
    this.$nextTick(() => {
      this.selectedFoodScroll = new BScroll(this.$refs['list-content'], {
        click: true
      })
    })
  },
  computed: {
    hasFood() {
      return this.totalCount > 0
    },
    totalPrice() {
      let price = 0
      this.selectedFoods.forEach((food) => {
        price += food.price * food.count
      })
      return price
    },
    totalCount() {
      let count = 0
      this.selectedFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payInfo() {
      if (this.totalCount === 0) {
        return `￥${this.minPrice}起送`
      } else if (this.totalPrice < this.minPrice) {
        return `还差￥${this.minPrice - this.totalPrice}起送`
      } else {
        return `去支付`
      }
    }
  },
  methods: {
    toggleList() {
      if (this.totalCount > 0) {
        this.show = !this.show
        this.$nextTick(() => {
          this.refreshList()
        })
      }
    },
    emptyList() {
      this.selectedFoods.forEach((food) => {
        food.count = 0
      })
      this.closeList()
    },
    closeList() {
      this.show = false
    },
    refreshList() {
      if (this.hasFood) {
        this.$nextTick(() => {
          this.selectedFoodScroll.refresh()
        })
      } else {
        this.closeList()
      }
    },
    dropBall(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.el = el
          ball.show = true
          this.droppingBalls.push(ball)
          return
        }
      }
    },
    beforeEnter(el) {
      let len = this.balls.length
      while (len--) {
        let ball = this.balls[len]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 20)
          el.style.transform = `translate3d(0,${y}px,0)`
          let inner = el.getElementsByClassName('inner')[0]
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    enter(el, done) {
      /* eslint-disable no-unused-vars */
      el.offsetHeight
      this.$nextTick(() => {
        el.style.transform = 'translate3d(0px, 0, 0)'
        let inner = el.getElementsByClassName('inner')[0]
        inner.style.transform = `translate3d(0, 0, 0)`
      })
      setTimeout(done, 399)
    },
    afterEnter(el) {
      let ball = this.droppingBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    }
  },
  components: {
    Amount
  }
}
</script>

<style lang="scss">
@import '../../common/scss/mixin';

  .shop-cart-wrapper {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 46px;
    z-index: 10;
    .content {
      display:flex;
      height: 100%;
      background-color: #141d27;
      .content-left {
        flex: 1;
        .shopping-cart-logo {
          position: relative;
          top: -10px;
          display: inline-block;
          width: 56px;
          height: 56px;
          margin: 0 12px;
          padding: 6px;
          box-sizing: border-box;
          border-radius: 50%;
          background-color: #141d27;
          .logo {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            text-align: center;
            background-color: #2b343c;
            &.highlight {
              background-color: rgb(0, 160, 220)
            }
            .icon-shopping_cart {
              font-size: 24px;
              line-height: 44px;
              color: #80858a;
              &.highlight {
                color: #fff
              }
            }
          }
          
        }
        .total-price {
          display: inline-block;
          vertical-align: top;
          margin: 12px 12px 0 0;
          padding-right: 12px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.2);
          font-weight: 700;
          line-height: 24px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          &.highlight {
            color: #fff
          }
        }
        .delivery-price {
          display: inline-block;
          vertical-align: top;
          margin-top: 12px;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          line-height: 24px;
        }
      }
      .content-right {
        flex: 0 0 105px;
        height: 100%;
        text-align: center;
        @media only screen and (max-width: 320px) {
          flex: 0 0 85px;
        }
        .payment {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          line-height: 46px;
          background-color: #2b333b;
          &.highlight {
            color: #fff;
            background-color: #00b43c;
          }
        }
      }
      .count {
        position: absolute;
        left: 44px;
        top: -8px;
        width: 24px;
        height: 16px;
        font-size: 9px;
        font-weight: 700;
        color: #fff;
        line-height: 16px;
        text-align: center;
        border-radius: 8px;
        background-color: rgb(240, 20, 20);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
      }
    }
    .ball {
      position: fixed;
      left: 32px;
      bottom: 20px;
      &.drop-enter-active {
        transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
      }
      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: rgb(0, 160, 220);
        transition: all .4s linear
      }
    }
    .selected-list {
      position: absolute;
      left: 0;
      bottom: 46px;
      width: 100%;
      background-color: #fff;
      z-index: -1;
      &.slide-enter, &.slide-leave-to {
        transform: translateY(100%)
      }
      &.slide-enter-active, &.slide-leave-active {
        transition: all 0.5s
      }
      .list-header {
        height: 40px;
        background-color: #f3f5f7;
        padding: 0 18px;
        @include border-1px;
        .title {
          overflow: hidden;
          font-size: 14px;
          font-weight: 700;
          color: rgba(7, 17, 27, 0.9);
          line-height: 40px
        }
        .clear {
          float: right;
          font-size: 12px;
          color: rgb(0, 160, 220);
          line-height: 40px;
        }
      }
      .list-content {
        max-height: 218px;
        overflow: hidden;
        .selected-item {
          // width: 100%;
          height: 48px;
          margin: 0 18px;
          padding: 12px 0;
          box-sizing: border-box;
          @include border-1px;
          .foodname {
            font-size: 14px;
            color: rgb(7, 17, 27);
            line-height: 24px;
            overflow: hidden;
          }
          .price {
            float: right;
            margin: 0 12px 0 18px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(240, 20, 20);
          }
          .amount-wrapper {
            position: relative;
            bottom: 6px;
            float: right;

          }
        }
      }
      
    }
    .list-mask {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(7, 17, 27, 0.6);
      backdrop-filter:blur(10px);
      z-index: -2;
      overflow: hidden;
      &.fade-enter, &.fade-leave-to {
        opacity: 0;
      }
      &.fade-enter-active, &.fade-leave-active {
        transition: all 0.5s
      }
    }
  }
</style>
