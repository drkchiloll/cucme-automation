import * as React from 'react';
import { Component } from 'react';
import { ipcRenderer } from 'electron';
import { CorDialog, Phones, Templates } from '../components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Api } from '../lib/api';
import { Updates } from '../components/Updator';

const styles = theme => ({
  root: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
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
      update: false
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
    return (
      <div style={{ marginLeft: '15px' }}>
        <Button
          className={classes.root}
          variant='contained'
          onClick={() => {
            this.setState({
              update: !this.state.update
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
        <Templates />
        <Phones cutSheet={this.state.cutSheet} />
        {
          this.state.update ? 
            <Updates
              update={this.state.update}
              close={() => this.setState({ update: false })}
            />:
            <></>
        }
      </div>
    );
  }
}

const App = withStyles(styles)(Comp);

export { App }