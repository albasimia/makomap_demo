import * as ol from 'ol';
// import Map from 'ol/Map';
// import View from 'ol/View';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
// GeoJSON読み込み
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import MVTFormat from 'ol/format/MVT';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import {
    Circle,
    Fill,
    Stroke,
    Style
} from 'ol/style.js';
import {
    fromLonLat,
    transform
} from 'ol/proj';
import * as turf from '@turf/turf'

import './style.css';
import 'ol/ol.css';
import './map.css';

const matsue_pos = {
    ido: 133.0462784,
    keido: 35.4681672,
}


// 外部GeoJSONスタイル設定
// const styles = {
//     'Point': new Style({
//         image: new Circle({
//             radius: 10,
//             stroke: new Stroke({
//                 color: 'rgba(52, 152, 219, 1.0)',
//                 width: 5
//             }),
//             fill: new Fill({
//                 color: 'rgba(52, 152, 219, 0.4)'
//             })
//         })
//     }),
//     'LineString': new Style({
//         stroke: new Stroke({
//             color: 'rgba(241, 196, 15, 0.6)',
//             width: 5
//         })
//     }),
//     'Polygon': new Style({
//         stroke: new Stroke({
//             color: 'rgba(255, 0, 0, 1.0)',
//             width: 2
//         }),
//         fill: new Fill({
//             color: 'rgba(255, 0, 0, 0.4)'
//         })
//     })
// };
const stroke_w = 8;
const styles = {
    '国道': new Style({
        stroke: new Stroke({
            color: 'red',
            width: stroke_w
        })
    }),
    '都道府県道': new Style({
        stroke: new Stroke({
            color: 'blue',
            width: stroke_w
        })
    }),
    '市区町村道等': new Style({
        stroke: new Stroke({
            color: 'yellow',
            width: stroke_w
        })
    }),
    '高速自動車国道等': new Style({
        stroke: new Stroke({
            color: 'green',
            width: stroke_w
        })
    }),
    'その他': new Style({
        stroke: new Stroke({
            color: 'cyan',
            width: stroke_w
        })
    }),
    '不明': new Style({
        stroke: new Stroke({
            color: 'magenta',
            width: stroke_w
        })
    }),
};
const styleFunction = function (feature) {
    console.log(feature.values_.rdCtg)
    return styles[feature.values_.rdCtg];
};

// // 外部GeoJSONソース設定
// const vectorSource = new VectorSource({
//     url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_rdcl/{z}/{x}/{y}.geojson',
//     format: new GeoJSON()
// });

// // 外部GeoJSONレイヤ設定
// const gjl = new VectorLayer({
//     source: vectorSource,
//     style: styleFunction
// });

const gjl = new VectorTileLayer({
    source: new VectorTileSource({
        // format: new MVTFormat({
        //     layers: ['road']
        // }),
        url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_rdcl/{z}/{x}/{y}.geojson',
        // attributions: [
        //     '<a href="https://github.com/gsi-cyberjapan/gsimaps-vector-experiment" target="_blank" rel=”noopener noreferrer”>国土地理院</a>',
        // ],
        format: new GeoJSON(),
        minZoom: 16,
        maxZoom: 19
    }),
    style: styleFunction,
})

// ベクトルタイルの olレイヤを定義
const vt = new VectorTileLayer({
    source: new VectorTileSource({
        format: new MVTFormat({
            layers: ['road']
        }),
        url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf',
        attributions: [
            '<a href="https://github.com/gsi-cyberjapan/gsimaps-vector-experiment" target="_blank" rel=”noopener noreferrer”>国土地理院</a>',
        ],
    }),
    style: roadStyle,
});

const tyle = new TileLayer({
    // 地理院タイルを指定
    source: new XYZ({
        url: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
        attributions: '<a href="http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html" target="_blank">地理院タイル</a>',
        attributionsCollapsible: false,
        tileSize: [256, 256],
        minZoom: 0,
        maxZoom: 18
    })
});


var map = new ol.Map({
    target: "map",
    renderer: ['canvas', 'dom'],
    // layers: [tyle, vt, gjl],
    layers: [tyle, gjl],
    // controls: ol.control.defaults({
    //   attributionOptions: ({
    //     collapsible: false
    //   })
    // }),
    view: new ol.View({
        center: fromLonLat([matsue_pos.ido, matsue_pos.keido]),
        zoom: 13
    }),
});

function roadStyle(feature, resolution) {
    const properties = feature.getProperties();
    if (properties.layer === 'road') {
        if (feature.getType() == "LineString") {
            const coordinates = feature.getFlatCoordinates()
            console.log(feature)
            const length = coordinates.length
            const head = transform([coordinates[0], coordinates[1]], 'EPSG:3857', 'EPSG:4326')
            const tail = transform([coordinates[length - 2], coordinates[length - 1]], 'EPSG:3857', 'EPSG:4326')
            let bearing = turf.bearing(head, tail);
            if (bearing < 0) bearing += 180;
            if (bearing > 90) bearing -= 90;
            return new Style({
                stroke: new Stroke({ //Polylineも使ってみたい
                    color: `hsl(${45 - bearing*4},90%,45%)`,
                    width: 4 //4ぐらいがちょうどよい気がする。
                }),
                zIndex: 1
            });
        }
        return new Style();
    } else {
        return new Style();
    }
}