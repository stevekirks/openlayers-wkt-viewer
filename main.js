import 'ol/ol.css';
import { fromLonLat, toLonLat } from 'ol/proj';
import Map from 'ol/Map';
import MapboxVector from 'ol/layer/MapboxVector';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import View from 'ol/View';
import WKT from 'ol/format/WKT';

const mapboxBaseLayer = new MapboxVector({
  styleUrl: process.env.MAPBOX_STYLE_URL,
  accessToken: process.env.MAPBOX_ACCESS_TOKEN
});

const wktStyle = new Style({
  fill: new Fill({
    color: 'rgba(252, 3, 244, 0.2)',
  }),
  stroke: new Stroke({
    color: '#fc03f4',
    width: 2,
  }),
  image: new Circle({
    radius: 9,
    fill: new Fill({color: '#fc03f4'}),
  })
});

const wktFormat = new WKT();

let overLayer = new VectorLayer({
  source: new VectorSource({
    features: [],
  }),
  style: wktStyle,
});

const view = new View({
  center: fromLonLat([143.05, -27.44]),
  zoom: 13,
});

const map = new Map({
  target: 'map',
  layers: [
    mapboxBaseLayer, overLayer
  ],
  view: view,
});

const loadWkt = () => {

  map.removeLayer(overLayer);

  const lblInfo = document.querySelector('#lblInfo');
  lblInfo.innerText = '';
  const txtArea = document.querySelector('#inWkt');
  
  const wkt = txtArea.value;

  if (wkt.length === 0) {
    lblInfo.innerText = 'nothing';
    return;
  }

  try
  {
    const feature = wktFormat.readFeature(wkt, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });
  
    overLayer = new VectorLayer({
      source: new VectorSource({
        features: [feature],
      }),
      style: wktStyle,
    });
  
    map.addLayer(overLayer);
    const point = feature.getGeometry();
    view.fit(point, { padding: [10, 10, 10, 10], minResolution: 2, duration: 1000 });
    lblInfo.innerText = 'updated';
  }
  catch (x) {
    lblInfo.innerText = 'could not parse';
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

map.on('singleclick', function (evt) {
  lblInfo.innerText = '';
  const coordinate = evt.coordinate;
  const lngLat = toLonLat(coordinate);
  const txtArea = document.querySelector('#inWkt');
  txtArea.value = 'POINT(' + lngLat[0] + ' ' + lngLat[1] + ')';
  loadWkt();
});