/**
 * Created by yevheniia on 09.06.20.
 */
mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpbWFjdXMxODIiLCJhIjoiWGQ5TFJuayJ9.6sQHpjf_UDLXtEsz8MnjXw';
var map = new mapboxgl.Map({
    container: 'map',
    // style: 'style3.json',
    minZoom: 5, //restrict map zoom
    maxZoom: 10,
    // zoom: 5,
    // center: [32.259271, 48.518688],
    hash: false,
    tap: false,
    attributionControl: false,
    style: {
        'version': 8,
        'sources': {
            'raster-tiles': {
                'type': 'raster',
                'tiles': [
                    'https://api.mapbox.com/styles/v1/evgeshadrozdova/cjsqjh1to30c81ftn8jnuikgj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXZnZXNoYWRyb3pkb3ZhIiwiYSI6ImNqMjZuaGpkYTAwMXAzMm5zdGVvZ2c0OHYifQ.s8MMs2wW15ZyUfDhTS_cdQ'
                ],
                'tileSize': 256,
                'attribution':
                    'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
            }
        },
        'layers': [
            {
                'id': 'simple-tiles',
                'type': 'raster',
                'source': 'raster-tiles',
                'minzoom': 5,
                'maxzoom': 10
            }
        ]
    },
    center: [32.259271, 48.518688],
    zoom: 5 // starting zoom
});



    map.scrollZoom.disable();


map.on('load', function () {

        map.addSource('election_districts', {
            type: 'vector',
            tiles: ["https://texty.github.io/parliament_elections/tiles/lines_06/{z}/{x}/{y}.pbf"]
        });

        // map.addSource('arrows_06', {
        //     type: 'vector',
        //     tiles: ["https://texty.github.io/parliament_elections/tiles/arrows_06/{z}/{x}/{y}.pbf"]
        // });

        var red_url = 'img/red-triangle.png';
        var blue_url = 'img/blue-triangle.png';
        var green_url = 'img/green-triangle.png';

        map.loadImage(red_url, function(err, red) {
            if (err) {
                console.error('err image', err);
                return;
            }

        map.addImage('red_arrow', red);

            map.addLayer({
                'id': 'arrow-layer-red',
                'type': 'symbol',
                'source': 'election_districts',
                "source-layer": "lines_4326",
                'layout': {
                    'symbol-placement': "point",
                    'symbol-spacing': 1,
                    'icon-allow-overlap': true,
                    // 'icon-ignore-placement': true,
                    //'icon-image': 'red_arrow',

                    "icon-image": [
                        "match",
                        ["get","color_2006"],
                        "red",
                        "red_arrow",
                        ""
                    ],



                    'icon-size': 0.20,
                    'visibility': 'visible',
                    "icon-rotate": {
                        "property": "angle",
                        "type": "identity"
                    }

                }
            });

        });



        //2
        map.loadImage(blue_url, function(err, blue) {
        if (err) {
            console.error('err image', err);
            return;
        }

        map.addImage('blue_arrow', blue);

        map.addLayer({
            'id': 'arrow-layer-blue',
            'type': 'symbol',
            'source': 'election_districts',
            "source-layer": "lines_4326",
            'layout': {
                'symbol-placement': "point",
                'symbol-spacing': 1,
                'icon-allow-overlap': true,
                // 'icon-ignore-placement': true,
                //'icon-image': 'red_arrow',

                "icon-image": [
                    "match",
                    ["get","color_2006"],
                    "blue",
                    "blue_arrow",
                    ""
                ],



                'icon-size': 0.20,
                'visibility': 'visible',
                "icon-rotate": {
                    "property": "angle",
                    "type": "identity"
                }

            }
        });

    });


        //2
        map.loadImage(green_url, function(err, green) {
            if (err) {
                console.error('err image', err);
                return;
            }

            map.addImage('green_arrow', green);

            map.addLayer({
                'id': 'arrow-layer-green',
                'type': 'symbol',
                'source': 'election_districts',
                "source-layer": "lines_4326",
                'layout': {
                    'symbol-placement': "point",
                    'symbol-spacing': 1,
                    'icon-allow-overlap': true,
                    // 'icon-ignore-placement': true,
                    //'icon-image': 'red_arrow',

                    "icon-image": [
                        "match",
                        ["get","color_2006"],
                        "green",
                        "green_arrow",
                        ""
                    ],



                    'icon-size': 0.20,
                    'visibility': 'visible',
                    "icon-rotate": {
                        "property": "angle",
                        "type": "identity"
                    }

                }
            });

        });


        //
        // map.loadImage(green_url, function(err, green) {
        //     if (err) {
        //         console.error('err image', err);
        //         return;
        //     }
        // });
        //
        // map.addImage('blue_arrow', blue);
        // map.addImage('green_arrow', green);



        var results_layer = map.addLayer({
            "id": "election_data",
            'type': 'line',
            "source": "election_districts",
            "source-layer": "lines_4326",
            'layout': {

                'line-join': 'round',
                'line-cap': 'round'


            },
            "paint": {
                'line-color': ["get",  "color_2006"],
                'line-width': 1
            }
        });


    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');




        });
















    // });
