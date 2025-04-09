import { defineStore } from 'pinia';
export const useMusicStore = defineStore('musicStore', {
    state: () => ({
        type: sessionStorage.getItem('musicType'), // 字段text为心情文本   字段image为图片文件  字段emotion为心情代码
        musicList: [] as any[],
        musicValue: sessionStorage.getItem('musicValue'),
    }),
    getters: {
        getMusicList(state) {
            return state.musicList;
        },
        getMusicType(state) {
            return state.type;
        },
        getMusicValue(state) {
            return state.musicValue;
        },
    },
    actions: {
        setMusicInfo(type: any, value: any) {
            this.type = type;
            this.musicValue = value;
            sessionStorage.setItem('musicType', type);
            sessionStorage.setItem('musicValue', value);
        },
        setMusicList(list: any[]) {
            this.musicList = list;
        },
    }
})