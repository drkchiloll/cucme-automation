/* API */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { Client, ClientChannel, ConnectConfig } from 'ssh2';
import * as xpath from 'xpath';
import { DOMParser as dom } from 'xmldom';
import axios, { AxiosInstance } from 'axios';
import * as Promise from 'bluebird';
import { cmeXmlFactory } from './cme-xml';
import { sshFactory } from './cme-ssh';
import * as csv from 'csvtojson';
import { join } from 'path';
const cmeService = cmeXmlFactory();

const hosts = [{
  host: '10.232.0.253',
  user: 'admin',
  pass: 'Il2w@a!'
}, {
  host: '10.10.20.48',
  user: 'developer',
  pass: 'C1sco12345'
}]
export class Api {
  public request: AxiosInstance;
  public csvData: any;
  public sh: Client;
  constructor() {
    this.request = axios.create({
      baseURL: `http://${hosts[1].host}/ios_xml_app/cme`,
      auth: {
        username: hosts[1].user,
        password: hosts[1].pass
      },
      headers: {
        'Content-Type': 'text/xml',
        Accept: 'text/xml'
      }
    })
  }
  initSSH() {
    return sshFactory.est({
      host: hosts[1].host,
      user: hosts[1].user,
      pass: hosts[1].pass
    });
  }
  apiEnable(ssh) {
    return sshFactory.enableApi({
      xmlUser: 'developer',
      xmlPassword: 'C1sco12345',
      ssh
    })
  }
  parseCsv(input: any) {
    return csv().fromFile(input.path)
      .then(csvData => Promise.reduce(csvData, (a, d, i) => {
        if(!d.dn) return a;
        if(d.type === 'ANALOG') {
          a['analog'].push({
            port: d.mac,
            dn: d.dn,
            name: d.name,
            number: d.description,
            type: d.type,
            corList: d.corList || 'employee',
            callerId: true
          });
        } else {
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
        }
        return a;
      }, { phones: [], dns: [], analog: []}))
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
  configureGlobals(ssh: any) {
    /**
     * The API Needs to Enabled
     * I could use SSH to push this config
     */
    return cmeService.createGlobals().then(xmls =>
      Promise.each(xmls, xml => this.request.post(
        '/', xml
      ).then(({ data }) => {
        ssh.emit('configpush', [xml]);
        return;
      })).then(() => {
        ssh.emit('configpush', 'end');
        ssh.end();
        return;
      })
    )
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
  templates: [{
    tag: 1,
    cmds: [
      'button-layout 1 line',
      'button-layout 2 blf-speed-dial',
      'softkeys ringIn Answer iDivert DND',
      'softkeys seized Redial Endcall Pickup Gpickup Cfwdall Meetme',
      'conference drop-mode local',
      'transfer max-length 12'
    ]
  }, {
    tag: 2,
    cmds: [
      'button-layout 1-2 line',
      'button-layout 3-7 blf-speed-dial',
      'softkeys ringIn Answer iDivert DND',
      'softkeys seized Redial Endcall Pickup Gpickup Cfwdall Meetme',
      'conference drop-mode local',
      'transfer max-length 12'
    ]
  }],
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