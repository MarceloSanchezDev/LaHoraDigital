// Reference palettes: https://openweathermap.org/map_legend
const palettes={
  temp_new:{unit:'°C',stops:[[-30,'#8257db'],[-20,'#208cec'],[-10,'#20c4e8'],[0,'#23dddd'],[10,'#c2ff28'],[20,'#fff028'],[25,'#ffc228'],[30,'#fc8014']]},
  precipitation_new:{unit:'mm',stops:[[0,'transparent'],[1,'rgba(110,110,205,.3)'],[10,'rgba(80,80,225,.7)'],[140,'rgba(20,20,255,.9)']]},
  clouds_new:{unit:'% de cobertura',stops:[[0,'transparent'],[50,'rgba(247,247,255,.5)'],[70,'#f4f4ff'],[100,'#f0f0ff']]},
  wind_new:{unit:'m/s',stops:[[1,'transparent'],[5,'rgba(238,206,206,.4)'],[15,'rgba(179,100,188,.7)'],[25,'rgba(63,33,59,.8)'],[50,'rgba(116,76,172,.9)'],[100,'#4600af'],[200,'#0d1126']]},
  pressure_new:{unit:'hPa',stops:[[940,'#0073ff'],[960,'#00aaff'],[980,'#4bd0d6'],[1000,'#8de7c7'],[1010,'#b0f720'],[1020,'#f0b800'],[1040,'#fb5515'],[1060,'#f3363b'],[1080,'#c60000']]},
};
export default function MapLegend({layer}){const palette=palettes[layer];if(!palette)return null;const min=palette.stops[0][0];const max=palette.stops.at(-1)[0];const colors=palette.stops.map(([value,color])=>`${color} ${(value-min)/(max-min)*100}%`).join(',');return <div className="map-legend"><span>Referencia de colores · {palette.unit}</span><div className="map-legend-bar" role="img" aria-label={`Escala de ${min} a ${max} ${palette.unit}`} style={{backgroundColor:'#cbd5df',backgroundImage:`linear-gradient(to right,${colors})`}}/><div className="map-legend-labels"><span>{min}</span><span>{max}</span></div><a href="https://openweathermap.org/map_legend" target="_blank" rel="noreferrer">Ver escala completa del proveedor ↗</a></div>;}
