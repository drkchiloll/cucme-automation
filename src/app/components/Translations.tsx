import * as React from 'react';
import MaterialTable from 'material-table';
import * as Promise from 'bluebird';
import {
  Grid, ExpansionPanel, ExpansionPanelDetails, 
  ExpansionPanelSummary, Button
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons'

export class Translations extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      rules: [{
        id: 1,
        tag: 1,
        rule: `/7030/ /8073077201/`
      }, {
        id: 1,
        tag: 2,
        rule: `/705[0234]/ /8703077555/`
      }, {
        id: 1,
        tag: 3,
        rule: `/^708[2345]/ /8703077555` 
      }, {
        id: 1,
        tag: 4,
        rule: `/^..../ /870307$/`
      }, {
        id: 2,
        tag: 1,
        rule: `/.*(....\)/ /\1/`
      }],
      profiles: [{
        name: 'toPSTN',
        rule: 1,
        who: 'calling'
      }, {
        name: 'fromPSTN',
        rule: 2,
        who: 'called'
      }]
    };
  }
  render() {
    const {
      rules, profiles 
    } = this.state;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <b>Translations</b>
        </ExpansionPanelSummary>
        <br/>
        <ExpansionPanelDetails>
          <Grid container spacing={2}>
            <Grid item sm={6}>
              <MaterialTable 
                title='Rules'
                options={{ padding: 'default' }}
                columns={[
                  { title: 'ID', field: 'id', type: 'numeric' },
                  { title: 'Rule #', field: 'tag', type: 'numeric' },
                  { title: 'Rule', field: 'rule' }
                ]}
                data={rules}
                editable={{
                  onRowAdd: this.rulesAddUpdate,
                  onRowUpdate: this.rulesAddUpdate,
                  onRowDelete: this.deleteRules
                }}
              />
            </Grid>
            <Grid item sm={6}>
              <MaterialTable 
                title='Profiles'
                options={{ padding: 'default' }}
                columns={[
                  { title: 'Name', field: 'name' },
                  { title: 'Xlate ID', field: 'rule', type: 'numeric' },
                  { title: 'Xlate Party', field: 'who', lookup: {
                    called: 'called',
                    calling: 'calling'
                  } }
                ]}
                data={profiles}
                editable={{
                  onRowAdd: this.addUpdateProfile,
                  onRowUpdate: this.addUpdateProfile,
                  onRowDelete: this.deleteProfile
                }}
              />
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
  rulesAddUpdate = (newData, oldData?) => Promise.delay(500).then(() => {
    const { rules } = this.state;
    if(oldData) {
      const idx = rules.indexOf(oldData);
      rules[idx] = newData;
    } else {
      rules.push(newData);
    }
    this.setState({ rules });
  })
  deleteRules = oldData => Promise.delay(500).then(() => {
    const { rules } = this.state;
    const idx = rules.indexOf(oldData);
    rules.splice(idx, 1);
    this.setState({ rules });
  })
  addUpdateProfile = (newData, oldData?) => Promise.delay(500).then(() => {
    const { profiles } = this.state;
    if(oldData) {
      const idx = profiles.indexOf(oldData);
      profiles[idx] = newData;
    } else {
      profiles.push(newData);
    }
    this.setState({ profiles });
  })
  deleteProfile = oldData => Promise.delay(500).then(() => {
    const { profiles } = this.state;
    const idx = profiles.indexOf(oldData);
    profiles.splice(idx, 1);
    this.setState({ profiles });
  })
}