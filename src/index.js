import React from 'react';
import ReactDOM from 'react-dom';
import Home from './home';
import Demo from './Demo';
import {Provider} from 'react-redux';
import store from './store'


ReactDOM.render(<Provider store={store}><Home /></Provider>, document.getElementById('root'));
