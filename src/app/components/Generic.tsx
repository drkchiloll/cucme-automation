import * as React from 'react';
import { Component } from 'react';

export class Generic extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Rendered Component'
    };
  }
  render() {
    return (
      <div> This is a { this.state.message } </div>
    );
  }
}