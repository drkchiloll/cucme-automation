import * as React from 'react';
import { Dialog, CircularProgress, IconButton } from '@material-ui/core';
import {
  Close as CloseIcon,
  Loop as ReloadIcon,
} from '@material-ui/icons';
import { updateService } from '../lib/updator';

export class Updates extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Checking for Updates....',
      updated: false,
      didUpdate: false
    };
  }
  componentWillMount() {
    let message: string;
    if(this.props.update) {
      updateService.start().then((didUpdate: boolean) => {
        if(didUpdate) {
          message = 'App update completed';
        } else {
          message = 'You have the latest version';
        }
        this.setState({ updated: true, didUpdate, message });
      })
    }
  }
  render() {
    const {
      message,
      updated,
      didUpdate
    } = this.state;
    return (
        <Dialog
          open={true}
          style={{
            position: 'relative',
            top: -170
          }}
          onClose={() => {}}
        >
          <div
            style={{
              height: 100,
              width: 350
            }} 
          >
            <b style={{
              position: 'relative',
              left: 20,
              top: 40
            }} >
              {message}
            </b>
            <div
              style={{
                position: 'relative',
                float: 'right',
                marginRight: 10,
                top: !updated ? 40:
                  updated ? 25 : !didUpdate ? 25: 40
              }} 
            >
              {
                updated && didUpdate ?
                  <IconButton
                    onClick={() => {
                      window.location.reload()
                    }} 
                  >
                    <ReloadIcon />
                  </IconButton> :
                !updated ?
                  <CircularProgress
                    size={24}
                    color='primary'
                  /> :
                updated && !didUpdate ?
                  <IconButton
                    onClick={this.props.close} 
                  >
                    <CloseIcon/>
                  </IconButton>: <></>
              }

            </div>
          </div>
        </Dialog>
    )
  }
}