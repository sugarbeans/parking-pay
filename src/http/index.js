import HttpUtils from "./http";
import Vue from "vue";
const proxyUrl = ''
class Https {
    GETDATA = (url, parmas) => {
        return HttpUtils.post(proxyUrl +url, parmas)
    }
}

let setPost = (url, data) => {
    return HttpUtils.post(proxyUrl + url, JSON.stringify(data));
};
let setGet = (url, data) => {
    console.log(data, 'params')
    return HttpUtils.get(proxyUrl + url, data);
};
Vue.prototype.$http = new Https();
Vue.prototype.$post = setPost;
Vue.prototype.$get = setGet;
