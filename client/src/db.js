// Lightweight in-browser collection emulation for the prototype.
// This avoids bundler issues with RxDB plugins in the demo environment.

class InMemoryCollection {
  constructor(name) {
    this.name = name;
    this.store = new Map();
  }

  async insert(doc) {
    const copy = { ...doc };
    this.store.set(copy._id, copy);
    return this._wrap(copy);
  }

  async upsert(doc) {
    const copy = { ...doc };
    this.store.set(copy._id, copy);
    return this._wrap(copy);
  }

  find() {
    const self = this;
    return {
      exec: async () => Array.from(self.store.values()).map((d) => self._wrap(d))
    };
  }

  _wrap(doc) {
    const self = this;
    return {
      toJSON: () => ({ ...doc }),
      remove: async () => {
        self.store.delete(doc._id);
      }
    };
  }
}

class InMemoryDB {
  constructor() {
    this.collections = {};
  }

  async addCollections(defs) {
    for (const name of Object.keys(defs)) {
      if (!this.collections[name]) this.collections[name] = new InMemoryCollection(name);
    }
  }
}

export const dbPromise = (async () => new InMemoryDB())();

