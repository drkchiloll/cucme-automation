import * as React from 'react';
import { Component } from 'react';
import { ipcRenderer } from 'electron';
import {
  TitleBar, Phones, Updates, CmeGlobals, GcTextSpeech
} from '../components';
import {
  withStyles, createStyles, createMuiTheme
} from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles'
import { Api, SysAccount, GcTextToSpeech } from '../lib';
import {
  colors
} from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: colors.blueGrey
  },
});
const styles = theme => createStyles({
  root: {
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 5
  },
  textField: {
    backgroundColor: colors.blueGrey[100],
    underline: {
      borderBottom: colors.blueGrey[200]
    }
  },
  btn: {
    backgroundColor: colors.blueGrey[300],
    color: 'white'
  }
});

class Comp extends Component<any, any> {
  public cme: Api;
  public tts: GcTextToSpeech;
  public accounts = new SysAccount();
  constructor(props) {
    super(props);
    this.state = {
      cutSheet: null,
      update: false,
      initCme: false,
      accounts: [],
      fileName: '',
      txtSpeech: '',
      fileDownload: ''
    }
  }
  componentDidMount() {
    this.tts = new GcTextToSpeech();
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
    this.forceUpdate();
  })
  handleCsvImport = csv => {
    this.cme.parseCsv(csv).then(cutSheet => this.setState({
      cutSheet
    }))
  }
  render() {
    const { classes } = this.props;
    let { update, initCme, cutSheet, txtSpeech, fileName, fileDownload } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <div style={{ marginLeft: '15px' }}>
          <TitleBar
            importFile={this.handleCsvImport}
            cme={this.cme}
            accountDb={this.accounts}
          /><br/>
          <CmeGlobals 
            cme={this.cme}
            initCme={initCme}
            closeInit={() => this.setState({ initCme: false })}
            toggleInit={() => this.setState({ initCme: !initCme })}
          />
          <Phones cutSheet={cutSheet} cme={this.cme} />
          <GcTextSpeech />
          {
            update ? 
              <Updates
                update={update}
                close={() => this.setState({ update: false })}
              />:
              <></>
          }
        </div>
      </ThemeProvider>
    );
  }
  handleTxtChange = e => {
    const txtSpeech = e.target.value;
    this.setState({ txtSpeech });
  }
}
const App = withStyles(styles)(Comp);
export { App }