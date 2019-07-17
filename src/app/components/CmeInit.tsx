import * as React from 'react';
import { Component } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Button, CircularProgress
} from '@material-ui/core';
import { blueGrey, cyan } from '@material-ui/core/colors';
import { Theme, withStyles, createStyles } from '@material-ui/core/styles';
import { Client } from 'ssh2';

const styles = (theme: Theme) => createStyles({
  root: { display: 'flex', alignItems: 'center' },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: blueGrey[200],
    '&:hover': {
      backgroundColor: blueGrey[400]
    }
  },
  buttonProgress: {
    color: cyan[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
})

export class CmeInitialization extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      executing: false,
      success: false,
      messages: []
    }
  }
  runInit = () => {
    const { templates, cor, cme } = this.props;
    this.setState({ executing: true })
    return cme.initSSH().then((ssh: Client) => {
      ssh.addListener('configpush', res => {
        const { messages } = this.state;
        if(res == 'end') {
          this.setState({
            executing: false,
            success: true 
          })
        } else {
          let newArr = messages.concat(res);
          this.setState({ messages: newArr });
        }
      })
      return cme.apiEnable(ssh).then((ssh) =>
        cme.configureGlobals(ssh)
      )
    })
  }
  render() {
    let { executing, messages } = this.state;
    return <>
      <Dialog
        open={this.props.initCme}
        maxWidth={'md'}
        keepMounted
        onClose={() => {}}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Cisco Communications Manager Express Initialization"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            This Action will enable the CME XML/AXL API with the following:
            <br/>
            <code>
              ip http server <br/>
              ixi transport http <br/>
              &nbsp;&nbsp;... <br/>
              &nbsp;&nbsp;no shutdown <br/>
              ixi application cme <br/>
              &nbsp;&nbsp;response timeout 30 <br/>
              &nbsp;&nbsp;no shutdown <br/>
              telephony-service <br/>
              &nbsp;&nbsp;xml use [username] password [password] [privilege #]
            </code>
            <br/><br/>
            This will also configure other various mechanism such as Presence
            in order Busy Lamp Fields to work properly for IP Phones ... <br/><br/>
            { messages.map((m, i) =>
              <span key={i}><b>{m}</b><br/></span>)
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className={this.props.classes.wrapper}>
            <Button
              className={this.props.classes.buttonSuccess}
              disabled={executing}
              onClick={this.runInit}
              color="primary"
            >
              Execute Initialization
            </Button>
            { 
              executing &&
                <CircularProgress
                  size={28}
                  thickness={5}
                  className={this.props.classes.buttonProgress}
                />
            }
          </div>
          <Button
            onClick={this.props.closeInit}
            className={this.props.classes.buttonSuccess}
            color="primary"
          >
            Done  
          </Button>
        </DialogActions>
      </Dialog> 
    </>;
  }
}

const CmeInit = withStyles(styles)(CmeInitialization);
export { CmeInit };