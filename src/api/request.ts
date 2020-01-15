import { axiosInstance } from "./config";

export const getBannerRequest = () => {
    return axiosInstance.get('/banner');
}

export const getRecommendListRequest = () => {
    return axiosInstance.get('/personalized');
}

export const getHotSingerListRequest = (count: any) => {
    return axiosInstance.get(`/top/artists?offset=${count}`);
}

export const getSingerListRequest = (category: any, alpha: string, count: any) => {
    return axiosInstance.get(`/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`);
}

export const getRankListRequest = () => {
    return axiosInstance.get(`/toplist/detail`);
};

export const getAlbumDetailRequest = (id: number | string) => {
    return axiosInstance.get(`/playlist/detail?id=${id}`);
};

export const getSingerInfoRequest = (id: number | string) => {
    return axiosInstance.get(`/artists?id=${id}`);
};

export const getLyricRequest = (id: number) => {
    return axiosInstance.get(`/lyric?id=${id}`);
};

export const getHotKeyWordsRequest = () => {
    return axiosInstance.get(`/search/hot`);
};

export const getSuggestListRequest = (query: string) => {
    return axiosInstance.get(`/search/suggest?keywords=${query}`);
};

export const getResultSongsListRequest = (query: string) => {
    return axiosInstance.get(`/search?keywords=${query}`);
};

export const getSongDetailRequest = (id: number) => {
    return axiosInstance.get(`/song/detail?ids=${id}`);
};