/*
 *  登录
 */
import { getRequest, postRequest } from '../lib/axios';

export const loginApi = {
    /**
     * 登录
     */
    login: (param: any) => {
        return postRequest('/auth/login', param);
    },

    /**
    * 注册
    */
    register: (param: any) => {
        return postRequest('/auth/register', param);
    },

    /**
    * 忘记密码
    */
    forgetpassword: (param: any) => {
        return postRequest('/auth/forget-password', param);
    },

    /**
    * 修改密码
    */
    changepassword: (param: any) => {
        return postRequest('/auth/change-password', param);
    },
};
