import {defineConfig,devices} from '@playwright/test';
import {siteOrigin,editorialOrigin,apiOrigin} from './tools/testing/test-paths.mjs';
export default defineConfig({
  testDir:'tests/e2e',fullyParallel:false,workers:1,forbidOnly:Boolean(process.env.CI),retries:process.env.CI?1:0,
  timeout:45000,expect:{timeout:10000},outputDir:'.runtime/test-results',
  reporter:[['list'],['html',{outputFolder:'.runtime/playwright-report',open:'never'}]],
  use:{...devices['Desktop Chrome'],trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects:[{name:'diario',testMatch:'diario.spec.js',use:{baseURL:siteOrigin}}],
  webServer:{command:'node tools/testing/public-fixture-server.mjs',url:'http://127.0.0.1:18730/health',reuseExistingServer:false,timeout:120000},
});
