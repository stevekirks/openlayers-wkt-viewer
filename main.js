import 'ol/ol.css';
import {fromLonLat} from 'ol/proj';
import Map from 'ol/Map';
import MapboxVector from 'ol/layer/MapboxVector';
import {Fill, Stroke, Style} from 'ol/style';
import {Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import View from 'ol/View';
import WKT from 'ol/format/WKT';

const wkt =
  'POLYGON ((153.070389 -27.418177, 153.071389 -27.419177, 153.072389 -27.417177, 153.070389 -27.416177, 153.070389 -27.418177))';

const format = new WKT();

const feature = format.readFeature(wkt, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:4326',
});

const style = new Style({
  fill: new Fill({
    color: 'rgba(25, 191, 69, 0.6)',
  }),
  stroke: new Stroke({
    color: '#19bf45',
    width: 5,
  })
});

const wktVector = new VectorLayer({
  source: new VectorSource({
    features: [feature],
  }),
  style: style,
});

const mapboxVector = new MapboxVector({
  styleUrl: 'mapbox://styles/mapbox/dark-v10',
  accessToken:
    '',
});

const map = new Map({
  target: 'map',
  layers: [
    wktVector//, mapboxVector
  ],
  view: new View({
    center: fromLonLat([153.05, -27.44]),
    zoom: 11,
  }),
});
