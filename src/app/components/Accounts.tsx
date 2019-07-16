import * as React from 'react';
import { Component } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  colors
} from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/styles/createStyles';
import { GroupAdd, Delete } from '@material-ui/icons';
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
    padding: theme.spacing(3)
  }
})

class Acct extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      selectedAccount: 0
    }
  }
  componentWillMount() {
    const selectedAccount = this.props.accounts.findIndex(a => a.selected);
    this.setState({ selectedAccount })
  }
  selectAccount = item => this.setState({ selectedAccount: item })
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
                addNewAccount={this.props.addEmptyAccount} />
            </Grid>
            <Grid item sm={7}>
              <Grid item sm={12}>
                <TextField
                  fullWidth
                  label='Name'
                  value={account.name}
                />
              </Grid>
              <br/>
              <Grid item sm={12}>
                <TextField
                  fullWidth
                  label='CME IP'
                  value={account.host}
                />
              </Grid>
              <br/>
              <Grid item sm={12}>
                <TextField
                  fullWidth
                  label='username'
                  value={account.username}
                />
              </Grid>
              <br/>
              <Grid item sm={12}>
                <TextField
                  fullWidth
                  label='password'
                  value={account.password}
                  type='password'
                />
              </Grid>
              <br/>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='contained'>
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