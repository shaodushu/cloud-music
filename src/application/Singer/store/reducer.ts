import * as actionTypes from './constants';
import { fromJS } from 'immutable';// 这里用到 fromJS 把 JS 数据结构转化成 immutable 数据结构

const defaultState = fromJS({
    artist: {},
    songsOfArtist: [],
    loading: true
});

export default (state = defaultState, action: { type: any; data: any; }) => {
    switch (action.type) {
        case actionTypes.CHANGE_ARTIST:
            return state.set('artist', action.data);
        case actionTypes.CHANGE_SONGS_OF_ARTIST:
            return state.set('songsOfArtist', action.data);
        case actionTypes.CHANGE_ENTER_LOADING:
            return state.set('loading', action.data);
        default:
            return state;
    }
}