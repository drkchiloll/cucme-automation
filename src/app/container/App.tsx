import * as React from 'react';
import { Component } from 'react';
import { Generic } from '../components';

export class App extends Component<any, any> {
  render() {
    return (
      <div style={{ marginLeft: '20px' }}>
        <Generic />
      </div>
    );
  }
}