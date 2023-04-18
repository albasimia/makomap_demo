import 'leaflet/dist/leaflet.css'
import './style.css'
import './map.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import {
  setupCounter
} from './counter.js'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

import L from 'leaflet'
// import * as turf from '@turf/turf'
import vectorTileLayer from 'leaflet-vector-tile-layer';



const matsue_position = {
  ido: 133.0462784,
  keido: 35.4681672,
}

let map = L.map('map').setView([matsue_position.keido, matsue_position.ido], 13);


L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 15
}).addTo(map);

// L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png", {
//   attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
// }).addTo(map);

const url = 'https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf';
// const options = {
//         // A function that will be passed a vector-tile feature, the layer
//         // name, the number of SVG coordinate units per vector-tile unit
//         // and the feature's style object to create each feature layer.
//         featureToLayer, // default undefined

//         // Options passed to the `fetch` function when fetching a tile.
//         fetchOptions, // default undefined

//         // A function that will be used to decide whether to include a
//         // feature or not. If specified, it will be passed the vector-tile
//         // feature, the layer name and the zoom level. The default is to
//         // include all features.
//         filter, // default undefined

//         // A function that receives a list of vector-tile layer names and
//         // the zoom level and returns the names in the order in which they
//         // should be rendered, from bottom to top. The default is to render
//         // all layers as they appear in the tile.
//         layerOrder, // default undefined

//         // An array of vector-tile layer names from bottom to top. Layers
//         // that are missing from this list will not be rendered. The
//         // default is to render all layers as they appear in the tile.
//         layers, // default undefined

//         // Specify zoom range in which tiles are loaded. Tiles will be
//         // rendered from the same data for Zoom levels outside the range.
//         minDetailZoom, // default undefined
//         maxDetailZoom, // default undefined

//         // Either a single style object for all features on all layers or a
//         // function that receives the vector-tile feature, the layer name
//         // and the zoom level and returns the appropriate style options.
//         style, // default undefined

//         // This works like the same option for `Leaflet.VectorGrid`.
//         // Ignored if style is specified.
//         vectorTileLayerStyles, // default undefined
// };

const layer = vectorTileLayer(url);
layer.setStyle({ weight: 3 });
console.log(layer)

// L.vectorGrid.protobuf(
//     "https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf", {
//       attribution: "<a href='https://github.com/gsi-cyberjapan/gsimaps-vector-experiment' target='_blank'>国土地理院ベクトルタイル提供実験</a>",
//       rendererFactory: L.canvas.tile,
//       // 各レイヤーのスタイル設定
//       vectorTileLayerStyles: {
//         road: {
//           color: "gray",
//           weight: 1,
//         },
//         railway: {
//           color: "green",
//           weight: 2,
//         },
//         river: {
//           color: "dodgerblue",
//           weight: 1,
//         },
//         lake: {
//           color: "dodgerblue",
//           weight: 1,
//         },
//         // 表示しないレイヤー
//         boundary: [],
//         building: [],
//         coastline: [],
//         contour: [],
//         elevation: [],
//         label: [],
//         landforma: [],
//         landforml: [],
//         landformp: [],
//         searoute: [],
//         structurea: [],
//         structurel: [],
//         symbol: [],
//         transp: [],
//         waterarea: [],
//         wstructurea: [],
//       },
//     }
//   )
//   .addTo(map);

// Object.assign(new L.GridLayer({
//   attribution: "<a href='https://github.com/gsi-cyberjapan/gsimaps-vector-experiment' target='_blank'>国土地理院ベクトルタイル提供実験</a>",
//   maxNativeZoom: 15,
//   minNativeZoom: 15,
//   // preferCanvas: true
// }), {
//   createTile: function (coords) {
//     const template = "https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf";
//     const div = document.createElement('div');
//     div.group = L.layerGroup();
//     fetch(L.Util.template(template, coords)).then(a => a.arrayBuffer()).then(buffer => {
//     const road = new L.VectorTile(new Pbf(buffer)).layers.road;
//       if (!road) return;
//       if (!div.group) return;
//       if (!this._map) return;
//       for (let i = 0; i < road.length; i++) {
//         const geojson = road.feature(i).toGeoJSON(coords.x, coords.y, coords.z);
//         const lines = geojson.geometry.type === "LineString" ? [geojson.geometry.coordinates] : geojson.geometry.coordinates;
//         lines.forEach(line => {
//           const head = line[0];
//           const tail = line[line.length - 1];
//           let bearing = turf.bearing(head, tail);
//           if (bearing < 0) bearing += 180;
//           if (bearing > 90) bearing -= 90;
//           div.group.addLayer(L.polyline(line.map(a => [a[1], a[0]]), {
//             color: `hsl(${45 - bearing*4},90%,45%)`
//           }));
//         });
//       }
//       div.group.addTo(this._map);
//     });
//     return div;
//   }
// }).on("tileunload", function (e) {
//   if (e.tile.group) {
//     if (this._map) this._map.removeLayer(e.tile.group);
//     delete e.tile.group;
//   }
// }).addTo(map);