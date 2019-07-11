import * as React from 'react';
import { Component } from 'react';
import { ipcRenderer } from 'electron';
import { Client } from 'ssh2';
import {
  CorDialog, Phones, Templates,
  Translations, Updates
} from '../components';
import { Button, Paper, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Api } from '../lib/api';
import { CmeInit } from '../components/CmeInit';

const styles = theme => ({
  root: {
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px', 
    color: 'grey',
    height: 48,
    padding: '0 30px',
  },
});

class Comp extends Component<any, any> {
  public cme = new Api();
  constructor(props) {
    super(props);
    this.state = {
      cutSheet: null,
      update: false,
      initCme: false
    }
  }
  componentDidMount() {
    ipcRenderer.on('update', () => {
      this.setState({ update: true });
      console.log('I am trying to update you');
    })
  }
  render() {
    const { classes } = this.props;
    let { initCme } = this.state;
    return (
      <div style={{ marginLeft: '15px' }}>
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
            Import Device CSV FILE
          </Button>
        </label>
        <Paper> 
          <div style={{ margin: 15 }}>
            <Typography variant="h5" gutterBottom>
              Global Configurations
            </Typography>
            <Button
              variant='contained'
              onClick={() => this.setState({ initCme: !initCme })}
            >
              Push Global Configurations
            </Button>
            <CorDialog />
            <Translations />
            <Templates />
          </div>
        </Paper>
        <Phones cutSheet={this.state.cutSheet} />
        {
          this.state.update ? 
            <Updates
              update={this.state.update}
              close={() => this.setState({ update: false })}
            />:
            <></>
        }
        <CmeInit
          initCme={initCme}
          closeInit={() => this.setState({ initCme: false })}
          cme={this.cme}
        />
      </div>
    );
  }
}

const App = withStyles(styles)(Comp);

export { App }