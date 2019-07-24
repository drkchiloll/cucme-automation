/* API */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { Client } from 'ssh2';
import * as xpath from 'xpath';
import { DOMParser as dom } from 'xmldom';
import axios, { AxiosInstance } from 'axios';
import * as Promise from 'bluebird';
import { cmeXmlFactory } from './cme-xml';
import { sshFactory } from './cme-ssh';
import * as csv from 'csvtojson';
const cmeService = cmeXmlFactory();

type Device = {
  name: string;
  host: string;
  username: string;
  password: string;
}

export class Api {
  public device: Device;
  public request: AxiosInstance;
  public csvData: any;
  public sh: Client;
  constructor(device: Device) {
    this.device = device;
    this.updateReq(device);
  }
  updateReq(device: Device) {
    this.request = axios.create({
      baseURL: `http://${device.host}/ios_xml_app/cme`,
      auth: {
        username: device.username,
        password: device.password
      },
      headers: {
        'Content-Type': 'text/xml',
        Accept: 'text/xml'
      }
    })
  }
  updateDevice(device: Device) {
    this.device = device;
    this.updateReq(device)
  }
  initSSH() {
    return sshFactory.est({
      host: this.device.host,
      user: this.device.username,
      pass: this.device.password
    });
  }
  apiEnable(ssh) {
    return sshFactory.enableApi({
      xmlUser: this.device.username,
      xmlPassword: this.device.password,
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
            dn: i+1,
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
            corList: 'employee',
            pickupCall: d.pickupCall,
            pickupGroup: d.pickupGroup || undefined
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
    return cmeService.createGlobals(this.device).then(xmls =>
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
  deployDns(dirNums: any) {
    return Promise.map(dirNums, (dirNum: any) => {
      const config = [
        `ephone-dn ${dirNum.tag}`,
        `number ${dirNum.number}`,
        `name ${dirNum.name}`,
        `label ${dirNum.label}`,
        `allow watch`,
        `call-forward noan 7549 timeout ${dirNum.cfwdtimeout}`,
        `call-forward busy 7549`,
        `pickup-call any-group`,
        `corlist incoming ${dirNum.corList}`
      ];
      if(dirNum.pickupGroup) config.push(`pickup-group ${dirNum.pickupGroup}`)
      return cmeService.genXml({ method: 'cli', data: config });
    }).map(xml => this.request.post('/', xml).then(({ data }) => {
      console.log(data);
      return;
    }), { concurrency: 2 })
  }
  deployPhones(devices: any) {
    return Promise.map(devices, (device: any) => {
      let config = [
        `ephone ${device.tag}`,
        `mac-address ${device.mac}`,
        `type ${device.type}`,
        `presence call-list`,
        `description ${device.description}`,
        `ephone-template ${device.template}`,
        `conference drop-mode creator`,
        `conference add-mode creator`,
        `conference admin`,
        `no multicast-moh`,
        `device-security-mode none`,
        `button 1:${device.dn}`
      ];
      if(device.username && device.password) {
        config.push(
          `username ${device.username} password ${device.password}`
        );
      }
      return cmeService.genXml({ method: 'cli', data: config });
    }).map(xml => this.request.post('/', xml).then(({ data }) => {
      console.log(data);
      return data;
    }), { concurrency: 2 });
  }
  deployAnaStations(devices: any) {
    return Promise.map(devices, (device: any) => {
      let config = [
        `voice-port ${device.port}`,
        `description ${device.name}`,
        `station-id name ${device.name}`,
        `station-id number ${device.number}`,
        `caller-id enable`,
        `dial-peer voice ${device.dn} pots`,
        `corlist incoming ${device.corList}`,
        `destination-pattern ^${device.dn}$`,
        `port ${device.port}`
      ];
      return cmeService.genXml({ method: 'cli', data: config })
    }).map(xml => this.request.post('/', xml).then(({ data }) => {
      console.log(data);
      return data;
    }), { concurrency: 3 })
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