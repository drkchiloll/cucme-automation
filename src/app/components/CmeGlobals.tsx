import * as React from 'react';
import { Component } from 'react';
import {
  CmeInit,
  CorDialog,
  Templates,
  Translations
} from './';
import { Button, Typography, colors } from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';

const styles = (theme:Theme) => ({
  btn: {
    backgroundColor: colors.blueGrey[300],
    color: 'white'
  }
})

class Globals extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Typography variant="h5" gutterBottom>
          Global Configurations
        </Typography>
        <Button
          className={this.props.classes.btn}
          variant='contained'
          onClick={() => this.props.toggleInit()}
        >
          Push Global Configurations
        </Button>
        <CorDialog />
        <Translations />
        <Templates />
        <CmeInit
          initCme={this.props.initCme}
          closeInit={this.props.closeInit} 
          cme={this.props.cme}
        />
      </div>
    )
  }
}
const CmeGlobals = withStyles(styles)(Globals);
export { CmeGlobals };