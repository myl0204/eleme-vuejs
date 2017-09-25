<template>
  <div class="rating-wrapper" ref="rating">
    <div class="rating">
      <div class="overview">
        <div class="header-left">
          <div class="score">{{seller.score}}</div>
          <span class="title">综合评分</span>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="header-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <div class="star">
              <Star :size="36" :score="seller.serviceScore"></Star>
            </div>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <div class="star">
              <Star :size="36" :score="seller.foodScore"></Star>
            </div>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery">
            <span class="title">送达时间</span>
            <span class="delivery-time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <div class="f-divider"></div>
      <RatingSelector :ratings="ratings" 
                      :positive="positiveRatings.length"
                      :negative="negativeRatings.length"
                      :contentFlag="contentFlag"
                      :currentType="currentType"
                      @changeRatingType="changeRatings" 
                      @onlyContent="contentOnly"
                      ><h2 class="title">商品评价</h2></RatingSelector>
      <div class="ratinglist">
        <ul>
          <li v-for="rating in showRatings" class="rating-item">
            <div class="header">
              <img :src="rating.avatar" class="useravatar">
              <span class="username">{{rating.username}}</span>
              <div class="star">
                <Star :size="24" :score="rating.score"></Star>
              </div>
              <span class="delivery-time" v-if="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              <div class="time">{{formatDate(rating.rateTime)}}</div>
            </div>
            <div class="content">
              <span class="text">{{rating.text}}</span>
            </div>
            <div class="recommend">
              <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
              <ul class="clearfix">
                <li v-for="item in rating.recommend" class="recommend-item">{{item}}</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  
</template>

<script>
import util from '@/js/util'
import Star from '@@/star/Star'
import RatingSelector from '@@/ratingselector/RatingSelector'
import BScroll from 'better-scroll'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    Star,
    RatingSelector
  },
  data() {
    return {
      ratings: [],
      currentType: 'ALL',
      contentFlag: false
    }
  },
  created() {
    this.$http.get('/api/ratings').then((res) => {
      res = res.body
      if (res.errno === 0) {
        this.ratings = res.data
        this.$nextTick(() => {
          this._initScroll()
        })
      }
    })
  },
  methods: {
    formatDate(date) {
      return util.formatDate(date)
    },
    changeRatings(ratingType) {
      this.currentType = ratingType
    },
    contentOnly(contentFlag) {
      this.contentFlag = !this.contentFlag
    },
    _initScroll() {
      this.ratingScroll = new BScroll(this.$refs.rating, {
        click: true
      })
    },
    refreshScroll() {
      this.$nextTick(() => {
        this.ratingScroll.refresh()
      })
    }
  },
  computed: {
    positiveRatings() {
      return this.ratings.filter((rating) => {
        return rating.rateType === 0
      })
    },
    negativeRatings() {
      return this.ratings.filter((rating) => {
        return rating.rateType === 1
      })
    },
    showRatings() {
      let result
      if (this.currentType === 'ALL') {
        result = this.ratings
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
      if (this.ratingScroll) {
        this.refreshScroll()
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../common/scss/mixin.scss';

  .rating-wrapper {
    position: absolute;
    top: 174px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      display: flex;
      padding: 18px 0;
      .header-left {
        flex: 0 0 137px;
        width: 137px;
        padding: 6px 0;
        border-right: 1px solid rgba(7, 17, 27, 0.1);
        text-align: center;
        @media only screen and (max-width: 320px) {
          flex: 0 0 120px;
          width: 120px;
        }
        .score {
          font-size: 24px;
          color: rgb(255, 153, 0);
          line-height: 28px;
        }
        .title {
          display: inline-block;
          margin: 6px 0 8px;
          font-size: 12px;
          color: rgb(7, 17, 27);
          line-height: 12px;
        }
        .rank {
          font-size: 10px;
          color: rgba(7, 17, 27, 0.4);
          line-height: 10px;
        }
      }
      .header-right {
        flex: 1;
        padding: 6px 0 6px 18px;
        font-size: 0;
        @media only screen and (max-width: 320px) {
          padding-left: 6px;
          text-align: center;
        }
        .score-wrapper {
          margin-bottom: 4px;
          .title {
            display: inline-block;
            font-size: 12px;
            color: rgb(7, 17, 27);
            line-height: 18px;
            @media only screen and (max-width: 320px) {
              display: block;
              margin-bottom: 4px;
            }
          }
          .star {
            display: inline-block;
            margin: 0 12px;
            vertical-align: middle;
            line-height: 18px;
            @media only screen and (max-width: 320px) {
             margin: 0 12px 0 0;
            }
          }
          .score {
            font-size: 12px;
            color: (255, 153, 0);
            line-height: 18px;
          }
        }
        .delivery {
          .title {
            font-size: 12px;
            color: rgb(7, 17, 27);
            line-height: 18px;
            margin-right: 12px;
          }
          .delivery-time {
            font-size: 12px;
            color: rgb(147, 153, 159);
            line-height: 18px;
          }
        }
      }
    }
    .ratinglist {
      .rating-item {
        padding: 18px 18px 18px 58px;
        font-size: 0;
        @include border-1px;
        .header {
          position: relative;
          .useravatar {
            position: absolute;
            left: -40px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
          }
          .username {
            display: block;
            margin-bottom: 4px;
            font-size: 10px;
            color: rgb(7, 17, 27);
            line-height: 12px;
          }
          .star {
            display: inline-block;
            margin-right: 6px;
          }
          .delivery-time {
            font-size: 10px;
            font-weight: 200;
            color: rgb(147, 153, 159);
            line-height: 12px;
          }
          .time {
            position: absolute;
            right: 0;
            top: 0;
            @extend .delivery-time
          }
        }
        .content {
          margin: 6px 0 8px;
          .text {
            font-size: 12px;
            color: rgb(7, 17, 27);
            line-height: 18px;
          }
        }
        .recommend {
          display: flex;
          .icon-thumb_up, .icon-thumb_down{
            margin-right: 8px;
            font-size: 12px;
            line-height: 16px;
          }
          .icon-thumb_up {
            color: rgb(0, 160, 220);
          }
          .icon-thumb_down {
            color: rgb(183, 187, 191)
          }
          ul {
            flex: 1
          }
          .recommend-item {
            float: left;
            margin: 0 8px 4px 0;
            padding: 0 6px;
            font-size: 9px;
            color: rgb(147, 153, 159);
            line-height: 16px;
            border: 1px solid rgba(7, 17, 27, 0.1);
            border-radius: 1px;
          }
        }
      }
    }
  }
</style>
