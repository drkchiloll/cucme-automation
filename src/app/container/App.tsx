import * as React from 'react';
import { Component } from 'react';
import { CorDialog, Phones } from '../components';
import { Button } from '@material-ui/core';
import { Api } from '../lib/api'

export class App extends Component<any, any> {
  public cme = new Api();
  constructor(props) {
    super(props);
    this.state = {
      cutSheet: null
    }
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
        <input
          style={{ display: 'none' }}
          accept="text/csv"
          id="text-button-file"
          type="file"
          onChange={(e) => {
            const files: any = document.getElementById('text-button-file');
            this.cme.parseCsv(files.files[0]).then(cutSheet => {
              this.setState({ cutSheet });
            })
          }}
        />
        <label htmlFor="text-button-file">
          <Button component="span"> 
            Import Phones CSV 
          </Button>
        </label>
        <CorDialog />
        <Phones cutSheet={this.state.cutSheet} /> 
      </div>
    );
  }
}