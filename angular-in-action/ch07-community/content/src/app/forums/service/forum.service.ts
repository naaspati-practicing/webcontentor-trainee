import { Injectable } from '@angular/core';
import { Users, Data, Forum, Thread } from './data';

@Injectable()
export class ForumService {
  private _users = Users;
  private _data: Forum[] = Data;

  constructor() { }

  get forums() {
    return this._data;
  }
  get users() {
    return this._users;
  }
  forum(forumAlias: string):Forum {
    return this._data.find(row => row.alias === forumAlias);
  }
  threads(forumAlias: string): Thread[] {
    return this.forum(forumAlias).threads;
  }
  thread(forumAlias: string, threadAlias: string): Thread {
    return this.threads(forumAlias).find(t => t.alias === threadAlias);
  }
}
