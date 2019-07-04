/* API */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import * as xpath from 'xpath';
import { DOMParser as dom } from 'xmldom';
import axios, { AxiosInstance } from 'axios';
import * as Promise from 'bluebird';
import { cmeXmlFactory } from './cme-xml';
import * as csv from 'csvtojson';
import { join } from 'path';
const cmeService = cmeXmlFactory();
const csvFile = join(__dirname, './lyon_cut_sheet.csv');


export class Api {
  public request: AxiosInstance;
  public csvData: any;
  constructor() {
    this.request = axios.create({
      baseURL: 'http://10.232.0.253/ios_xml_app/cme',
      auth: {
        username: 'admin',
        password: 'Il2w@a!'
      },
      headers: {
        'Content-Type': 'text/xml',
        Accept: 'text/xml'
      }
    })
    let phDevices = {
      phones: [],
      dns: []
    };
    csv().fromFile(csvFile).then((csvData: any) => {
      return Promise.reduce(csvData, (a, d, i) => {
        if(!d.dn) {
          return a;
        }
        let phone = {
          tag: i+1,
          mac: d.mac,
          description: d.description,
          type: d.type,
          username: d.username, 
          password: d.password,
          template: 1,
          corList: 'employee',
          vad: true,
          dtmfRelay: 'rtp-nte',
          busyTrigger: 2
        }
        a['phones'].push(phone);
        let device = {
          tag: i+1,
          number: d.dn,
          label: d.label,
          name: d.name,
          presence: true,
          mwi: true,
          cfwd: true,
          cfwdtimeout: 20,
          pickupCall: d.pickupCall,
          pickupGroup: 1
        };
        a['dns'].push(device);
        return a;
      }, phDevices).then(d => {
        this.csvData = d;
        console.log(this.csvData);
      })
    })
  }
  get() {
    const xmlD = `
     <request>
      <ISgetVoiceRegGlobal>
      </ISgetVoiceRegGlobal>
     </request>  
    `
    return this.request.post(
      '/', xmlD
    ).then(({ data }) => {
      console.log(data);
      return;
    })
  }
  configure() {
    const config = cmeService.create();
    return this.request.post('/', config) 
      .then(({ data }) => {
        console.log(data);
        return;
      })
  }
  save() {
    const config = cmeService.saveConfig();
    return this.request.post('/', config).then(({ data }) => {
      console.log(data);
      return;
    })
  }
}

const cfg: any = {
  voiceGlobal: {
    codecs: [{
      name: '1',
      preferences: [
        'g722-64', 'g711ulaw'
      ]
    }],
    voip: [
      'no ip address trusted authenticate',
      'allow connections sip to sip',
      'fax protocol t38 version 0 ls-redundancy 0 hs-redundancy 0 fallback pass-through g711ulaw',
      'sip',
      'registrar server expires max 600 min 60'
    ],
    presence: [{
      subsystem: 'sip-ua',
      cmds: [
        'sip-ua',
        'prsence-enable'
      ]
    }, {
      subsystem: 'presence',
      cmds: [
        'presence',
        'max-subscriptions 500',
        'presence call-list'
      ]
    }]
  },
  cor: {
    custom: [
      { name: 'emergency' },
      { name: 'local' },
      { name: 'longdistance' },
      { name: 'international' },
      { name: 'paging-pres' }
    ],
    lists: [{
      name: 'lobby',
      members: [
        'emergency', 'local'
      ]
    }, {
      name: 'faculty',
      members: [
        'emergency', 'local', 'longdistance'
      ]
    }, {
      name: 'managers',
      members: [
        'emergency', 'local', 'longdistance', 'international'
      ]
    }],
    generated() {
      return this.custom.map((c: any) => {
        return {
          name: c.name,
          member: c.name
        }
      })
    }
  }
}

interface SipDn {
  number: number;
  name: string;
  label: string;
  presence: boolean;
  cfwd: boolean;
  cfwdTimeout: number;
  mwi: boolean;
  pickupCall: string;
  pickupGroup: number;
}

interface SipDevice {
  mac: string;
  btnBusyTrigger: number;
  type: string;
  btnAssignments: [{
    btnTag: number;
    dnTag: number;
  }],
  template: number;
  corList: string;
  description: string;
  dtmfRelay: string;
  username: string;
  password: string;
  vad: boolean;
}

const deviceTemplate = {
  /**
   * voice register template  2
    feature-button 1 PickUp
    feature-button 2 MeetMe
    feature-button 3 DnD
    button-layout 1-2 line
    button-layout 3 blf-speed-dial
    button-layout 4-6 feature-button
    softkeys ringIn  Answer iDivert DND
    softkeys seized  Redial Endcall Meetme Pickup Gpickup Cfwdall
    conference drop-mode local
    transfer max-length 12
    !
   */
}