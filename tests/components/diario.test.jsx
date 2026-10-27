import React from 'react';
import {it,expect,vi} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import ResponsiveImage from '@site/components/common/ResponsiveImage.jsx';
import NewsCard from '@site/components/news/NewsCard.jsx';
import {loadCatalog} from '@site/services/catalogStore.js';

it('replaces a broken image with an accessible fallback',()=>{
  render(<ResponsiveImage src="/missing.png" alt="Plaza"/>);
  fireEvent.error(screen.getByRole('img',{name:'Plaza'}));
  expect(screen.getByRole('img',{name:'Plaza'}).tagName).toBe('SPAN');
});
it('keeps the article link usable without a date, excerpt or photograph',()=>{
  render(<MemoryRouter initialEntries={['/secciones/municipales']}><NewsCard article={{slug:'plaza',title:'La plaza',category:'Municipales'}}/></MemoryRouter>);
  expect(screen.getByRole('link').getAttribute('href')).toBe('/noticias/plaza');
  expect(screen.getByText('Archivo de La Hora')).toBeTruthy();
  expect(screen.getByText('Consultá el documento original de esta publicación.')).toBeTruthy();
});
it('rejects invalid catalog scopes before making any network request',async()=>{
  const fetch=vi.fn();vi.stubGlobal('fetch',fetch);
  await expect(loadCatalog('../editorial')).rejects.toThrow();expect(fetch).not.toHaveBeenCalled();
});
it('surfaces API failures and permits retrying a catalog request',async()=>{
  const fetch=vi.fn().mockResolvedValueOnce({ok:false}).mockResolvedValueOnce({ok:true,json:async()=>[{slug:'plaza',image:null}]});vi.stubGlobal('fetch',fetch);
  await expect(loadCatalog('retry-fixture')).rejects.toThrow();
  expect(await loadCatalog('retry-fixture')).toEqual([{slug:'plaza',image:null}]);expect(fetch).toHaveBeenCalledTimes(2);
});
