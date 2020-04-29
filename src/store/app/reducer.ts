import * as actionTypes from './constants';
import { fromJS } from 'immutable';// 这里用到 fromJS 把 JS 数据结构转化成 immutable 数据结构
import { Skin } from '../../assets/global-style'

const defaultState = fromJS({
    theme: Skin.a
});

export default (state = defaultState, action: { type: any; data: any; }) => {
    switch (action.type) {
        case actionTypes.CHANGE_THEME:
            return state.set('theme', action.data);
        default:
            return state;
    }
}