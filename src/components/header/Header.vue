<template>
  <div class="header">
    <div class="content-wrapper clearfix">
      <div class="avatar">
        <img alt="商家图标" width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="promotion-wrapper">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span><span class="promotion">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="promotion-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>

    <div class="announcement">
      <span class="bulletin"></span><span class="text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <div v-show="detail" class="detail" ref="detail">
      <div class="detail-wrapper">
        <h1 class="name">{{seller.name}}</h1>
        <div class="star-wrapper">
          <star :size="48" :score="seller.score"></star>
        </div>
        <div class="title">
          <div class="divider"></div>
          <h2 class="title-name">优惠信息</h2>
          <div class="divider"></div>
        </div>
        <div class="promotion-list-wrapper">
          <ul class="promotion-list">
            <li v-for="support in seller.supports" class="promotion-item" ><span class="icon" :class="classMap[support.type]"></span>{{support.description}}</li>
          </ul>
        </div>
        <div class="title">
          <div class="divider"></div>
          <h2 class="title-name">商家公告</h2>
          <div class="divider"></div>
        </div>
        <p class="seller-des">{{seller.bulletin}}</p>
      </div>
      <div class="detail-close">
        <i class="icon-close" @click="hideDetail"></i>
      </div>

    </div>
  </div>
</template>

<script>
import Star from '@@/star/Star'
import BScroll from 'better-scroll'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      detail: false,
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    }
  },
  methods: {
    showDetail() {
      this.detail = true
      this.$nextTick(() => {
        this._initScroll()
      })
    },
    hideDetail() {
      this.detail = false
    },
    _initScroll() {
      this.detailScroll = new BScroll(this.$refs.detail, {
        click: true
      })
    }
  },
  components: {
    Star
  }
}
</script>

<style lang="scss" scoped>
@import '../../common/scss/mixin';

.header {
  position: relative;
  color: #fff;
  background: rgba(7, 17, 27, 0.5);
  overflow: hidden;
  .content-wrapper {
    position: relative;
    padding: 24px 12px 18px 24px;
    .avatar {
      float: left;
      height: 64px;
      margin-right: 16px;
      font-size: 16px;
      img {
        border-radius: 2px
      }
    }
    .content {
      overflow: hidden;
      .title {
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .brand {
          display: inline-block;
          vertical-align: top;
          width: 30px;
          height: 18px;
          @include bg-img('brand');
          background-size: 30px 18px;
          background-repeat: no-repeat;
        }
        .name {
          margin-left: 6px;
          font-size: 16px;
          line-height: 18px;
          font-weight: bold;
          // white-space: nowrap;
          // overflow: hidden;
          // text-overflow: ellipsis;
        }
      }
      .description {
        margin: 8px 0 10px;
        font-size: 12px;
        font-weight: 200;
        line-height: 12px;
      }
      .promotion-wrapper {
        font-size: 10px;
        font-weight: 200;
        line-height: 12px;
        .icon {
          display: inline-block;
          vertical-align: top;
          margin-right: 4px;
          width: 12px;
          height: 12px;
          background-size: 12px;
          background-repeat: no-repeat;
          @include support-icon('./', '1');
        }
      }
    }
  }
  .announcement {
    position: relative;
    height: 28px;
    padding: 0 22px 0 12px;
    line-height: 28px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: rgba(7, 17, 27, 0.2);
    .bulletin {
      display: inline-block;
      width: 22px;
      height: 12px;
      @include bg-img('bulletin');
      background-size: 22px 12px;
      background-repeat: no-repeat
    }
    .text {
      vertical-align: top;
      margin: 0 4px;
      font-size: 10px;
    }
    .icon-keyboard_arrow_right {
      position: absolute;
      right: 12px;
      top: 8px;
    }
  }
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(10px);
  }
  .promotion-count {
    position: absolute;
    right: 12px;
    bottom: 14px;
    height: 24px;
    padding: 0 8px;
    border-radius: 14px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    font-weight: 200;
    background-color: rgba(0, 0, 0, 0.2);
    .icon-keyboard_arrow_right {
      line-height: 24px
    }
    .count {
      margin-right: 2px;
      vertical-align: top
    }
  }
  .detail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // padding: 64px 36px 32px;
    // box-sizing: border-box;
    color: rgb(255,255,255);
    background-color: rgba(7, 17, 27, 0.8);
    z-index: 100;
    .detail-wrapper {
      min-height: 100%;
      margin: 0px 36px;
      padding: 64px 0 32px;
      // padding-bottom: 32px;
      // box-sizing: border-box;
      .name {
        font-size: 16px;
        font-weight: 700;
        line-height: 16px;
        margin:0;
        text-align: center
      }
      .star-wrapper {
        height: 24px;
        margin: 16px 0 28px
      }
      .title {
        display: flex;
        width: 100%;
        .divider {
          position: relative;
          bottom: 7px;
          flex: 1;
          @include border-1px(rgba(255,255,255,0.2))
        }
        .title-name {
          margin: 0 12px;
          font-size: 14px;
          font-weight: 700;
          line-height: 14px;
        }
      }
      .promotion-list-wrapper {
        margin: 24px 0 28px;
        padding: 0 12px;
        .promotion-item {
          &:not(:last-child){
            margin-bottom: 12px;
          }
          height: 16px;
          font-size: 12px;
          font-weight: 200;
          line-height: 16px;
          .icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            vertical-align: top;
            margin-right: 6px;
            background-size: 16px;
            background-repeat: no-repeat;
            @include support-icon('./', '2')
          }
        }
      }
      .seller-des {
        margin-top: 24px;
        padding: 0 12px;
        font-size: 12px;
        font-weight: 200;
        line-height: 24px;
      }
    }
    .detail-close {
      position: fixed;
      left: 50%;
      bottom: 32px;
      margin-left: -16px;
      text-align: center;
      .icon-close {
        font-size: 32px;
        color: rgba(255,255,255,0.5)
      }
    }
  }
}
</style>
