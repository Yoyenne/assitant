/*
 *  UserMusicController 用户音乐相关接口
 */
import { smartAxios, getRequest, postRequest } from '../lib/axios';

export const musicApi = {
    /**
     * 根据文字获取推荐歌曲
     */
    recommend: (param: any) => {
        return postRequest('/user/music/recommend', param);
    },

    /**
     * 根据图片获取推荐歌曲
     */
    recommendByImage: (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
    
        return smartAxios.post('/user/music/recommendByImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * 根据心情获取推荐歌曲
     */
    recommendByEmotion: (param: any) => {
        return getRequest('/user/music/recommendByEmotion', param);
    },

    /**
     * 喜爱歌曲
     */
    addLike: (param: any) => {
        return postRequest('/user/music/addLike', param);
    },

    /**
     * 获取用户喜爱歌曲
     */
    userLike: (param: any) => {
        return getRequest('/user/music/userLike', param);
    },
};
