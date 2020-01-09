import { CHANGE_CURRENT_ALBUM, CHANGE_ENTER_LOADING } from './constants';
import { getAlbumDetailRequest } from '../../../api/request';
import { fromJS } from 'immutable';

const changeCurrentAlbum = (data: any) => ({
    type: CHANGE_CURRENT_ALBUM,
    data: fromJS(data)
});

export const changeEnterLoading = (data: boolean) => ({
    type: CHANGE_ENTER_LOADING,
    data
});

export const getAlbumList = (id: number | string) => {
    return (dispatch: (arg0: { type: string; data: any; }) => void) => {
        getAlbumDetailRequest(id).then((res: any) => {
            let data = res.playlist;
            dispatch(changeCurrentAlbum(data));
            dispatch(changeEnterLoading(false));
        }).catch(() => {
            console.log("获取 album 数据失败！")
        });
    }
};