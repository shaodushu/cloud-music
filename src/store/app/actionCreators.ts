import { CHANGE_THEME } from './constants';
import { fromJS } from 'immutable';

export const changeTheme = (data: any) => ({
    type: CHANGE_THEME,
    data: fromJS(data)
});
