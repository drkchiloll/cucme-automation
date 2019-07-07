import * as React from 'react';
import * as Promise from 'bluebird';
import {
  Grid, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Button
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons'

export class Templates extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      deviceSoftkeys: [{
        state: 'idle',
        displays: [
          'Redial',
          'Newcall',
          'Cfwdall',
          'Pickup',
          'Gpickup'
        ]
      }, {
        state: 'seized',
        displays: [
          'Redial',
          'Endcall',
          'Meetme',
          'Pickup',
          'Gpickup',
          'Cfwdall'
        ]
      }, {
        state: 'ringIn',
        displays: [
          'Redial',
          'Endcall',
          'Meetme',
          'Pickup',
          'Gpickup',
          'Cfwdall'
        ]
      }],
      devices: [{
        type: '7975',
        btnLayoutLine: '1 2',
        btnLayoutBlf: '3 4 5 6 7'
      }, {
        type: '7945',
        btnLayoutLine: '1 2'
      }]
    }
  }
  render() {
    const {
      devices
    } = this.state;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <b>Templates</b>
        </ExpansionPanelSummary>
        <br/>
        <Button variant='contained' style={{marginLeft: 20}}>
          Add New Template
        </Button>
        <ExpansionPanelDetails>
          <Grid container spacing={2}>
            <Grid item sm={3}> 
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}