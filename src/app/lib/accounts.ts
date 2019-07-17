import * as Promise from 'bluebird';
import * as lokistore from 'lokijs';
import { LokiFsAdapter, Collection } from 'lokijs'
import { join } from 'path';
import { EventEmitter } from 'events';
import * as bcrypt from 'bcryptjs';

export interface ISysAccount {
  '$loki'?: number;
  name: string;
  host: string;
  description?: string;
  username: string;
  password: string;
  selected: boolean;
}

export class SysAccount {
  public db: lokistore;
  public collection: Collection;
  public changes = new EventEmitter();
  private accounts: ISysAccount;
  constructor() {}
  init(dbName): Promise<any> {
    return new Promise(resolve => {
      const adapter = new LokiFsAdapter();
      this.db = new lokistore(
        join(__dirname, `../${dbName}.db`), {
          adapter,
          autoload: true,
          autosave: true,
          autosaveInterval: 4000,
          autoloadCallback: () => {
            this.collection = this.db.getCollection(dbName);
            if(!this.collection) {
              this.collection = this.db.addCollection(dbName);
            }
            return resolve(this.collection);
          }
        }
      )
    })
  }
  private genSalt() {
    return bcrypt.genSalt(10);
  }
  private hashPassword(salt, pass) {
    return bcrypt.hash(pass, salt);
  }
  private saveLocal(accounts) {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }
  private storePass({ id, password }) {
    const accounts: any = JSON.parse(localStorage.getItem('accounts'));
    if(accounts.find(a => a.id === id)) return;
    else {
      accounts.push({ id, password });
      this.saveLocal(accounts);
    }
  }
  private getLocalAccounts(id?: string) {
    const accounts: any = JSON.parse(localStorage.getItem('accounts'));
    if(id) {
      return accounts.find(account => account.id === id);
    } else {
      this.accounts = accounts;
    }
  }
  add(data: ISysAccount): Promise<ISysAccount> {
    return new Promise(resolve => this.genSalt().then(salt => 
      this.hashPassword(salt, data.password).then(hash => {
        let document = this.collection.insert({
          name: data.name,
          host: data.host,
          description: data.description || '',
          username: data.username,
          password: hash,
          selected: true
        });
        this.storePass({
          id: document['$loki'],
          password: data.password
        });
        return resolve(document);
      })
    ))
  }
  get(query?: any): Promise<ISysAccount|ISysAccount[]> {
    return new Promise(resolve => {
      if(!query) {
        let records: Collection = JSON.parse(
          JSON.stringify(this.db.getCollection('accounts'))
        )
        return Promise.map(records.data, (record: any) => {
          let password = this.getLocalAccounts(record['$loki']).password;
          record.password = password;
          return record;
        }).then(resolve);
      }
      let record = this.collection.get(query.id);
      let password = this.getLocalAccounts(query.id);
      record.password = password;
      return resolve(record);
    })
  }
  modify(record: ISysAccount) {
    this.changes.emit('changed', record);
    return Promise.resolve(
      this.collection.update(record)
    )
  }
}