import * as React from 'react';
import { Component } from 'react';
import { Generic, JsxFunc } from '../components';

export class App extends Component<any, any> {
  render() {
    return (
      <div style={{ marginLeft: '20px' }}>
        <Generic />
        <JsxFunc message='This is an JSX Exported Function' />
      </div>
    );
  }
}