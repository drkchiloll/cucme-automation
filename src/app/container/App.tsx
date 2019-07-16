import * as React from 'react';
import { Component } from 'react';
import { ipcRenderer } from 'electron';
import {
  CorDialog, Phones, Templates,
  Translations, Updates, TitleBar
} from '../components';
import { Button, Paper, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { createStyles } from '@material-ui/styles';
import { Api, SysAccount } from '../lib';
import { CmeInit } from '../components/CmeInit';

const styles = theme => createStyles({
  root: {
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 5
  }
});

class Comp extends Component<any, any> {
  public cme: Api;
  public accounts = new SysAccount();
  constructor(props) {
    super(props);
    this.state = {
      cutSheet: null,
      update: false,
      initCme: false,
      accounts: []
    }
  }
  componentDidMount() {
    ipcRenderer.on('update', () => {
      this.setState({ update: true });
      console.log('I am trying to update you');
    });
    return this.accounts.init('accounts').then(({ data }) => {
      if(data.length === 0) {
        return this.accounts.add({
          name: 'DevnetSandbox',
          host: '10.10.20.48',
          username: 'developer',
          password: 'C1sco12345',
          selected: true
        })
      }
      return;
    }).then(() => this.getAccounts());
  }
  getAccounts = () => this.accounts.get().then(accounts => {
    this.setState({ accounts });
    const account = accounts.find(a => a.selected);
    this.cme = new Api({
      name: account.name,
      host: account.host,
      username: account.username,
      password: account.password
    });
  })
  addEmptyAccount = () => {
    let { accounts } = this.state;
    let account = {
      name: 'NEW', host: '', username: '', password: '', selected: true
    };
    let seleIdx = accounts.findIndex(a => a.selected);
    accounts[seleIdx].selected = false;
    accounts.push(account);
    this.setState({ account });
  }
  handleCsvImport = csv => {
    this.cme.parseCsv(csv).then(cutSheet => this.setState({
      cutSheet
    }))
  }
  render() {
    let { update, initCme, cutSheet } = this.state;
    const { classes } = this.props;
    return (
      <div style={{ marginLeft: '15px' }}>
        <TitleBar
          importFile={this.handleCsvImport}
          accounts={this.state.accounts}
          updateAccounts={this.getAccounts}
          accountDb={this.accounts}
          addNewAccount={this.addEmptyAccount}
        /><br/>
        <Typography variant="h5" gutterBottom>
          Global Configurations
        </Typography>
        <Button
          variant='contained'
          onClick={() => this.setState({ initCme: !initCme })}
        >
          Push Global Configurations
        </Button>
        <CorDialog />
        <Translations />
        <Templates />
        <Phones cutSheet={cutSheet} cme={this.cme} />
        {
          update ? 
            <Updates
              update={update}
              close={() => this.setState({ update: false })}
            />:
            <></>
        }
        <CmeInit
          initCme={initCme}
          closeInit={() => this.setState({ initCme: false })}
          cme={this.cme}
        />
      </div>
    );
  }
}
const App = withStyles(styles)(Comp);
export { App }