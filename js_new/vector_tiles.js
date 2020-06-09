/**
 * Created by yevheniia on 09.06.20.
 */
mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpbWFjdXMxODIiLCJhIjoiWGQ5TFJuayJ9.6sQHpjf_UDLXtEsz8MnjXw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'style3.json',
    minZoom: 6, //restrict map zoom
    maxZoom: 10,
    zoom: 6,
    center: [32.259271, 48.518688],
    hash: false,
    tap: false
});



    // map.scrollZoom.disable();

    map.on('load', function () {

        map.addSource('election_districts', {
            type: 'vector',
            tiles: ["https://texty.github.io/parliament_elections/source_06/{z}/{x}/{y}.pbf"]
        });

        var url = 'img/headarrow.png';

        map.loadImage(url, function(err, image) {
            if (err) {
                console.error('err image', err);
                return;
            }


            map.addImage('arrow', image);

        var results_layer = map.addLayer({
            "id": "election_data",
            'type': 'line',
            "source": "election_districts",
            "source-layer": "example_4326",
            'layout': {

                'line-join': 'round',
                'line-cap': 'round'


            },
            "paint": {
                'line-color': ["get",  "color_2006"],
                'line-width': 2
            }
        }, 'place_other');



            map.addLayer({
                'id': 'arrow-layer',
                'type': 'symbol',
                'source': 'election_districts',
                "source-layer": "example_4326",
                'layout': {
                    'symbol-placement': "point",
                    'symbol-spacing': 1,
                    'icon-allow-overlap': true,
                    //'icon-ignore-placement': true,
                    'icon-image': 'arrow',
                    'icon-size': 0.5,
                    'visibility': 'visible'
                     // "icon-rotate": {
                     //     "property": "Latitude",
                     //     "type": "identity"
                     // }

                }
            });


        });
















    });
