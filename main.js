import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import Map from 'ol/Map';
import MapboxVector from 'ol/layer/MapboxVector';
import { Fill, Stroke, Style } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import View from 'ol/View';
import WKT from 'ol/format/WKT';

const mapboxVector = new MapboxVector({
  styleUrl: 'mapbox://styles/mapbox/dark-v10',
  accessToken: process.env.MAPBOX_ACCESS_TOKEN
});

const style = new Style({
  fill: new Fill({
    color: 'rgba(25, 191, 69, 0.6)',
  }),
  stroke: new Stroke({
    color: '#19bf45',
    width: 1,
  })
});

const wktFormat = new WKT();

let wktVector = new VectorLayer({
  source: new VectorSource({
    features: [],
  }),
  style: style,
});

const view = new View({
  center: fromLonLat([143.05, -27.44]),
  zoom: 13,
});

const map = new Map({
  target: 'map',
  layers: [
    mapboxVector, wktVector
  ],
  view: view,
});

const loadWkt = () => {

  map.removeLayer(wktVector);

  const lblInfo = document.querySelector('#lblInfo');
  lblInfo.innerText = '';
  const txtArea = document.querySelector('#inWkt');
  
  const wkt = txtArea.value;

  if (wkt.length === 0) {
    lblInfo.innerText = 'Nothing';
    return;
  }

  try
  {
    const feature = wktFormat.readFeature(wkt, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });
  
    wktVector = new VectorLayer({
      source: new VectorSource({
        features: [feature],
      }),
      style: style,
    });
  
    map.addLayer(wktVector);
    const point = feature.getGeometry();
    view.fit(point, { padding: [10, 10, 10, 10], minResolution: 50 });
    lblInfo.innerText = 'Updated';
  }
  catch (x) {
    lblInfo.innerText = 'Could not parse';
    console.error(x);
  }
}

map.once('postrender', function (event) {
  const txtArea = document.querySelector('#inWkt');
  txtArea.value = 'POLYGON ((153.070389 -27.418177, 153.071389 -27.419177, 153.072389 -27.417177, 153.070389 -27.416177, 153.070389 -27.418177))';
  loadWkt();
});

const txtArea = document.querySelector('#inWkt');
txtArea.addEventListener('input', function () {
  loadWkt();
}, false);