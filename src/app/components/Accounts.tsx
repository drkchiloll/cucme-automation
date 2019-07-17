import * as React from 'react';
import { Component } from 'react';
import * as Promise from 'bluebird';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button
} from '@material-ui/core';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
// import createStyles from '@material-ui/styles/createStyles';
import { AccountList } from './';
import { Api } from '../lib';

const styles = (theme: Theme) => createStyles({
  acctDial: {},
  acctList: {
    padding: theme.spacing(2)
  },
  list: {
    overflow: 'auto',
    minHeight: 400,
    maxHeight: 400
  },
  textSpacing: {
    padding: theme.spacing(1)
  }
})

class Acct extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      selectedAccount: 0,
      accounts: []
    }
  }
  componentWillMount() {
    let { accountDb, cme } = this.props;
    accountDb.get().then(accounts => {
      const selectedAccount = accounts.findIndex(a => a.selected);
      this.setState({ accounts, selectedAccount });
      cme = new Api(accounts[selectedAccount]);
    });
  }
  selectAccount = item => {
    const { accounts } = this.state;
    accounts.forEach(a => a.selected = false);
    accounts[item].selected = true;
    this.props.cme.updateDevice(accounts[item]);
    this.setState({ accounts, selectedAccount: item});
    return Promise.each(accounts, (a: any) =>
      this.props.accountDb.modify(a) 
    )
  }
  handleNewAccountChange = e => {
    const { accounts } = this.state;
    const index = accounts.findIndex(a => a.selected);
    accounts[index][e.target.name] = e.target.value;
    this.setState({
      selectedAccount: index,
      accounts
    })
  }
  genForm = () => {
    const { accounts } = this.state
    const { classes } = this.props;
    const selectedAccount = accounts.findIndex(a => a.selected);
    let account = accounts[selectedAccount]   
    const acctProps = ['name', 'host', 'username', 'password'];
    return acctProps.map((p, i) =>
      <Grid item sm={12} key={`form_${i}`} className={classes.textSpacing}>
        <TextField
          fullWidth
          autoFocus
          name={p}
          label={p.substring(0,1).toUpperCase() + p.substring(1)}
          value={account[p]}
          onChange={this.handleNewAccountChange}
          type={(() => p==='password'? 'password': 'text')()}
        />
      </Grid>
    )
  }
  addNewAccount = () => {
    const { accounts } = this.state;
    accounts.push({
      name: 'NEW',
      host: '',
      username: '',
      password: ''
    });
    accounts.forEach(a => a.selected = false);
    let selectedAccount = accounts.length - 1;
    accounts[selectedAccount].selected = true;
    this.setState({ accounts, selectedAccount });
  }
  render() {
    const { classes } = this.props;
    const { accounts, selectedAccount } = this.state;
    let account = accounts[selectedAccount];
    return (
      <Dialog
        fullWidth
        className={classes.acctDial}
        open={true}
        maxWidth={'md'}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Account Management"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item sm={5}>
              <AccountList selectedAccount={selectedAccount}
                selectAccount={this.selectAccount}
                activeAccount={selectedAccount}
                account={account}
                accounts={accounts}
                addNewAccount={this.addNewAccount}
              />
            </Grid>
            <Grid item sm={7}>
              { accounts.length > 0 && this.genForm() }
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            onClick={() => {
              this.props.accountDb.add(account).then(() => {
                this.props.accountDb.get().then(accounts => {
                  this.props.cme.device = account;
                  this.setState({ accounts });
                })
              })
            }}
          >
            Save
          </Button>
          <Button variant='contained'
            onClick={this.props.close} 
          >
            Close 
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const Accounts = withStyles(styles)(Acct);
export { Accounts };