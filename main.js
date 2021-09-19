import 'ol/ol.css';
import WKT from 'ol/format/WKT';
import { Vector as VectorLayer } from 'ol/layer';
import Map from 'ol/Map';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import { Vector as VectorSource } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';

let styleUrl = process.env.MAPBOX_STYLE_URL;
styleUrl = styleUrl.replace('mapbox://styles', 'https://api.mapbox.com/styles/v1');
const mapboxBaseLayer = new TileLayer({
  source: new XYZ({
    url:
    styleUrl + '/tiles/256/{z}/{x}/{y}@2x' + '?access_token=' + process.env.MAPBOX_ACCESS_TOKEN,
  }),
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
  center: fromLonLat([153.088631, -26.661299]),
  zoom: 18,
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
    view.fit(point, { padding: [10, 10, 10, 10], minResolution: 2, duration: 700 });
    lblInfo.innerText = 'WKT loaded';
  }
  catch (x) {
    lblInfo.innerText = 'could not parse';
    console.error(x);
  }
}

map.once('postrender', function (event) {
  const txtArea = document.querySelector('#inWkt');
  txtArea.value = 'POLYGON ((153.088389 -26.661177, 153.089389 -26.662177, 153.090389 -26.660177, 153.088389 -26.659177, 153.088389 -26.661177))';
  loadWkt();
});

const txtArea = document.querySelector('#inWkt');
txtArea.addEventListener('input', function () {
  loadWkt();
}, false);

let clickedPoints = [];
map.on('singleclick', function (evt) {
  lblInfo.innerText = '';
  const coordinate = evt.coordinate;
  const lngLat = toLonLat(coordinate);
  clickedPoints.push([lngLat[0],lngLat[1]]);
  let wkt = '';
  if (clickedPoints.length === 1) {
    wkt = 'POINT (' + clickedPoints[0][0] + ' ' + clickedPoints[0][1] + ')';
  } else if (clickedPoints.length === 2) {
    wkt = 'LINESTRING (' + clickedPoints[0][0] + ' ' + clickedPoints[0][1] + ',' + clickedPoints[1][0] + ' ' + clickedPoints[1][1] + ')';
  } else {
    let wktPts = [];
    for (let i = 0; i < clickedPoints.length; i++) {
      const pt = clickedPoints[i];
      wktPts.push(pt[0] + ' ' + pt[1]);
    }
    wktPts.push(clickedPoints[0][0] + ' ' + clickedPoints[0][1]);
    wkt = 'POLYGON ((' + wktPts.join(', ') + '))';
  }
  const txtArea = document.querySelector('#inWkt');
  txtArea.value = wkt;
  loadWkt();
});