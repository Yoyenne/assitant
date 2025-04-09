/*
 *  ajax请求
 *
 */
import { message } from 'ant-design-vue';
import axios from 'axios';
import { localRead, localClear } from '../utils/local-util';

// token的消息头
const TOKEN_HEADER = 'Authorization';

// 创建axios对象
const smartAxios = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
});

// 退出系统
function logout() {
    localClear();
    location.href = '/login';
}

// ================================= 请求拦截器 =================================

smartAxios.interceptors.request.use(
    (config) => {
        // 在发送请求之前消息头加入token token
        const token = localRead('USER_TOKEN');
        if (token) {
            config.headers[TOKEN_HEADER] = 'Bearer ' + token;
        } else {
            delete config.headers[TOKEN_HEADER];
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// ================================= 响应拦截器 =================================

// 添加响应拦截器
smartAxios.interceptors.response.use(
    (response) => {
        // 根据content-type ，判断是否为 json 数据
        let contentType = response.headers['content-type'] ? response.headers['content-type'] : response.headers['Content-Type'];
        if (contentType.indexOf('application/json') === -1) {
            return Promise.resolve(response);
        }

        // 如果是json数据
        if (response.data && response.data instanceof Blob) {
            return Promise.reject(response.data);
        }

        const res = response.data;
        // if (res.code && res.code !== 1) {
        //   // `token` 过期或者账号已在别处登录
        //   if (res.code === 30007 || res.code === 30008) {
        //     message.destroy();
        //     message.error('您没有登录，请重新登录');
        //     // setTimeout(logout, 300);
        //     return Promise.reject(response);
        //   }
        //   message.destroy();
        //   message.error(res.msg);
        //   return Promise.reject(response);
        // } else {
        return Promise.resolve(res);
        // }
    },
    (error) => {
        // 对响应错误做点什么
        if(error.response && error.response.data.message){
            message.error(error.response.data.message);
        }else{
            setTimeout(logout, 300);
            message.error('网络连接错误');
        }
        // setTimeout(logout, 300);
        // if (error.message.indexOf('timeout') !== -1) {
        //   message.destroy();
        //   message.error('网络超时');
        // } else if (error.message === 'Network Error') {
        //   message.destroy();
        //   message.error('网络连接错误');
        // } else if (error.message.indexOf('Request') !== -1) {
        //   message.destroy();
        //   message.error('网络发生错误');
        // }
        return Promise.reject(error);
    }
);

// ================================= 对外提供请求方法：通用请求，get， post, 下载download等 =================================

/**
 * get请求
 */
export const getRequest = (url: any, params: any) => {
    return request({ url, method: 'get', params });
};

/**
 * 通用请求封装
 * @param config
 */
export const request = (config: any) => {
    return smartAxios.request(config);
};

/**
 * post请求
 */
export const postRequest = (url: any, data: any) => {
    return request({
        data,
        url,
        method: 'post',
    });
};