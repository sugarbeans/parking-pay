import HttpUtils from "./http";
import store from './../store'
import Vue from "vue";
const proxyUrl = '/api'
class Https {
    GETDATA = (url, parmas) => {
        return HttpUtils.post(proxyUrl +url, parmas)
    }
}

let setPost = (url, data) => {
    let params = {
        usid: store.state.usid,
        ...data
    }
    console.log(params, 'params')
    return HttpUtils.post(proxyUrl + url, JSON.stringify(params));
};
let setGet = (url, data) => {
    console.log(data, 'params')
    return HttpUtils.get(proxyUrl + url, data);
};
Vue.prototype.$http = new Https();
Vue.prototype.$post = setPost;
Vue.prototype.$get = setGet;
