import { SET_HOT_KEYWRODS, SET_SUGGEST_LIST, SET_RESULT_SONGS_LIST, SET_ENTER_LOADING } from './constants';
import { fromJS } from 'immutable';
import { getHotKeyWordsRequest, getSuggestListRequest, getResultSongsListRequest } from './../../../api/request';

const changeHotKeyWords = (data: any) => ({
    type: SET_HOT_KEYWRODS,
    data: fromJS(data)
});

const changeSuggestList = (data: any) => ({
    type: SET_SUGGEST_LIST,
    data: fromJS(data)
});

const changeResultSongs = (data: any) => ({
    type: SET_RESULT_SONGS_LIST,
    data: fromJS(data)
});

export const changeEnterLoading = (data: boolean) => ({
    type: SET_ENTER_LOADING,
    data
});

export const getHotKeyWords = () => {
    return (dispatch: (arg0: { type: string; data: any; }) => void) => {
        getHotKeyWordsRequest().then((data: any) => {
            // 拿到关键词列表
            let list = data.result.hots;
            dispatch(changeHotKeyWords(list));
        })
    }
};
export const getSuggestList = (query: string) => {
    return (dispatch: (arg0: { type: string; data: any; }) => void) => {
        getSuggestListRequest(query).then((data: any) => {
            if (!data) return;
            let res = data.result || [];
            dispatch(changeSuggestList(res));
        })
        getResultSongsListRequest(query).then((data: any) => {
            if (!data) return;
            let res = data.result.songs || [];
            dispatch(changeResultSongs(res));
            dispatch(changeEnterLoading(false));// 关闭 loading
        })
    }
};