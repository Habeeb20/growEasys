// src/db.js
import Dexie from 'dexie';

const db = new Dexie('growEasyDB');
db.version(1).stores({
  pendingRequests: '++id, endpoint, method, body, timestamp',
});

export async function savePendingRequest(endpoint, method, body) {
  await db.pendingRequests.add({
    endpoint,
    method,
    body,
    timestamp: Date.now(),
  });
}

export async function getPendingRequests() {
  return await db.pendingRequests.toArray();
}

export async function clearPendingRequest(id) {
  await db.pendingRequests.delete(id);
}