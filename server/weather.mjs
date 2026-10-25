// Server-only OpenWeatherMap adapter. Never import this module in src/.
export function createWeatherHandler({ key, fetchImpl = fetch, now = Date.now } = {}) {
  let cached; let expires = 0; let pending; let retryAfter = 0;
  async function load() {
    const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    url.search = new URLSearchParams({ appid:key, lat:'-34.5894', lon:'-58.6391', units:'metric', lang:'es' });
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(8000), redirect: 'error' });
    if (!response.ok) throw new Error('Weather unavailable');
    const { main, weather, dt } = await response.json();
    if (!Number.isFinite(main?.temp) || !Number.isFinite(main?.feels_like) || !Number.isFinite(dt) || typeof weather?.[0]?.description !== 'string') throw new Error('Invalid weather');
    cached = { location: 'Hurlingham, Buenos Aires', temperature: main.temp, feelsLike: main.feels_like, condition: weather[0].description.slice(0,150), updatedAt: new Date(dt * 1000).toISOString(), provider: 'OpenWeatherMap' };
    expires = now() + 10 * 60 * 1000;
    return cached;
  }
  return async function weather(req, res, next) {
    if (new URL(req.url, 'http://localhost').pathname !== '/api/weather') { if (next) return next(); res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET') { res.setHeader('Allow','GET'); res.writeHead(405); return res.end(JSON.stringify({message:'Método no permitido.'})); }
    if (!key) { res.writeHead(503); return res.end(JSON.stringify({message:'El clima no está disponible por el momento.'})); }
    try {
      if (!cached || now() >= expires) {
        if (now() < retryAfter) throw new Error('Retry later');
        pending ||= load().catch(error => { retryAfter=now()+60000; throw error; }).finally(()=>{pending=null;});
        await pending;
      }
      res.writeHead(200); res.end(JSON.stringify(cached));
    } catch { res.writeHead(503); res.end(JSON.stringify({message:'No pudimos consultar el clima. Intentá más tarde.'})); }
  };
}
