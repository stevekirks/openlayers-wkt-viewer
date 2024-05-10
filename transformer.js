import { arcgisToGeoJSON, geojsonToArcGIS } from '@terraformer/arcgis'
import { wktToGeoJSON, geojsonToWKT } from "@terraformer/wkt"

const mainTxtArea = document.getElementById('inWkt');
const transformerModal = document.getElementById("transformerModal");
const openTransformBtn = document.getElementById("openTransforBtn");
const closeTransformSpan = document.getElementsByClassName("close-transformer-modal")[0];
const txtAreaWkt = document.getElementById('inTransformWkt');
const txtAreaGeoJson = document.getElementById('inTransformGeoJson');
const txtAreaArcGisJson = document.getElementById('inTransformArcGisJson');
const lblModalInfo = document.getElementById('lblModalInfo');

// When the user clicks the button, open the modal 
openTransformBtn.onclick = function () {
    transformerModal.style.display = "block";
    
    if (txtAreaWkt.value.length === 0) {
        txtAreaWkt.value = mainTxtArea.value;
        transformFromWkt();
    }
}

// When the user clicks on <span> (x), close the modal
closeTransformSpan.onclick = () => {
    transformerModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target == transformerModal) {
        transformerModal.style.display = "none";
    }
}

txtAreaWkt.addEventListener('input', () => {
    transformFromWkt();
}, false);

txtAreaGeoJson.addEventListener('input', () => {
    transformFromGeoJson();
}, false);

txtAreaArcGisJson.addEventListener('input', () => {
    transformFromArcGisJson();
}, false);

function transformFromWkt() {
    const wkt = txtAreaWkt.value;
    if (wkt.length === 0) {
        lblModalInfo.innerText = 'nothing';
        return;
    }
    try {

        const geoJson = wktToGeoJSON(wkt);
        txtAreaGeoJson.value = JSON.stringify(geoJson, undefined, 2);

        const arcgisJson = geojsonToArcGIS(geoJson);
        txtAreaArcGisJson.value = JSON.stringify(arcgisJson, undefined, 2);

        lblModalInfo.innerText = 'WKT transformed';
    }
    catch (x) {
        lblModalInfo.innerText = 'could not parse';
        console.error(x);
    }
}

function transformFromGeoJson() {
    const geoJson = txtAreaGeoJson.value;
    if (geoJson.length === 0) {
        lblModalInfo.innerText = 'nothing';
        return;
    }
    try {

        const geoJsonParsed = JSON.parse(geoJson);

        const wkt = geojsonToWKT(geoJsonParsed);
        txtAreaWkt.value = wkt;

        const arcgisJson = geojsonToArcGIS(geoJsonParsed);
        txtAreaArcGisJson.value = JSON.stringify(arcgisJson, undefined, 2);

        lblModalInfo.innerText = 'GeoJSON transformed';
    }
    catch (x) {
        lblModalInfo.innerText = 'could not parse';
        console.error(x);
    }
}

function transformFromArcGisJson() {
    const arcgisJson = txtAreaArcGisJson.value;
    if (arcgisJson.length === 0) {
        lblModalInfo.innerText = 'nothing';
        return;
    }
    try {

        const arcGisJsonParsed = JSON.parse(arcgisJson);

        const geoJson = arcgisToGeoJSON(arcGisJsonParsed);
        txtAreaGeoJson.value = JSON.stringify(geoJson, undefined, 2);

        const wkt = geojsonToWKT(geoJson);
        txtAreaWkt.value = wkt;

        lblModalInfo.innerText = 'ArcGIS JSON transformed';
    }
    catch (x) {
        lblModalInfo.innerText = 'could not parse';
        console.error(x);
    }
}