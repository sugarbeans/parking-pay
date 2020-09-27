//全局变量
const appId = 'wxf4a9a95e4703dc09'
const documentTitle = "鼎游通"
const isWx = (navigator.appVersion.toString().match(/micromessenger/ig) || []).length > 0
const URL = '//demow.cytjingqu.com'
const returnOrderStatus = (orderType) => {
    switch (orderType) {
        case "02":
            return '已付款';
            break;
        case "00":
            return '待付款';
            break;
        case "11":
            return ' 已出票';
            break;
        case "27":
            return '已退订';
            break;
        case "98":
            return '已退订';
            break;
        default:
            return '状态未知';
            break;
    }
}
const getUrlParam = (name) => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    if(r != null) return unescape(r[2])
    return null
}
export default {
    documentTitle,
    isWx,
    URL,
    returnOrderStatus,
    getUrlParam,
    appId
}
