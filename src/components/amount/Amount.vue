<template>
  <div class="amount">
    <transition name="rotate" key="remove_rotate">
      <div class="amount-decrease" v-show="food.count>0" @click.stop="decreaseAmount($event)">
        <span class="icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="amount-count" v-show="food.count>0" ref="food-count">{{Math.abs(food.count)}}</div>
    <div class="amount-increase" @click.stop="addAmount($event)">
      <span class="icon-add_circle"></span>
    </div>
  </div>
</template>

<script>
import eventBus from '@/js/eventBus.js'

export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addAmount(event) {
      this.food.count ++
      eventBus.$emit('drop', event.target)
    },
    decreaseAmount(event) {
      if (this.food.count > 0) {
        this.food.count --
        if (this.food.count === 0) {
          this.$emit('delFood')
        }
      }
    }
  },
  created() {
    if (this.food.count === undefined) {
      this.$set(this.food, 'count', 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.amount {
  font-size: 0;
  .amount-decrease,
  .amount-increase {
    display: inline-block;
    padding: 6px;
    font-size: 24px;
    height: 24px;
    color: rgb(0, 160, 220);
  }
  .amount-decrease {
    &.rotate-enter-active,
    &.rotate-leave-active {
      transition: all .4s
    }
    &.rotate-enter {
      transform: translateX(36px) rotateZ(360deg);
      // opacity: 0;
    }
    &.rotate-leave-to {
      transform: translateX(36px) rotateZ(360deg);
      // opacity: 0;
    }
  }
  .amount-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    font-size: 10px;
    color: rgb(147, 153, 159);
    text-align: center;
    line-height: 24px;
  }
}
</style>
