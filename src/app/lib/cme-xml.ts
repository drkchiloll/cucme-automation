import { DOMParser as dom } from 'xmldom';
import * as Promise from 'bluebird';
const cmeAxl = (
  `
    <SOAP-ENV:Envelope>
      <SOAP-ENV:Body>
        <axl><request></request></axl> 
      </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
  `
)
export const cmeXmlFactory = () => {
  const xmlService: any = {
    genXml({ method, data}: any) {
      const xml = new dom().parseFromString(cmeAxl);
      const reqTag = xml.getElementsByTagName('request')[0];
      if(method === 'cli') {
        const exec = xml.createElement('ISexecCLI');
        return Promise.map(data, (d: any) => {
          const e = xml.createElement('CLI');
          const txt = xml.createTextNode(d);
          e.appendChild(txt);
          exec.appendChild(e);
          return;
        }).then(() => {
          reqTag.appendChild(exec);
          return xml.toString();
        })
      } else {
        const el = xml.createElement(method);
        reqTag.appendChild(el);
      }
      return xml.toString();
    },
    saveConfig() {
      return this.genXml({
        method: 'ISSaveConfig',
        data: []
      });
    },
    createGlobals() {
      const {
        codecs,
        voip,
        presence,
        voiceRegGlobal,
        templates,
        cor
      } = this.voiceGlobal;
      return Promise.all([
        Promise.reduce(codecs, (a, c: any, i) => {
          a.push(`voice class codec ${c.name}`);
          return Promise.map(c.preferences, (p, idx) => {
            a.push(`codec preference ${idx+1} ${p}`);
            return;
          }).then(() => a)
        }, []),
        Promise.reduce(templates, (a, t, i) => {
          a.push(`voice register template ${t.tag}`);
          return Promise.map(t.cmds, c => {
            a.push(c);
            return
          }).then(() => a);
        }, []),
        Promise.reduce(cor.custom, (a, cust) => {
          a.push(`name ${cust.name}`);
          return a;
        }, ['dial-peer cor custom']),
        Promise.reduce(cor.lists, (a, list) => {
          a.push(`dial-peer cor list ${list.name}`);
          return Promise.map(list.members, m => {
            a.push(`member ${m}`);
            return;
          }).then(() => a)
        }, [])
      ]).then(([c1, c2, c3, c4]) => {
        const model = [{
          func: 'Codec Use',
          data: c1
        }, {
          func: 'Voip Service',
          data: voip
        }, {
          func: 'Presence Subsystem',
          data: presence.cmds
        }, {
          func: 'Global Voice Register Subsystem',
          data: voiceRegGlobal.cmds
        }, {
          func: 'Voice Register Templates',
          data: c2
        }, {
          func: 'Custom Classes of Restriction (COR)',
          data: c3
        }, {
          func: 'COR Lists',
          data: c4
        }]
        return Promise.map(model, (c: any) => this.genXml({
          method: 'cli',
          data: c.data
        })).then(Promise.all)
      })
    },
    create() {
      const data = [
        'voice translation-rule 1',
        `rule 1 /^.*\(....\)/ /\1/`
      ];
      const xml = this.genXml({
        method: 'cli',
        data
      });
      console.log(xml);
      return xml;
    },
    voiceGlobal: {
      codecs: [{
        name: '1',
        preferences: [
          'g722-64', 'g711ulaw'
        ]
      }],
      voip: [
        'voice service voip',
        'no ip address trusted authenticate',
        'allow-connections sip to sip',
        'fax protocol t38 version 0 ls-redundancy 0 hs-redundancy 0 fallback pass-through g711ulaw',
        'sip',
        'registrar server expires max 600 min 60'
      ],
      presence: {
        cmds: [
          'sip-ua',
          'presence enable',
          'presence',
          'max-subscription 1200',
          'presence call-list',
        ]
      },
      voiceRegGlobal: {
        cmds: [
          'voice register global',
          'mode cme',
          'source-address 10.10.20.48 port 5060',
          'timeout interdigit 5',
          'max-dn 500',
          'max-pool 250',
          'authenticate register',
          'authenticate realm all',
          'hold-alert',
          'voicemail 7429',
          'tftp-path flash:',
          'file text'
        ]
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
          name: 'emergency',
          members: ['emergency']
        }, {
          name: 'local',
          members: ['local']
        }, {
          name: 'longdistance',
          members: ['longdistance']
        }, {
          name: 'international',
          members: ['international']
        }, {
          name: 'paging-pres',
          members: ['paging-pres']
        }, {
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
        }]
      }
    }
  };
  return xmlService;
}