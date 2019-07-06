import * as React from 'react';
import MaterialTable from 'material-table';
import * as Promise from 'bluebird';
import {
  Grid, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Button
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons'

export class Templates extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      customfieldName: 'name',
      listFieldName: 'member',
      custom: [
        { name: 'emergency' },
        { name: 'local' },
        { name: 'longdistance' },
        { name: 'international' }
      ],
      lists: [{
        name: 'lobby',
        members: [
          { member: 1 },
          { member: 2 }
        ]
      }, {
        name: 'employee',
        members: [
          { member: 1 },
          { member: 2 },
          { member: 3 },
        ]
      }, {
        name: 'management',
        members: [
          { member: 1 },
          { member: 2 },
          { member: 3 },
          { member: 4 }
        ]
      }]
    }
  }
  render() {
    const {
      custom,
      lists
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