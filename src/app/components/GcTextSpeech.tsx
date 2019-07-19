import * as React from 'react';
import { Component } from 'react';
import {
  Grid, Button, IconButton, TextField, Tooltip, colors
} from '@material-ui/core';
import {
  withStyles,
  createStyles
} from '@material-ui/core/styles';
import { SaveAlt } from '@material-ui/icons';
import { GcTextToSpeech } from '../lib';

const styles = theme => createStyles({
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

class GCTTS extends Component<any, any> {
  public tts = new GcTextToSpeech();
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      txtSpeech: '',
      fileDownload: ''
    };
  }
  handleTxtChange = e => {
    const txtSpeech = e.target.value;
    this.setState({ txtSpeech });
  }
  convertText = () => {
    const { txtSpeech, fileName } = this.state;
    this.tts.synthesize({
      text: txtSpeech,
      fileName
    }).then(fileDownload => {
      this.setState({
        txtSpeech: '',
        fileName: '',
        fileDownload
      })
    })
  }
  render() {
    const { fileName, txtSpeech, fileDownload } = this.state;
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid container>
          <Grid item sm={4}>
            <TextField
              label={<div style={{color:'black'}}>File Name For Recording</div>}
              name='fileName'
              margin='normal'
              onChange={e => this.setState({ fileName: e.target.value })}
              fullWidth
              value={fileName}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item sm={4}>
            <TextField
              id="filled-multiline-static"
              label={<div style={{color: 'black'}}>Text To Convert</div>}
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
          </Grid>
        </Grid><br/>
          <Button
            className={classes.btn}
            color='primary'
            disabled={!fileName && !txtSpeech}
            variant='contained'
            onClick={this.convertText}
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
      </Grid>
    )
  }
}
const GcTextSpeech = withStyles(styles)(GCTTS)
export { GcTextSpeech };