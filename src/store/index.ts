import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
// @ts-ignore
import { Iterable } from 'immutable';
import reducer from './reducer'
//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const stateTransformer = (state: { toJS: () => any; }) => {
    if (Iterable.isIterable(state)) return state.toJS();
    else return state;
};

const logger = createLogger({
    stateTransformer
});

const store = createStore(reducer, composeEnhancers(
    applyMiddleware(thunk),
    // applyMiddleware(logger)
));

export default store;