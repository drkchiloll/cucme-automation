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
    this.state = {

    };
  }
  render() {
    return (
      <> 
        <MaterialTable
          title='Phones and DNs'
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
          data={[{
            tag: 1,
            number: 1000,
            name: 'The President',
            label: '1000 - The Pres',
            presence: true,
            cfwd: true,
            cfwdtimeout: 20,
            mwi: true,
            pickupCall: 'any-group',
            pickupGroup: 1
          }]}

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
        <MaterialTable
          title='Phones'
          columns={[
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
          data={[{
            mac: '0001.abab.9f9f',
            type: '7975',
            description: '8703077000',
            template: 1,
            vad: true,
            corList: 'employee',
            dtmfRelay: 'rtp-nte',
            username: 'user',
            password: 'myPass',
            busyTrigger: 2 
          }]}

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
      </>
    )
  }
}