process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import axios, { AxiosInstance } from 'axios';
import * as Promise from 'bluebird';
import { join } from 'path';
import { writeFile } from 'fs';

type TTSVoice = {
  languageCode: string;
  name: string;
  ssmlGender: string;
}
type TTSAudioConfig = {
  audioEncoding: string;
  effectsProfileId?: string;
}
type TTSReq = {
  input: { text: string; };
  voice: TTSVoice;
  audioConfig: TTSAudioConfig;
}

export class GcTextToSpeech {
  public request: AxiosInstance;
  private voice: TTSVoice;
  private audioConfig: TTSAudioConfig;
  private gcApiKey = localStorage.getItem('gcApiKey');
  constructor() {
    this.request = axios.create({
      baseURL: `https://texttospeech.googleapis.com/v1`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.voice = {
      languageCode: 'en-US',
      name: 'en-US-Wavenet-C',
      ssmlGender: 'FEMALE'
    };
    this.audioConfig = {
      audioEncoding: 'LINEAR16',
      effectsProfileId: 'telephony-class-application'
    }
  }
  synthesize(text: string) {
    const req: TTSReq = {
      input: { text },
      voice: {
        languageCode: this.voice.languageCode,
        name: this.voice.name,
        ssmlGender: this.voice.ssmlGender
      },
      audioConfig: {
        audioEncoding: this.audioConfig.audioEncoding,
        effectsProfileId: this.audioConfig.effectsProfileId
      }
    };
    return this.request.post(
      `/text:synthesize?key=${this.gcApiKey}`,
      req
    ).then(({ data }) => {
      const { audioContent } = data;
      if(data && data.audioContent) {
        return new Promise(resolve => writeFile(
          `${join(__dirname, './myFile.wav')}`,
          audioContent,
          { encoding: 'base64' }, (e) => resolve()
        ))  
      }
    }).catch(console.log)
  }
}

