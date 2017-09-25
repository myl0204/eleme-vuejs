let util = {
  // 格式化日期
  formatDate(date) {
    function pad(number) {
      return number < 10 ? '0' + number : number
    }
    let result
    let rDate = new Date(date)
    result = `${rDate.getFullYear()}-${pad(rDate.getMonth() + 1)}-${pad(rDate.getDate())}  ${pad(rDate.getHours())}:${pad(rDate.getMinutes())}`
    return result
  },
  // 解析url查询参数
  urlParse() {
    let result = {}
    let urlParam = window.location.search
    let arr = urlParam.match(/^[?&][^?&]+=[^?&]+/g)

    if (arr) {
      arr.forEach((item) => {
        let tempArr = item.substring(1).split('=')
        let key = decodeURIComponent(tempArr[0])
        let val = decodeURIComponent(tempArr[1])
        result[key] = val
      })
    }
    return result
  },
  // 存储localStorage
  setLocalStorage(id, key, value) {
    let seller = window.localStorage.__seller__
    if (!seller) {
      seller = {}
      seller[id] = {}
    } else {
      seller = JSON.parse(seller)
      if (!seller[id]) {
        seller[id] = {}
      }
    }
    seller[id][key] = value
    window.localStorage.__seller__ = JSON.stringify(seller)
  },
  // 读取localStorage
  getLocalStorage(id, key, def) {
    let seller = window.localStorage.__seller__
    if (!seller) {
      return def
    }
    seller = JSON.parse(seller)[id]
    if (!seller) {
      return def
    }
    return seller[key] || def
  }
}

export default util
