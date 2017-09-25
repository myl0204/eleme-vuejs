<template>
  <div class="rating-selector">
    <slot></slot>
    <div class="rating-type">
      <span class="button positive" :class="{active:currentType==='ALL'}" @click="selectRatings('ALL')">{{"全部 "+ratings.length}}</span>
      <span class="button positive" :class="{active:currentType==='POSI'}" @click="selectRatings('POSI')">{{"推荐 "+positive}}</span>
      <span class="button negative" :class="{active:currentType==='NEGA'}" @click="selectRatings('NEGA')">{{"吐槽 "+negative}}</span>
    </div>
    <div class="content-only" @click="toggleContent">
      <span class="icon-check_circle" :class="{active:contentFlag}"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ratings: {
      default() {
        return []
      }
    },
    contentFlag: {
      type: Boolean,
      default: false
    },
    currentType: {
      type: String,
      default: 'ALL'
    },
    positive: {
      type: Number,
      defalut: 0
    },
    negative: {
      type: Number,
      defalut: 0
    }
  },
  methods: {
    toggleContent() {
      this.$emit('onlyContent')
    },
    selectRatings(ratingType) {
      this.$emit('changeRatingType', ratingType)
    }
  }
}
</script>

<style lang="scss">
@import '../../common/scss/mixin';
  
  .rating-selector {
    padding: 18px 18px 0;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    .rating-type {
      padding: 12px 18px 18px;
      font-size: 0;
      @include border-1px;
      .button {
        display: inline-block;
        margin-right: 8px;
        padding: 8px 12px;
        font-size: 12px;
        color: rgb(77, 85, 93);
        &.active {
          color: #fff
        }
        &.positive {
          background: rgba(0, 160, 220, 0.2);
          &.active {
            background: rgb(0, 160, 220);
          }
        }
        &.negative {
          background: rgba(77, 85, 93, 0.2);
          &.active {
            background: rgb(77, 85, 93);
          }
        }
      }
    }
    .content-only {
      padding: 12px 0;
      .icon-check_circle {
        display: inline-block;
        font-size: 24px;
        color: rgb(147, 153, 159);
        line-height: 24px;
        &.active {
          color: #00c850
        }
      }
      .text {
        display: inline-block;
        margin-left: 4px;
        vertical-align: top;
        font-size: 12px;
        color: rgb(147, 153, 159);
        line-height: 24px;
      }
    }
  }
</style>
