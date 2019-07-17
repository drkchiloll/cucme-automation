import * as React from 'react';
import { Component } from 'react';
import { ipcRenderer } from 'electron';
import { Phones, Updates, CmeGlobals } from '../components';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Api, SysAccount } from '../lib';

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
    ipcRenderer.on('update', () => this.setState({ update: true }));
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
  handleCsvImport = csv => {
    this.cme.parseCsv(csv).then(cutSheet => this.setState({
      cutSheet
    }))
  }
  render() {
    let { update, initCme, cutSheet } = this.state;
    return (
      <div style={{ marginLeft: '15px' }}>
        <CmeGlobals 
          cme={this.cme}
          initCme={initCme}
          closeInit={() => this.setState({ initCme: false })}
          toggleInit={() => this.setState({ initCme: !initCme })}
        />
        <Phones cutSheet={cutSheet} cme={this.cme} />
        {
          update ? 
            <Updates
              update={update}
              close={() => this.setState({ update: false })}
            />:
            <></>
        }
      </div>
    );
  }
}
const App = withStyles(styles)(Comp);
export { App }