import {test as base,expect} from '@playwright/test';
import {editorialOrigin,fixturePassword} from '../../tools/testing/test-paths.mjs';
export const test=base.extend({context:async({context},use)=>{
  await context.route('**/*',route=>{const u=new URL(route.request().url());return ['127.0.0.1','localhost'].includes(u.hostname)?route.continue():route.abort();});
  await use(context);
}});
export {expect};
export async function loginApi(request,role='owner'){
  const response=await request.post(editorialOrigin+'/api/editorial/login',{headers:{Origin:editorialOrigin},data:{email:role+'@example.test',password:fixturePassword}});
  expect(response.status()).toBe(200);const body=await response.json();return {'X-CSRF-Token':body.csrf,Origin:editorialOrigin};
}
export async function loginPage(page,role='owner'){
  await page.goto('/');await page.getByLabel('Email',{exact:true}).fill(role+'@example.test');await page.getByLabel('Contraseña',{exact:true}).fill(fixturePassword);await page.getByRole('button',{name:'Ingresar',exact:true}).click();await expect(page.getByRole('heading',{name:'Panel editorial',exact:true})).toBeVisible();
}
