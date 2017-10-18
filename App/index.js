import React from 'react';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import Reducers  from './Reducers/Reduers';
import AppLayouts from "./Layout/AppLayouts";
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
require("./app.less")
/**thunkMiddleware允许我们dispatch()函数*/
ReactDOM.render(
    <Provider store={createStore(Reducers,applyMiddleware(thunkMiddleware))}>
        <AppLayouts/>
    </Provider>,
    document.getElementById("app")
);