import './vendor';
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { App } from './container';
let accounts = JSON.parse(localStorage.getItem('accounts'));
if(!accounts) {
  localStorage.setItem('accounts', JSON.stringify([{
    id: 1,
    password: 'C1sco12345'
  }]));
}
ReactDom.render(<App />, document.getElementById('app'));
