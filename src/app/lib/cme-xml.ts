import { DOMParser as dom } from 'xmldom';
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
        data.map(d => {
          const e = xml.createElement('CLI');
          const txt = xml.createTextNode(d);
          e.appendChild(txt);
          exec.appendChild(e);
        });
        reqTag.appendChild(exec);
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
    }
  };
  return xmlService;
}