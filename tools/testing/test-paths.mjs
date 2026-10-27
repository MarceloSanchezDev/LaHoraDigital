import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,join} from 'node:path';
export const workspace=fileURLToPath(new URL('../../',import.meta.url));
export const backendRoot=existsSync(join(workspace,'server/editorial.mjs'))?workspace:join(workspace,'editorial');
export const apiBackendRoot=existsSync(join(workspace,'public-api/server/public-api.mjs'))?join(workspace,'public-api'):backendRoot;
export const editorialRoot=join(backendRoot,'apps/editorial');
export const siteRoot=process.env.E2E_PUBLIC_ROOT?resolve(process.env.E2E_PUBLIC_ROOT):existsSync(join(workspace,'src/App.jsx'))?workspace:join(workspace,'.runtime/public-site');
export const siteOrigin='http://127.0.0.1:18731';
export const editorialOrigin='http://127.0.0.1:18732';
export const apiOrigin='http://127.0.0.1:18733';
export const fixturePassword='Local-E2E-fixture-only-2026';
export function localTestConnection(value){
  let url;try{url=new URL(value);}catch{throw Error('Configurar E2E_DATABASE_URL con PostgreSQL local.');}
  if(!['postgres:','postgresql:'].includes(url.protocol)||!['127.0.0.1','localhost'].includes(url.hostname)||!['/lahora_development','/lahora_test'].includes(url.pathname))throw Error('Las pruebas E2E solo aceptan PostgreSQL local; producción está bloqueada.');
  return url;
}
