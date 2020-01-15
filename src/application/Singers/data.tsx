/**
 * 模拟一个简单的 redux
 * 上一章我们留下了一道思考题，让组件切换时能够保存当前组件的状态。当组件切换后，当前组件即被卸载，对于组件内部有关的函数引用也会消失，作用域引用消失，闭包变量不复存在。
 * 所以通过该组件内部缓存是行不通的，必须采取状态存储在组件外的方式。
 * 也许你马上就想到了 redux，这当然可以，但如果真要用这个，我也就没有说的必要了。
 * 其实也是为了拓展一下大家的思路，全局的状态管理不仅仅可以用 redux，react hooks 同样可以模拟出这种功能。现在我们就用 hooks 中的 useContext 结合 useReducer 打造出类似 redux 的状态管理功能。
 */

import React, { createContext, useReducer, FC } from 'react';
import { fromJS } from 'immutable';

//context
export const CategoryDataContext = createContext({});

// 相当于之前的 constants
export const CHANGE_CATEGORY = 'singers/CHANGE_CATEGORY';
export const CHANGE_ALPHA = 'singers/CHANGE_ALPHA';

//reducer 纯函数
const reducer = (state: { set: (arg0: string, arg1: any) => any; }, action: { type: any; data: any; }) => {
    switch (action.type) {
        case CHANGE_CATEGORY:
            return state.set('category', action.data);
        case CHANGE_ALPHA:
            return state.set('alpha', action.data);
        default:
            return state;
    }
};

//Provider 组件
export const Data: FC = (props) => {
    //useReducer 的第二个参数中传入初始值
    const [data, customDispatch] = useReducer(reducer, fromJS({
        category: '',
        alpha: ''
    }));
    return (
        <CategoryDataContext.Provider value={{ data, customDispatch }
        }>
            {props.children}
        </CategoryDataContext.Provider>
    )
}