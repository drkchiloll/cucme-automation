import * as React from 'react';
import { Component } from 'react';
import { AppBar, Toolbar, Button, Typography } from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';
import { createStyles, mergeClasses } from '@material-ui/styles';
import { blueGrey } from '@material-ui/core/colors';
import { Settings } from '@material-ui/icons';

const styles = (theme: Theme) => createStyles({
  barStyles: {
    backgroundColor: blueGrey[300],
    marginBottom: 10
  },
  title: {
    flexGrow: 1,
  },
})

class Title extends Component<any, any> {
  render() {
    const { classes } = this.props;
    return (
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
            const files: any = document.getElementById('csv-file').files[0];
            this.props.importFile(files);
          }}
        />
        <label htmlFor="csv-file">
          <Button component="span" color='inherit'> 
            Import CSV
          </Button>
        </label>
        </Toolbar>
      </AppBar>
    ) 
  }
}
const TitleBar = withStyles(styles)(Title);
export { TitleBar };