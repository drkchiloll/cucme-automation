import axios, { AxiosInstance } from 'axios';
import { readdir, readFile, writeFile } from 'fs';
import { join } from 'path';
import * as Promise from 'bluebird';
import * as moment from 'moment';

export class Updator {
  private GH_TOKEN = '8cb9fc73fe31907aa9d12fd487b051d75b1c8e52';
  private GH_URL = 'https://api.github.com/repos/drkchiloll/'
  private GH_REPO = 'cucme-updates';
  public readonly ROOT_DIR = join(__dirname);
  public dateFormat = 'MM/DD/YYYY h:mm:a';
  public requestor: AxiosInstance;
  constructor() {
    this.requestor = axios.create({
      baseURL: this.GH_URL + this.GH_REPO,
      headers: {
        Authorization: `Bearer ${this.GH_TOKEN}`,
        Accept: 'application/json'
      }
    });
  }

  getLocalFiles() {
    return new Promise(resolve => {
      readdir(this.ROOT_DIR, (err, files) => resolve(files));
    });
  }

  setUpdatedDate() {
    localStorage.setItem('lastUpdated', moment().format(this.dateFormat));
    return Promise.resolve('/contents');
  }

  filterRepo(files: any[]) {
    return Promise.filter(files, ({ name, git_url }) =>
      name.includes('bundle.js') || name === 'index.html'
    ).then(files => Promise.map(files, f =>
      ({ name: f.name, uri: f.git_url })
    ))
  }

  processFiles(files: any[]) {
    return Promise.map(files, f =>
      this.requestor.get(f.uri).then(({ data: { content } }) => {
        let encoding = 'base64';
        return Object.assign(f, {
          content: Buffer.from(content, encoding)
            .toString('utf-8')
        });
      }));
  }

  getLocalFile({ rootdir, name }) {
    return new Promise(resolve => {
      readFile(`${rootdir}/${name}`, 'utf-8', (err, file) =>
        resolve(file))
    });
  }

  writeLocal({ rootdir, name, content }) {
    return new Promise(resolve => {
      let encoding = 'utf-8';
      if(name.includes('.jar')) {
        rootdir = rootdir + '/java';
        encoding = null;
      }
      writeFile(`${rootdir}/${name}`, content, (err) =>
        resolve('done'))
    })
  }

  compareFiles(files: any[], rootdir) {
    return Promise.reduce(files, (a, { name, content }) => {
      if(name.includes('.jar')) {
        a.push({ name, content });
        return a;
      }
      return this.getLocalFile({ rootdir, name })
        .then(local => {
          if(local != content) a.push({ name, content });
          return a;
        });
    }, [])
  }

  updateLocal(files: any[], rootdir) {
    console.log(files);
    if(files.length > 0) {
      return Promise.each(files, ({ name, content }) => {
        return this.writeLocal({ rootdir, name, content })
      }).then(() => true);
    } else {
      return false;
    }
  }
}

export const updateService = (() => {
  const service: any = {
    start() {
      const updator = new Updator();
      const rootdir = updator.ROOT_DIR;
      return updator.setUpdatedDate()
        .then(path => updator.requestor.get(path)
          .then(({ data }) => {
            console.log(data)
            return data
          }))
        .then(files => updator.filterRepo(files))
        .then(files => updator.processFiles(files))
        // .then(files => updator.compareFiles(files, rootdir))
        .then(files => updator.updateLocal(files, rootdir));
    }
  };
  return service;
})();