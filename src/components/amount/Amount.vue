<template>
  <div class="amount">
    <transition-group name="rotate" key="remove_rotate"  @after-leave="afterLeave">
      <div data-flag="amount" 
          class="amount-decrease" 
          v-show="food.count>0" 
          @click.stop="decreaseAmount($event)"
          :key="'decrease'"
          >
        <span data-flag="amount" class="icon-remove_circle_outline"></span>
      </div>
      <div data-flag="amount" :key="'count'" class="amount-count" v-show="food.count>0" ref="food-count">{{foodCount}}</div>
    </transition-group> 
    <div data-flag="amount" class="amount-increase" @click.stop="addAmount($event)">
      <span data-flag="amount" class="icon-add_circle"></span>
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
  computed: {
    foodCount() {
      return this.food.count === 0 ? 1 : this.food.count
    }
  },
  methods: {
    addAmount(event) {
      this.food.count ++
      eventBus.$emit('showBtn', false)
      eventBus.$emit('drop', event.target)
    },
    decreaseAmount(event) {
      if (this.food.count > 0) {
        this.food.count --
        if (this.food.count === 0) {
          this.$emit('delFood')
        }
      }
    },
    afterLeave(el) { // “减号”滚回去后，触发购物车按钮动画
      eventBus.$emit('showBtn', true)
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
      transition: all .3s
    }
    &.rotate-enter, &.rotate-leave-to {
      transform: translateX(48px) rotateZ(-360deg);
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
    transform-origin: 6px 18px 0;
    &.rotate-enter-active, &.rotate-leave-active {
      transition: all .3s;
    }
    &.rotate-enter, &.rotate-leave-to {
      transform: translateX(24px) rotateZ(-720deg);
    }
  }
}
</style>
