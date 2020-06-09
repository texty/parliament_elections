/**
 * Created by yevheniia on 09.06.20.
 */
mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpbWFjdXMxODIiLCJhIjoiWGQ5TFJuayJ9.6sQHpjf_UDLXtEsz8MnjXw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'style3.json',
    // style: 'mapbox://styles/mapbox/streets-v8',
    minZoom: 4, //restrict map zoom
    maxZoom: 12,
    zoom: 6,
    center: [32.259271, 48.518688],
    hash: false,
    tap: false
});

map.on('load', function () {

    // map.addSource('election_districts', {
    //     type: 'vector',
    //     tiles: ["https://texty.github.io/parliament_elections/tiles/{z}/{x}/{y}.pbf"]
    // });

    map.on('load', function() {
        map.addSource('election_districts', {
            type: 'vector',
            url: 'https://texty.github.io/parliament_elections/tiles/{z}/{x}/{y}.pbf'
        });
        map.addLayer({
            'id': 'election-data',
            'type': 'line',
            'source': 'election_districts',
            'source-layer': 'contour',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#ff69b4',
                'line-width': 1
            }
        });
    });

    // var results_layer = map.addLayer({
    //     "id": "election_districts",
    //     "type": "fill",
    //     "source": "election_districts",
    //     "source-layer": "simplified_4326",
    //     "paint": {
    //         "fill-color": [
    //             "case",
    //             ["boolean", ["feature-state", "hover"], false], 'rgb(250,250,50)',
    //             ["all",
    //                 ["has", "poroshenko"],
    //                 [
    //                     ">",
    //                     ["-", ["get", "poroshenko"], ["get", "zelenski"]],
    //                     ['*', ["get", "turnout_abs"], 0.1]
    //                     // ["*", ["+", ["get", "poroshenko"], ["get", "zelenski"]], 0.1]
    //                 ]
    //             ]
    //
    //         ]
    //     }
    // }, 'place_other');


 
    // map.setLayoutProperty('election_districts_turnover', 'visibility', 'none');

    // map.addLayer({
    //     "id": "election_districts_lines",
    //     "type": "line",
    //     "source": "election_districts",
    //     // "source": {
    //     // 	type: 'vector',
    //     // 	tiles: ["https://texty.github.io/president_elections_v2/tiles/{z}/{x}/{y}.pbf"]
    //     // },
    //     "source-layer": "simplified_4326",
    //     // "layout": {
    //     // 	"line-join": "round",
    //     // 	"line-cap": "round"
    //     // },
    //     "paint": {
    //         "line-width": [
    //             "interpolate", ["linear"], ["zoom"],
    //             6, 0,
    //             8, 0.4
    //         ],
    //         "line-color": "#ddd"
    //     }
    // });
});
