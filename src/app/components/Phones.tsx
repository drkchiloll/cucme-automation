import * as React from 'react';
import MaterialTable from 'material-table';
import * as Promise from 'bluebird';
import {
  Grid, ExpansionPanel, ExpansionPanelDetails,
  ExpansionPanelSummary, Button, CircularProgress
} from '@material-ui/core';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
// import { createStyles } from '@material-ui/styles';
import { ExpandMore } from '@material-ui/icons';
import { blueGrey, cyan } from '@material-ui/core/colors';

const styles = (theme: Theme) => createStyles({
  root: { display: 'flex', alignItems: 'center' },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  buttonSuccess: {
    backgroundColor: blueGrey[200],
    // '&:hover': {
    //   backgroundColor: blueGrey[300]
    // }
  },
  buttonProgress: {
    color: cyan[300],
    position: 'absolute',
    top: '50%',
    left: '25%',
    marginTop: -12,
    marginLeft: -12
  },
  smButtonProgress: {
    color: cyan[300],
    position: 'absolute',
    top: '50%',
    left: '15%',
    marginTop: -12,
    marginLeft: -12
  }
})

export class PhonesImport extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      dns: [],
      devices: [],
      analog: [],
      dnRunner: false,
      dnSuccess: false,
      devRunner: false,
      devSuccess: false,
      anaRunner: false,
      anaSuccess: false
    };
  }
  componentWillMount() {
    if(this.props.cutSheet && this.props.cutSheet.dns) {
      this.setState({
        dns: this.props.cutSheet.dns,
        devices: this.props.cutSheet.phones
      })
    }
  }
  componentWillReceiveProps(props) {
    if(props.cutSheet && props.cutSheet.dns.length > 0) {
      this.setState({
        dns: props.cutSheet.dns,
        devices: props.cutSheet.phones,
        analog: props.cutSheet.analog
      })
    }
  }
  dnInit = () => {
    const { dns } = this.state;
    const { cme } = this.props;
    this.setState({ dnRunner: true });
    return cme.deployDns(dns).then(() =>
      this.setState({ dnRunner: false, dnSuccess: true })
    )
  }
  devInit = () => {
    const { devices } = this.state;
    const { cme } = this.props;
    this.setState({ devRunner: true });
    return cme.deployPhones(devices).then(() =>
      this.setState({ devRunner: false, devSuccess: true })
    )
  }
  anaInit = () => {
    const { analog } = this.state;
    const { cme } = this.props;
    this.setState({ anaRunner: true });
    return cme.deployAnaStations(analog).then(() =>
      this.setState({ anaRunner: false, anaSuccess: true })
    )
  }
  render() {
    const { dns, devices, analog, dnRunner, devRunner, anaRunner } = this.state;
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
              <Grid sm={4} item>
                <div className={this.props.classes.wrapper}>
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={dnRunner}
                    className={this.props.classes.buttonSuccess}
                    onClick={this.dnInit}
                  >
                    Deploy Directory Numbers
                  </Button>
                  {
                    dnRunner &&
                      <CircularProgress 
                        size={28}
                        thickness={5}
                        className={this.props.classes.buttonProgress}
                      />
                  }
                </div>
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
              <Grid sm={4} item>
                <div className={this.props.classes.wrapper}>
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={devRunner}
                    className={this.props.classes.buttonSuccess}
                    onClick={this.devInit}
                  >
                    Deploy Phones
                  </Button>
                  {
                    devRunner &&
                      <CircularProgress 
                        size={28}
                        thickness={5}
                        className={this.props.classes.smButtonProgress}
                      />
                  }
                </div>
              </Grid>
              <Grid item sm={12}>
                <MaterialTable
                  title='Analog Devices'
                  options={{ padding: 'dense' }}
                  columns={[
                    { title: 'ID', field: 'port' },
                    { title: 'DN', field: 'dn' },
                    { title: 'Name', field: 'name' },
                    { title: 'Station Number', field: 'number' },
                    { title: 'Type', field: 'type' },
                    { title: 'COR List', field: 'corList' },
                    { title: 'CallerID', field: 'callerId', type: 'boolean' }
                  ]}
                  data={analog}
                />
              </Grid>
              <Grid sm={4} item>
                <div className={this.props.classes.wrapper}>
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={anaRunner}
                    className={this.props.classes.buttonSuccess}
                    onClick={this.anaInit}
                  >
                    Deploy Ana Stations 
                  </Button>
                  {
                    anaRunner &&
                      <CircularProgress 
                        size={28}
                        thickness={5}
                        className={this.props.classes.smButtonProgress}
                      />
                  }
                </div>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </>
    )
  }
}

const Phones = withStyles(styles)(PhonesImport);
export { Phones };