/* eslint-disable func-call-spacing,prefer-promise-reject-errors */
import axios from 'axios'
const instance = axios.create({
    baseURL: '',
    withCredentials: true // 跨域类型时是否在请求中协带cookie
})
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

export default class HttpUtil {
    static get(url, params = {}) {
        return new Promise((resolve, reject) => {
            instance.get(url, {params}).then(({data}) => {
                resolve(data)
            }).catch((err) => {
                reject({err: JSON.stringify(err)})
            })
        })
    }

    static post(url, params = {}) {
        return new Promise((resolve, reject) => {
            instance.post(url, params).then(({data}) => {
                resolve(data)
            }).catch((err) => {
                reject({err: JSON.stringify(err)})
            })
        })
    }
}
