//全局变量2021002103688690
const isWx = (navigator.appVersion.toString().match(/micromessenger/ig) || []).length > 0
const isAli = (navigator.appVersion.toString().match(/alipayclient/ig) || []).length > 0
const appId = isWx ? 'wx5a6c601ca97c8443' : isAli ? "2021002107612415" : ''
const payMode = isWx ? 'WECHAT': isAli ? 'ALIPAY' : ''
const getUrlParam = (name) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let r = window.location.search.substr(1).match(reg)
  if(r != null) return unescape(r[2])
  return null
}
export default {
  isWx,
  isAli,
  payMode,
  getUrlParam,
  appId
}
