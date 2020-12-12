import React from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import {StoreProvider} from "easy-peasy";

import App from './src/App';
import {store} from "./src/store/store";

ReactDOM.render(
    <StoreProvider store={store}><App /></StoreProvider>,
    document.querySelector('#root')
);