<template>
  <div class="star" :class="starSize">
    <span v-for="s in stars" class="star-item" :class="s"></span>
  </div>
</template>

<script>

export default {
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starSize() {
      return `star-${this.size}`
    },
    stars() {
      let i
      let result = []
      let count = Math.floor(this.score)
      let half = this.score - count >= 0.5
      for (i = 0; i < count; i++) {
        result.push('on')
      }
      if (half) {
        result.push('half')
        i++
      }
      while (i < 5) {
        result.push('off')
        i++
      }
      return result
    }
  }
}
</script>

<style lang="scss">
@import '../../common/scss/mixin';
.star {
  text-align: center;
  .star-item {
    display: inline-block;
    background-repeat: no-repeat;
  }
  &.star-48 {
    .star-item {
      width: 20px;
      height: 20px;
      &:not(:last-child) {
        margin-right: 22px;
      }
      background-size: 20px;
      &.on {
        @include bg-img('star48_on')
      }
      &.half {
        @include bg-img('star48_half')
      }
      &.off {
        @include bg-img('star48_off')
      }
    }
  }
  &.star-36 {
    .star-item {
      width: 15px;
      height: 15px;
      &:not(:last-child) {
        margin-right: 6px;
      }
      background-size: 15px;
      &.on {
        @include bg-img('star36_on')
      }
      &.half {
        @include bg-img('star36_half')
      }
      &.off {
        @include bg-img('star36_off')
      }
    }
  }
  &.star-24 {
    .star-item {
      width: 10px;
      height: 10px;
      &:not(:last-child) {
        margin-right: 3px;
      }
      background-size: 10px;
      &.on {
        @include bg-img('star24_on')
      }
      &.half {
        @include bg-img('star24_half')
      }
      &.off {
        @include bg-img('star24_off')
      }
    }
  }
}
</style>

