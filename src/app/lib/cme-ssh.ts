import { Client, ClientChannel, ConnectConfig } from 'ssh2';
import * as Promise from 'bluebird';

export const sshFactory = (() => {
  const service = {
    initCmds: [
      'config terminal',
      'ixi transport http',
      'response size 8',
      'request outstanding 2',
      'request timeout 30',
      'no shutdown',
      'ixi application cme',
      'response timeout 30',
      'no shutdown',
      'telephony-service',
      /** Set XML User/Password Here */
    ],
    est({ host, user, pass }) {
      const sshconfig: ConnectConfig = {
        host,
        port: 22,
        username: user,
        password: pass,
        keepaliveInterval: 7000
      };
      const ssh = new Client();
      ssh.connect(sshconfig);
      return new Promise(resolve => {
        ssh.on('ready', () => resolve(ssh));
      })
    },
    enableApi({ xmlUser, xmlPassword, ssh }) {
      const sh: Client = ssh;
      this.initCmds.push(
        `xml user ${xmlUser} password ${xmlPassword} 15`
      );
      let idx = 0;
      return new Promise(resolve =>
        sh.shell((e, channel) => {
          channel.setEncoding('utf8');
          channel.on('data', d => {
            if(idx === this.initCmds.length) {
              channel.close();
            }
            if(d.includes('#')) {
              if(idx <= this.initCmds.length) {
                sh.emit('configpush', {
                  increment: this.initCmds[idx]
                })
              }
              channel.write(this.initCmds[idx++] + '\n\r');
            }
          }).on('close', () => resolve());
        })
      )
    }
  }
  return service;
})()