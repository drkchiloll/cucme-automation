import * as React from 'react';
import { Component } from 'react';
import { Accounts } from './';
import { AppBar, Toolbar, Button, Typography } from '@material-ui/core';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
// import { createStyles } from '@material-ui/styles';
import { blueGrey } from '@material-ui/core/colors';

const styles = (theme: Theme) => createStyles({
  barStyles: {
    backgroundColor: blueGrey[300]
  },
  title: {
    flexGrow: 1,
  },
})

class Title extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      addAccount: false
    }
  }
  render() {
    const { classes, cme } = this.props;
    return (
      <>
        <AppBar
          position='static'
          className={classes.barStyles}
        >
          <Toolbar>
            <Typography variant='h6' className={classes.title}>
              Cisco Communications Manager Express Automation
            </Typography>
          <input
            style={{ display: 'none' }}
            accept="text/csv"
            id="csv-file"
            type="file"
            onChange={(e) => {
              const files: any = document.getElementById('csv-file');
              if(!files.files) return;
              this.props.importFile(files.files[0]);
            }}
          />
          <label htmlFor="csv-file">
            <Button component="span" color='inherit'> 
              Import CSV
            </Button>
          </label>
          <Button
            component="span"
            color='inherit'
            onClick={() => this.setState({ addAccount: true })}
          > 
            Accounts 
          </Button>
          </Toolbar>
        </AppBar>
        {
          this.state.addAccount &&
            <Accounts
              cme={cme}
              close={() => this.setState({ addAccount: false })}
              accountDb={this.props.accountDb}
            />
        }
      </>
    ) 
  }
}
const TitleBar = withStyles(styles)(Title);
export { TitleBar };