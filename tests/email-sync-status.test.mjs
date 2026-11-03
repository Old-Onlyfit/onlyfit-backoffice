import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let server;
let EmailSyncStatus;

before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
  ({ EmailSyncStatus } = await server.ssrLoadModule('/src/components/EmailSyncStatus.tsx'));
});

after(async () => { await server?.close(); });

test('só confirma sincronização quando o provedor informa zero falhas', () => {
  const success = renderToStaticMarkup(createElement(EmailSyncStatus, { failed: false, errors: 0 }));
  const partial = renderToStaticMarkup(createElement(EmailSyncStatus, { failed: false, errors: 2 }));
  assert.match(success, /Sincronização concluída/);
  assert.doesNotMatch(success, /role="alert"/);
  assert.match(partial, /Algumas mensagens não puderam ser sincronizadas/);
  assert.match(partial, /role="alert"/);
  assert.doesNotMatch(partial, /Sincronização concluída/);
});

test('avisa sobre falha total e não inventa sucesso antes da primeira tentativa', () => {
  const failed = renderToStaticMarkup(createElement(EmailSyncStatus, { failed: true, errors: null }));
  const idle = renderToStaticMarkup(createElement(EmailSyncStatus, { failed: false, errors: null }));
  assert.match(failed, /Não foi possível sincronizar/);
  assert.match(failed, /aguarde dois minutos/);
  assert.doesNotMatch(failed, /Sincronização concluída/);
  assert.equal(idle, '');
});
