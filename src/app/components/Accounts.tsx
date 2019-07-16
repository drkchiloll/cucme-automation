import * as React from 'react';
import { Component } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button
} from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/styles/createStyles';
import { AccountList } from './';

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
      uiAccount: {
        name: '',
        host: '',
        username: '',
        password: ''
      }
    }
  }
  componentWillMount() {
    const selectedAccount = this.props.accounts.findIndex(a => a.selected);
    this.setState({ selectedAccount })
  }
  selectAccount = item => {
    const { accounts } = this.props;
    accounts.forEach(a => a.selected = false);
    accounts[item].selected = true;
    this.props.updateAccount(accounts);
  }
  handleNewAccountChange = (e) => {
    const { accounts } = this.props;
    const index = accounts.findIndex(a => a.selected);
    this.props.accountDb.changes.emit('changes', {
      prop: e.target.name,
      value: e.target.value,
      index
    })
    // this.props.accountChange({
    //   prop: e.target.name,
    //   value: e.target.value,
    //   index
    // });
  }
  genForm = () => {
    const { classes, accounts } = this.props;
    const selectedAccount = accounts.findIndex(a => a.selected);
    let account = accounts[selectedAccount]   
    const acctProps = ['name', 'host', 'username', 'password'];
    return acctProps.map((p, i) =>
      <Grid item sm={12} key={`form_${i}`} className={classes.textSpacing}>
        <TextField
          fullWidth
          name={p}
          label={p.substring(0,1).toUpperCase() + p.substring(1)}
          value={account[p]}
          onChange={this.handleNewAccountChange}
          type={(() => p==='password'? 'password': 'text')()}
        />
      </Grid>
    )
  }
  render() {
    const { classes, accounts } = this.props;
    const selectedAccount = accounts.findIndex(a => a.selected);
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
                addNewAccount={this.props.addEmptyAccount}
              />
            </Grid>
            <Grid item sm={7}>
              { this.genForm() }
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            onClick={() => {
              this.props.accountDb.add(account).then(() => {
                this.props.accountDb.get().then(accounts =>
                  this.props.updateAccount({ accounts })
                )
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