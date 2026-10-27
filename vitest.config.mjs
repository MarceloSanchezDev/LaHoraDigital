import {defineConfig} from 'vitest/config';
import {join} from 'node:path';
import {workspace,siteRoot,editorialRoot} from './tools/testing/test-paths.mjs';
export default defineConfig({
  envDir:false,
  resolve:{dedupe:['react','react-dom','react-router','react-router-dom'],alias:{'@site':join(siteRoot,'src'),'@editorial':join(editorialRoot,'src')}},
  test:{projects:['diario','editorial'].map(name=>({extends:true,test:{name,environment:'jsdom',include:[`tests/components/${name}.test.jsx`],setupFiles:[join(workspace,'tests/components/setup.js')]}}))},
});
