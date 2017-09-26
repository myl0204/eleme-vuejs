<template>
  <transition name="fade" key="food_fade">
    <div class="food-wrapper" ref="foods" v-show="show">
      <div class="food" >
        <div class="image" @click="hideDetail">
          <img :src="food.image">
        </div>
        <div class="food-info-wrapper">
          <div class="food-info">
            <h2 class="name">{{food.name}}</h2>
            <div class="food-other">
              <span class="count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="food-price">
              <span class="price">￥{{food.price}}</span>
              <span class="old-price" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <transition
            :name="toggle" 
            mode="out-in" 
            @before-leave="beforeLeave" 
            @after-enter="afterEnter">
              <div class="add-cart" @click="firstAdd" v-if="cartShow && !food.count" key="add_cart">加入购物车</div>
              <div class="amount-wrapper" id="food-comp-amount" v-else key="food_amount">
                <Amount :food="food"></Amount>
              </div>
            </transition>
          </div>
        </div>
        <div class="f-divider"></div>
        <div class="food-desc-wrapper">
          <div class="food-desc" v-if="food.info">
            <h3 class="title">商品介绍</h3>
            <p class="desc">{{food.info}}</p> 
          </div>
          <div class="no-info" v-else>暂无商品介绍</div>
        </div>
        <div class="f-divider"></div>
        <RatingSelector :ratings="food.ratings" 
                        :positive="positiveRatings.length"
                        :negative="negativeRatings.length"
                        :contentFlag="contentFlag"
                        :currentType="currentType"
                        @changeRatingType="changeRatings" 
                        @onlyContent="contentOnly"
                        ><h2 class="title">商品评价</h2></RatingSelector>
        <div class="ratinglist">
          <ul>
            <li v-for="rating in showRatings" class="rating">
              <div class="header">
                <div class="time">{{formatDate(rating.rateTime)}}</div>
                <div class="user">
                  <span class="username">{{rating.username}}</span>
                  <img class="useravatar" :src="rating.avatar">
                </div>
              </div>
              <div class="content">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                <span class="text">{{rating.text}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import eventBus from '@/js/eventBus.js'
import util from '@/js/util.js'
import BScroll from 'better-scroll'
import RatingSelector from '@@/ratingselector/RatingSelector'
import Amount from '@@/amount/Amount'

export default {
  props: {
    food: {
      type: Object
    }
  },
  components: {
    RatingSelector,
    Amount
  },
  data() {
    return {
      show: false,
      cartShow: true,
      currentType: 'ALL',
      contentFlag: false,
      toggle: ''
    }
  },
  created() {
    eventBus.$on('showBtn', (bool) => {
      this.cartShow = bool
      if (bool) {
        this.toggle = 'toggle'
      }
    })
  },
  computed: {
    positiveRatings() {
      return this.food.ratings.filter((rating) => {
        return rating.rateType === 0
      })
    },
    negativeRatings() {
      return this.food.ratings.filter((rating) => {
        return rating.rateType === 1
      })
    },
    showRatings() {
      let result
      if (this.currentType === 'ALL') {
        result = this.food.ratings
      } else if (this.currentType === 'POSI') {
        result = this.positiveRatings
      } else {
        result = this.negativeRatings
      }
      if (this.contentFlag) {
        result = result.filter((rating) => {
          return rating.text.length > 0
        })
      }
      if (this.detailScroll) {
        this.refreshScroll()
      }
      return result
    }
  },
  methods: {
    showDetail() {
      this.show = true
      if (!this.food.count) {
        this.cartShow = true
      } else {
        this.cartShow = false
      }
      this.currentType = 'ALL'
      this.contentFlag = false
      if (!this.detailScroll) {
        this.$nextTick(() => {
          this._initScroll()
        })
      } else {
        this.refreshScroll()
      }
    },
    hideDetail() {
      this.show = false
      this.toggle = ''
    },
    formatDate(date) {
      return util.formatDate(date)
    },
    changeRatings(ratingType) {
      this.currentType = ratingType
    },
    contentOnly(contentFlag) {
      this.contentFlag = !this.contentFlag
    },
    refreshScroll() {
      this.$nextTick(() => {
        this.detailScroll.refresh()
      })
    },
    beforeLeave(el) {
      if (this.toggle && el.className.includes('add-cart')) { // 让“按钮”内容为空，视觉效果更佳。
        el.textContent = ''
      }
    },
    afterEnter(el) { // Amount组件“进来”后，执行相应操作
      if (this.show && el.id === 'food-comp-amount') {
        if (this.toggle) {
          this.food.count = 1 // 触发amount的动画
          let _el = el.querySelector('.amount-increase')
          eventBus.$emit('drop', _el) // drop小球动画
          setTimeout(() => {
            this.hideDetail()
          }, 200)
        }
      }
    },
    firstAdd() {
      this.toggle = 'toggle'
      this.cartShow = false
    },
    _initScroll() {
      this.detailScroll = new BScroll(this.$refs.foods, {
        click: true
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../common/scss/mixin';

  .food-wrapper {
    position: fixed;
    left: 0;
    top:0;
    bottom: 46px;
    width: 100%;
    background-color: #fff;
    overflow: hidden;
    &.fade-enter, &.fade-leave-to {
      opacity: 0
    }
    &.fade-enter-active, &.fade-leave-active {
      transition: all .4s
    }
    .image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    .food-info-wrapper {
      .food-info {
        position: relative;
        margin: 18px;
        .name {
          font-size: 14px;
          font-weight: 700;
          color: (7, 17, 27);
          line-height: 14px;
        }
        .food-other {
          margin: 8px 0 18px;
          font-size: 0;
          color: rgb(147, 153, 159);
          line-height: 10px;
          .count, .rating {
            display: inline-block;
            font-size: 10px;
          }
          .count {
            margin-right: 12px;
          }
        }
        .food-price {
          font-size: 0;
          .price, .old-price {
            display: inline-block;
            line-height: 24px;
            font-weight: 700
          }
          .price {
            font-size: 14px;
            color: rgb(240, 20, 20);
          }
          .old-price {
            margin-left: 8px;
            font-size: 10px;
            color: rgb(147, 153, 159);
            text-decoration: line-through;
          }
        }
        .add-cart {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 74px;
          height: 24px;
          border-radius: 24px;
          font-size: 10px;
          color: #fff;
          line-height: 24px;
          text-align: center;
          background-color: rgb(0, 160, 220);
          &.toggle-leave-active, &.toggle-enter-active, {
            transition: width .4s
          }
          &.toggle-leave-to {
            width: 24px;  
          }
          &.toggle-enter, {
            width: 24px;
          }
        }
        .amount-wrapper {
          position: absolute;
          right: -6px;
          bottom: -6px;
        }
      }
    }
    .food-desc-wrapper {
      .food-desc {
        margin: 18px;
        .title {
          margin-bottom: 6px;
          font-size: 14px;
          color: rgb(7, 17, 27);
          line-height: 14px;
        }
        .desc {
          padding: 0 8px;
          font-size: 12px;
          color: rgb(77, 85, 93);
          line-height: 24px;
        }
      }
      .no-info {
        margin: 18px;
        font-size: 14px;
        color: rgb(7, 17, 27);
        line-height: 14px;
      }
    }
    .title {
      margin-bottom: 6px;
      font-size: 14px;
      color: rgb(7, 17, 27);
      line-height: 14px;
    }
    .ratinglist {
      .rating {
        padding: 16px 18px;
        .header {
          position: relative;
          color: rgb(147, 153, 159);
          line-height: 12px;
          .user {
            position: absolute;
            right: 0;
            bottom: 0;
            .username {
              display: inline-block;
              vertical-align: top;
            }
            .useravatar {
              width: 12px;
              height: 12px;
              border-radius: 50%;
            }
          }
          .time {
            display: inline-block;
            font-size: 10px;
            color: rgb(147, 153, 159);
            line-height: 12px;
          }
        }
        .content {
          padding: 6px 0 16px;
          @include border-1px;
          .icon-thumb_up, .icon-thumb_down {
            font-size: 12px;
            line-height: 24px;
          }
          .icon-thumb_up {
            color: rgb(0, 160, 220)
          }
          .icon-thumb_down {
            color: rgb(147, 153, 159)
          }
          .text {
            font-size: 12px;
            color: rgb(7, 17, 27);
            line-height: 16px;
          }
        }
      }

    }
  }
</style>
