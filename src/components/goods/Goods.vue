<template>
  <div class="goods">
    <div class="goods-type-wrapper" ref="goods-type">
      <ul>
        <li class="goods-type-item" v-for="(item,index) in goods" :class="{current:currentIndex === index }" @click="scrollFoods(index)">
          <span class="foodname">
            <span v-if="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</span><span v-show="goodsTypeCount[index]>0" class="count">{{goodsTypeCount[index]}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foods">
      <ul>
        <li class="foods-type" v-for="item in goods">
          <h2 class="foods-type-name">{{item.name}}</h2>
          <ul>
            <li class="foods-item" v-for="foodItem in item.foods" @click.capture="selectFood(foodItem, $event)">
              <img class="foods-icon" :src="foodItem.icon" width="57" height="57">
              <div class="foods-detail">
                <h3 class="foods-name">{{foodItem.name}}</h3>
                <p class="foods-description">{{foodItem.description}}</p>
                <div class="foods-other">
                  <span class="foods-count">月售{{foodItem.sellCount}}份</span>
                  <span class="rating">好评率{{foodItem.rating}}%</span>
                </div>
                <div class="foods-price">
                  <span class="price">￥{{foodItem.price}}</span>
                  <span class="old-price" v-if="foodItem.oldPrice">￥{{foodItem.oldPrice}}</span>
                </div>
                <div class="amount-wrapper">
                  <amount :food="foodItem"></amount>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shop-cart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :selected-foods="selectedFoods"></shop-cart>
    <food :food="selectedFood" ref="food-detail"></food>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Amount from '@@/amount/Amount'
import ShopCart from '@@/shop cart/Shopcart'
import Food from '@@/food/Food'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    Amount,
    ShopCart,
    Food
  },
  data() {
    return {
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      goods: [],
      foodsHeight: [0],
      scrollY: 0,
      selectedFood: {
        ratings: []
      }
    }
  },
  created() {
    this.$http.get('api/goods').then((res) => {
      res = res.body
      if (res.errno === 0) {
        this.goods = res.data
        this.$nextTick(() => {
          this._calculateHeight()
          this._initScroll()
        })
      }
    })
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.foodsHeight.length; i++) {
        let height1 = this.foodsHeight[i]
        let height2 = this.foodsHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    goodsTypeCount() {
      let result = []
      this.goods.forEach((good) => {
        let count = 0
        good.foods.forEach((food) => {
          count += food.count
        })
        result.push(count)
      })
      return result
    },
    selectedFoods() {
      let result = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            result.push(food)
          }
        })
      })
      return result
    }
  },
  methods: {
    _calculateHeight() {
      let foods = this.$refs.foods.getElementsByClassName('foods-type')
      let height = 0
      for (let i = 0; i < foods.length; i++) {
        height += foods[i].clientHeight
        this.foodsHeight.push(height)
      }
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs['goods-type'], {
        bounce: false,
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foods, {
        bounce: false,
        click: true,
        probeType: 3
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
        this.scrollMenu() // 防止因左侧菜单项过多/屏幕太小引起的<高亮的菜单项>被遮住的情况
      })
    },
    scrollFoods(index) {
      this.foodsScroll.scrollTo(0, -this.foodsHeight[index])
      this.scrollY = this.foodsHeight[index]
    },
    scrollMenu() {
      this.menuScroll.scrollToElement(this.$refs['goods-type'].getElementsByClassName('current')[0], 300)
    },
    selectFood(food, event) {
      this.selectedFood = food
      if (event.target.dataset.flag === 'amount') {
        return
      }
      this.$nextTick(() => {
        this.$refs['food-detail'].showDetail()
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../common/scss/mixin';
.goods {

  // display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden; // width: 80px;
  .goods-type-wrapper {
    float: left;
    width: 80px; // flex: 0 0 80px;
    height: 100%; // display: table;
    background-color: #f3f5f7;
    .goods-type-item {
      display: table;
      width: 56px;
      height: 54px; // vertical-align: bottom;
      padding: 0 12px;
      font-size: 12px;
      font-weight: 200; // color: rgb(240, 20, 20);
      line-height: 14px;
      &:not(:last-child) {
        @include border-1px;
      }
      &.current {
        font-weight: 700;
        background-color: #fff;
      }
      .foodname {
        display: table-cell;
        vertical-align: middle;
        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          background-size: 12px;
          background-repeat: no-repeat;
          @include support-icon('./', '3')
        }
      }
      .count {
        position: absolute;
        right: 2px;
        top: 2px;
        width: 16px;
        height: 16px;
        color: #fff;
        font-size: 9px;
        text-align: center;
        line-height: 16px;
        background-color: rgb(240, 20, 20);
        border-radius: 50%;
      }
    }
  }
  .foods-wrapper {
    height: 100%;
    overflow: hidden;
    .foods-type {
      .foods-type-name {
        height: 26px;
        padding-left: 14px;
        font-size: 12px;
        color: rgb(147, 153, 159);
        line-height: 26px;
        background-color: #f3f5f7;
        border-left: 2px solid #d9dde1;
        box-sizing: border-box;
      }
      .foods-item {
        display: flex;
        margin: 18px;
        margin-bottom: 0;
        padding-bottom: 18px;
        @include border-1px;
        .foods-icon {
          flex: 0 0 57px;
        }
        .foods-detail {
          flex: 1;
          position: relative;
          top: 2px;
          margin-left: 10px;
          vertical-align: bottom;
          .foods-name,
          {
            font-size: 14px;
            color: rgb(7, 17, 27);
            line-height: 14px;
          }
          .foods-description {
            margin: 8px 0;
          }
          .foods-description,
          .foods-other {
            font-size: 10px;
            color: rgb(147, 153, 159);
            line-height: 10px;
          }
          .foods-other {
            .foods-count {
              display: inline-block;
              margin-right: 12px;
            }
            .rating {
              font-size: 10px;
            }
          }
          .foods-price {
            font-size: 0;
            .price,
            .old-price {
              line-height: 24px;
            }
            .price {
              display: inline-block;
              margin: 8px 8px 0 0;
              font-size: 14px;
              font-weight: 700;
              color: rgb(240, 20, 20)
            }
            .old-price {
              font-size: 10px;
              color: rgb(147, 153, 159);
              font-weight: normal;
              text-decoration: line-through;
            }
          }
          .amount-wrapper {
            position: absolute;
            right: 0;
            bottom: -6px;
          }
        }
      }
    }
  }
}
</style>
