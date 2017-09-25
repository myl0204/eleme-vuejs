<template>
  <div class="seller-wrapper" ref="seller">
    <div class="seller">
      <div class="overview">
        <div class="overview-top">
          <h2 class="title">{{seller.name}}</h2>
          <div class="content">
            <div class="star">
              <Star :size="36" :score="seller.score"></Star>
            </div>
            <span class="rating-count">({{seller.ratingCount}})</span>
            <span class="sell-count">月售{{seller.sellCount}}单</span>
          </div>
          <div class="favorite" @click="favoriteSeller">
            <span class="icon-favorite" :class="{favo:isFavo}"></span>
            <span class="text">{{favoText}}</span>
          </div>
        </div>
        <div class="overview-bottom">
          <div class="min-price block">
            <span class="title">起送价</span>
            <span class="text"><strong>{{seller.minPrice}}</strong>元</span>
          </div>
          <div class="delivery-price block">
            <span class="title">商家配送</span>
            <span class="text"><strong>{{seller.deliveryPrice}}</strong>元</span>
          </div>
          <div class="delivery-time block">
            <span class="title">平均配送时间</span>
            <span class="text"><strong>{{seller.deliveryTime}}</strong>分钟</span>
          </div>
        </div>
      </div>
      <div class="f-divider"></div>
      <div class="promotion">
        <h2 class="title">公告与活动</h2>
        <div class="bulletin">{{seller.bulletin}}</div>
        <ul>
          <li v-for="support in seller.supports" class="support"><span class="icon" :class="classMap[support.type]"></span>{{support.description}}</li>
        </ul>
      </div>
      <div class="f-divider"></div>
      <div class="seller-pics">
        <h2 class="title">商家实景</h2>
        <img v-for="pic in seller.pics" :src="pic" class="pic">
      </div>
      <div class="f-divider"></div>
      <div class="seller-info">
        <h2 class="title">商家信息</h2>
        <ul>
          <li v-for="info in seller.infos" class="info">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import util from '@/js/util.js'
import Star from '@@/star/Star'
import BScroll from 'better-scroll'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    Star
  },
  data() {
    return {
      isFavo: (() => {
        return util.getLocalStorage(this.seller.id, 'isFavo', false)
      })(),
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    }
  },
  created() {
    this.$nextTick(() => {
      this._initScroll()
    })
  },
  methods: {
    favoriteSeller() {
      this.isFavo = !this.isFavo
      util.setLocalStorage(this.seller.id, 'isFavo', this.isFavo)
    },
    _initScroll() {
      this.sellerScroll = new BScroll(this.$refs.seller, {
        click: true
      })
    }
  },
  computed: {
    favoText() {
      return this.isFavo ? '已收藏' : '未收藏'
    }
  }
}
</script>

<style lang="scss"> 
@import '../../common/scss/mixin';

  .seller-wrapper {
    position: absolute;
    top: 174px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .seller {
      // padding: 18px 18px 0;
      .overview {
        padding: 18px 18px 0;
        .overview-top {
          position: relative;
          @include border-1px;
          .title {
            font-size: 14px;
            color: rgb(7, 17, 27);
            line-height: 14px;
          }
          .content {
            padding: 8px 0 18px;
            .star {
              display: inline-block;
              vertical-align: top;
              text-align: left;
            }
            .rating-count {
              display: inline-block;
              margin: 0 8px 0 12px;
              @extend .sell-count
            }
            .sell-count {
              font-size: 10px;
              color: rgb(77, 85, 93);
              line-height: 18px;
            }
          }
          .favorite {
            position: absolute;
            right: 0;
            bottom: 14px;
            text-align: center;
            .icon-favorite {
              font-size: 24px;
              line-height: 24px;
              color: rgba(0, 0, 0, .1);
              &.favo {
                color: rgb(240, 20, 20)
              }
            }
            .text {
              display: block;
              margin: 4px 0 
            }
          }
        }
        .overview-bottom {
          display: flex;
          margin: 18px 0;
          .block {
            flex:1;
            text-align: center;
            .title {
              font-size: 10px;
              color: rgb(147, 153, 159);
              line-height: 10px;
            }
            .text {
              display: block;
              margin-top: 4px;
              strong {
                font-size: 24px;
                font-weight: 200;
                color: rgb(7, 17, 27);
                line-height: 24px;
              }
            }
          }
        }
      }
      .promotion {
        margin-top: 18px;
        padding: 0 18px;
        .title {
          margin-bottom: 8px;
          font-size: 14px;
          color: rgb(7, 17, 27);
          line-height: 14px;
        }
        .bulletin {
          padding: 0 12px 16px;
          font-size: 12px;
          font-weight: 200;
          color: rgb(240, 20, 20);
          line-height: 24px;
          @include border-1px
        }
        .support {
          margin: 0 12px;
          padding: 16px 0;
          font-size: 12px;
          font-weight: 200;
          color: rgb(7, 17, 27);
          line-height: 16px;
          &:not(:last-child) {
            @include border-1px
          }
          .icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            vertical-align: top;
            margin-right: 6px;
            background-size: 16px;
            background-repeat: no-repeat;
            @include support-icon('./', '4')
          }
        }
      }
      .seller-pics {
        padding: 18px;
        .title {
          margin-bottom: 12px;
        }
        .pic {
          width: 120px;
          height: 90px;
          margin-right: 6px;
        }
      }
      .seller-info {
        padding: 18px;
        .title {
          margin-bottom: 12px;
          @include border-1px
        }
        .info {
          padding: 16px 12px;
          font-size: 12px;
          font-weight: 200;
          color: rgb(7, 17, 27);
          line-height: 16px;
          &:not(:last-child) {
            @include border-1px
          }
        }
      }
    }
  }
</style>
