import * as React from 'react';
import { Component } from 'react';
import {
  Button
} from '@material-ui/core';
import { Api } from '../lib/api'
import { CorDialog } from './CorDialog'
import { Phones } from './Phones';


export class Generic extends Component<any, any> {
  public cme = new Api();
  constructor(props) {
    super(props);
    this.state = {
      corDialog: false
    };
  }
  render() {
    return (
      <>
        <Button
          variant='contained'
          onClick={() => {
            this.setState({
              corDialog: !this.state.corDialog
            })
          }}
        >
          Generate Best Practice Configurations 
        </Button>
        {
          this.state.corDialog ?
            <>
              <CorDialog />
              <Phones />
            </>
           :
           <></>
        }
      </>
    );
  }
}