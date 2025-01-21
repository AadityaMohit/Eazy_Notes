import Dexie from 'dexie';

const db = new Dexie('EditorsDatabase');

db.version(1).stores({
  editors: '++id,content,timestamp,pinned',  
});

export default db;
