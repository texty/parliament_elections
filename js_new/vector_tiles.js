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


    let zelenskiColor = "#4e9a69";
    let poroshenkoColor = "#790a4f";
    let closeResultColor = "#4D7794";

    // map.scrollZoom.disable();

    map.on('load', function () {

        map.addSource('election_districts', {
            type: 'vector',
            tiles: ["https://texty.github.io/parliament_elections/tiles/{z}/{x}/{y}.pbf"]
        });

        var results_layer = map.addLayer({
            "id": "election_districts",
            'type': 'line',
            "source": "election_districts",
            "source-layer": "example_4326",
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            "paint": {
                'line-color': '#ff69b4',
                'line-width': 1
            }
        }, 'place_other');















});
