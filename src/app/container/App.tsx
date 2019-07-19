import * as React from 'react';
import { Component } from 'react';
import { ipcRenderer } from 'electron';
import { TitleBar, Phones, Updates, CmeGlobals } from '../components';
import {
  withStyles, createStyles, createMuiTheme
} from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles'
import { SaveAlt } from '@material-ui/icons';
import { Api, SysAccount, GcTextToSpeech } from '../lib';
import {
  Button,
  IconButton,
  TextField,
  Tooltip,
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
          {
            update ? 
              <Updates
                update={update}
                close={() => this.setState({ update: false })}
              />:
              <></>
          }
          <TextField
            label={<div style={{color:'black'}}>File Name For Recording</div>}
            name='fileName'
            margin='normal'
            onChange={e => this.setState({ fileName: e.target.value })}
            value={fileName}
          />
          <TextField
            id="filled-multiline-static"
            label={<div style={{color: 'black'}}>Enter Text</div>}
            name='txtSpeech'
            multiline
            rows="8"
            className={classes.textField}
            margin="normal"
            variant="filled"
            value={txtSpeech}
            fullWidth
            onChange={this.handleTxtChange}
          />
          <Button
            className={classes.btn}
            color='primary'
            disabled={!fileName && !txtSpeech}
            variant='contained'
            onClick={() => this.tts.synthesize({
              text: txtSpeech,
              fileName
            }).then((fileDownload) => {
              this.setState({ txtSpeech: '', fileName: '', fileDownload });
            })}
          >
            Convert to Speech
          </Button>
          {
            fileDownload &&
            <Tooltip title='Download File'>
              <IconButton
                href={fileDownload}
                aria-label='Download File'
                download
              >
                <SaveAlt />
              </IconButton>
            </Tooltip>
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