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