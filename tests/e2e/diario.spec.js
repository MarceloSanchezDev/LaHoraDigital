import {test,expect} from './fixtures.js';
test('portada, noticia completa e imagen funcionan desde la API real local',async({page})=>{
  await page.goto('/');await expect(page.getByRole('heading',{name:'Las historias de nuestra comunidad'})).toBeVisible();
  await page.getByRole('link',{name:/Plaza renovada en Hurlingham/}).first().click();
  await expect(page.getByRole('heading',{name:'Plaza renovada en Hurlingham',exact:true,level:1})).toBeVisible();
  await expect(page.getByText('Los vecinos plantaron árboles en la plaza renovada.')).toBeVisible();
  await expect(page.getByRole('img',{name:'Plaza renovada en Hurlingham',exact:true})).toHaveJSProperty('naturalWidth',1);
});
test('busca en el cuerpo, filtra secciones y permite recuperar una búsqueda vacía',async({page})=>{
  await page.goto('/noticias');await page.getByRole('searchbox',{name:'Buscar en el texto completo'}).fill('árboles');
  await expect(page.getByText('Mostrando 1 a 1 de 1',{exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Plaza renovada en Hurlingham',exact:true})).toBeVisible();
  await page.getByRole('searchbox',{name:'Buscar en el texto completo'}).fill('palabra-inexistente-e2e');
  await expect(page.getByText(/No encontramos publicaciones/)).toBeVisible();
  await page.getByRole('button',{name:'Limpiar filtros',exact:true}).click();
  await expect(page.getByRole('searchbox',{name:'Buscar en el texto completo'})).toHaveValue('');
  await page.getByLabel('Filtrar por sección').selectOption('deportes');
  await expect(page.getByRole('heading',{name:'El club del barrio ganó el torneo',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Plaza renovada en Hurlingham',exact:true})).toHaveCount(0);
});
test('los borradores, archivados y enlaces desconocidos no muestran contenido privado',async({page})=>{
  for(const slug of ['borrador-privado','noticia-archivada','no-existe']){
    await page.goto('/noticias/'+slug);await expect(page.getByRole('heading',{name:'No encontramos esta página'})).toBeVisible();
  }
});
test('muestra el error de portada y permite reintentar sin una página en blanco',async({page})=>{
  let fail=true;await page.route('**/api/site',route=>fail?route.fulfill({status:503,contentType:'application/json',body:'{}'}):route.continue());
  await page.goto('/');await expect(page.getByRole('alert')).toContainText('No pudimos cargar la portada');
  fail=false;await page.getByRole('button',{name:'Reintentar',exact:true}).click();
  await expect(page.getByRole('link',{name:/Plaza renovada en Hurlingham/}).first()).toBeVisible();
});
