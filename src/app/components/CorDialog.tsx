import * as React from 'react';
import MaterialTable from 'material-table';
import * as Promise from 'bluebird';
import {
  Grid, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Button
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons'

export class CorDialog extends React.Component<any, any> {
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
          <b>Class of Restrictions</b>
        </ExpansionPanelSummary>
        <br/>
        <Button variant='contained' style={{marginLeft: 20}}>
          Add New COR List
        </Button>
        <ExpansionPanelDetails>
          <Grid container spacing={2}>
            <Grid item sm={3}> 
              <MaterialTable 
                title='COR Custom'
                columns={[
                  { title: 'Name', field: 'name' }
                ]}
                data={
                  (() => {
                    return custom.map((c: any) => {
                      return { name: c.name };
                    })
                  })()
                }
                editable={{
                  onRowAdd: newData =>
                    new Promise(resolve => {
                      console.log(newData);
                      custom.push(newData);
                      this.setState({ custom });
                      resolve()
                    }).then(() => Promise.delay(750)),
                  onRowUpdate: (newData, oldData) => new Promise(
                    resolve => resolve()
                  ),
                  onRowDelete: oldData => new Promise(
                    resolve => resolve()
                  )
                }}
                options={{ search: false, padding: 'dense' }}
              />
            </Grid>
            {
              lists.map((l: any, i) => {
                return (
                  <Grid item sm={3} xs={12} key={i}>
                    <MaterialTable
                      title={l.name.toUpperCase()}
                      options={{ search: false, padding: 'dense' }}
                      columns={[{
                        title: 'Members',
                        field: 'member',
                        lookup: (() => {
                          return custom.reduce((o: any, c: any, i) => {
                            o[i+1] = c.name;
                            return o;
                          }, {})
                        })()
                      }]}
                      data={
                        (() => {
                          return l.members.map((c: any) => {
                            return { member: c.member};
                          })
                        })()
                      }
                      editable={{
                        onRowAdd: newData =>
                          new Promise(resolve => {
                            console.log(newData);
                            custom.push(newData);
                            this.setState({ custom });
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
                )
              })
            }
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}