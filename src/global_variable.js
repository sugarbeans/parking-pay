//全局变量
const appId = 'wx5a6c601ca97c8443'
const isWx = (navigator.appVersion.toString().match(/micromessenger/ig) || []).length > 0
const getUrlParam = (name) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let r = window.location.search.substr(1).match(reg)
  if(r != null) return unescape(r[2])
  return null
}
export default {
  isWx,
  getUrlParam,
  appId
}
