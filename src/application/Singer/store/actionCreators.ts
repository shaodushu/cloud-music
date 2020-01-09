import { CHANGE_SONGS_OF_ARTIST, CHANGE_ARTIST, CHANGE_ENTER_LOADING } from './constants';
import { fromJS } from 'immutable';
import { getSingerInfoRequest } from './../../../api/request';

const changeArtist = (data: any) => ({
    type: CHANGE_ARTIST,
    data: fromJS(data)
});

const changeSongs = (data: any) => ({
    type: CHANGE_SONGS_OF_ARTIST,
    data: fromJS(data)
})
export const changeEnterLoading = (data: boolean) => ({
    type: CHANGE_ENTER_LOADING,
    data
})

export const getSingerInfo = (id: number | string) => {
    return (dispatch: (arg0: { type: string; data: any; }) => void) => {
        getSingerInfoRequest(id).then((data: any) => {
            dispatch(changeArtist(data.artist));
            dispatch(changeSongs(data.hotSongs));
            dispatch(changeEnterLoading(false));
        })
    }
}