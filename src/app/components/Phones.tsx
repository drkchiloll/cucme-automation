import * as React from 'react';
import MaterialTable from 'material-table';
import * as Promise from 'bluebird';
import {
  Grid, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Button
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

export class Phones extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let dns = this.props.cutSheet ? this.props.cutSheet.dns: [],
      devices = this.props.cutSheet ? this.props.cutSheet.phones: [];
    return (
      <>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <b>Devices and Directory Numbers</b>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={4}>
              <Grid sm={12} item>
                <MaterialTable
                  title='DNs'
                  options={{
                    padding: 'dense'
                  }}
                  columns={[
                    { title: 'ID', field: 'tag', type: 'numeric' },
                    { title: 'Number', field: 'number' },
                    { title: 'Name', field: 'name' },
                    { title: 'Label', field: 'label' },
                    { title: 'Presence', field: 'presence', type: 'boolean' },
                    { title: 'CFWDVM', field: 'cfwd', type: 'boolean' },
                    { title: 'CFWD Timeout', field: 'cfwdtimeout', type: 'numeric' },
                    { title: 'MWI', field: 'mwi', type: 'boolean' },
                    { title: 'Pickup Call', field: 'pickupCall' },
                    { title: 'Pickup-Group', field: 'pickupGroup', type: 'numeric' }
                  ]}
                  data={dns}
                  editable={{
                    onRowAdd: newData =>
                      new Promise(resolve => {
                        console.log(newData);
                        resolve()
                      }).then(() => Promise.delay(750)),
                    onRowUpdate: (newData, oldData) => new Promise(
                      resolve => resolve()
                    ),
                    onRowDelete: oldData => new Promise(
                      resolve => resolve()
                    )
                  }}
                />
              </Grid>
              <Grid sm={12} item>
                <MaterialTable
                  title='Devices'
                  options={{
                    padding: 'dense'
                  }}
                  columns={[
                    { title: 'ID', field: 'tag', type: 'numeric' },
                    { title: 'MAC', field: 'mac' },
                    { title: 'Type', field: 'type' },
                    { title: 'Description', field: 'description' },
                    { title: 'Template', field: 'template', type: 'numeric' },
                    { title: 'VAD', field: 'vad', type: 'boolean' },
                    { title: 'CORList', field: 'corList' },
                    { title: 'DTMF Relay', field: 'dtmfRelay' },
                    { title: 'Username', field: 'username' },
                    { title: 'Password', field: 'password' },
                    { title: 'BTN Busy Trigger', field: 'busyTrigger', type: 'numeric' },
                  ]}
                  data={devices}
                  editable={{
                    onRowAdd: newData =>
                      new Promise(resolve => {
                        console.log(newData);
                        resolve()
                      }).then(() => Promise.delay(750)),
                    onRowUpdate: (newData, oldData) => new Promise(
                      resolve => resolve()
                    ),
                    onRowDelete: oldData => new Promise(
                      resolve => resolve()
                    )
                  }}
                />
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </>
    )
  }
}