import * as React from 'react';
import { Component } from 'react';
import { CorDialog, Phones } from '../components';
import { Button } from '@material-ui/core';
import { Api } from '../lib/api'

export class App extends Component<any, any> {
  public cme = new Api();
  constructor(props) {
    super(props);
    this.state = { corDialog: false }
  }
  render() {
    return (
      <div style={{ marginLeft: '15px' }}>
        <Button
          variant='contained'
          onClick={() => {
            this.setState({
              corDialog: !this.state.corDialog
            })
          }}
        >
          Generate Configurations
        </Button>
        {
          this.state.corDialog ?
            <>
              <CorDialog />
              <Phones cutSheet={this.cme.csvData} /> 
            </> :
            <></>
        }
      </div>
    );
  }
}