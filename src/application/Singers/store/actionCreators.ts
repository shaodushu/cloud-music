import {
    getHotSingerListRequest,
    getSingerListRequest
} from "../../../api/request";
import {
    CHANGE_SINGER_LIST,
    // CHANGE_CATOGORY,
    // CHANGE_ALPHA,
    CHANGE_PAGE_COUNT,
    CHANGE_PULLUP_LOADING,
    CHANGE_PULLDOWN_LOADING,
    CHANGE_ENTER_LOADING
} from './constants';
import {
    fromJS
} from 'immutable';


const changeSingerList = (data: any[]) => ({
    type: CHANGE_SINGER_LIST,
    data: fromJS(data)
});

export const changePageCount = (data: any) => ({
    type: CHANGE_PAGE_COUNT,
    data
});

//进场loading
export const changeEnterLoading = (data: boolean) => ({
    type: CHANGE_ENTER_LOADING,
    data
});

//滑动最底部loading
export const changePullUpLoading = (data: boolean) => ({
    type: CHANGE_PULLUP_LOADING,
    data
});

//顶部下拉刷新loading
export const changePullDownLoading = (data: boolean) => ({
    type: CHANGE_PULLDOWN_LOADING,
    data
});

//第一次加载热门歌手
export const getHotSingerList = () => {
    return (dispatch: any) => {
        getHotSingerListRequest(0).then((res: any) => {
            const data = res.artists;
            dispatch(changeSingerList(data));
            dispatch(changeEnterLoading(false));
            dispatch(changePullDownLoading(false));
        }).catch(() => {
            console.log('热门歌手数据获取失败');
        })
    }
};

//加载更多热门歌手
export const refreshMoreHotSingerList = () => {
    return (dispatch: any, getState: () => { (): any; new(): any; getIn: { (arg0: string[]): { (): any; new(): any; toJS: { (): any; new(): any; }; }; new(): any; }; }) => {
        const pageCount = getState().getIn(['singers', 'pageCount']);
        const singerList = getState().getIn(['singers', 'singerList']).toJS();
        getHotSingerListRequest(pageCount).then((res: any) => {
            const data = [...singerList, ...res.artists];
            dispatch(changeSingerList(data));
            dispatch(changePullUpLoading(false));
        }).catch(() => {
            console.log('热门歌手数据获取失败');
        });
    }
};

//第一次加载对应类别的歌手
export const getSingerList = (category: any, alpha: string) => {
    return (dispatch: (arg0: { type: string; data: any; }) => void, getState: any) => {
        getSingerListRequest(category, alpha, 0).then((res: any) => {
            const data = res.artists;
            dispatch(changeSingerList(data));
            dispatch(changeEnterLoading(false));
            dispatch(changePullDownLoading(false));
        }).catch(() => {
            console.log('歌手数据获取失败');
        });
    }
};

//加载更多歌手
export const refreshMoreSingerList = (category: any, alpha: string) => {
    return (dispatch: (arg0: { type: string; data: any; }) => void, getState: () => { (): any; new(): any; getIn: { (arg0: string[]): { (): any; new(): any; toJS: { (): any; new(): any; }; }; new(): any; }; }) => {
        const pageCount = getState().getIn(['singers', 'pageCount']);
        const singerList = getState().getIn(['singers', 'singerList']).toJS();
        getSingerListRequest(category, alpha, pageCount).then((res: any) => {
            const data = [...singerList, ...res.artists];
            dispatch(changeSingerList(data));
            dispatch(changePullUpLoading(false));
        }).catch(() => {
            console.log('歌手数据获取失败');
        });
    }
};