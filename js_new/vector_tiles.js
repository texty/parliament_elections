/**
 * Created by yevheniia on 09.06.20.
 */
var default_zoom = window.innerWidth > 800 ? 5 : 4;
var min_zoom =  window.innerWidth > 800 ? 5 : 4;
mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpbWFjdXMxODIiLCJhIjoiWGQ5TFJuayJ9.6sQHpjf_UDLXtEsz8MnjXw';
var map = new mapboxgl.Map({
    container: 'map',
    // style: 'style3.json',
    minZoom: min_zoom, //restrict map zoom
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
    zoom: default_zoom // starting zoom
});



map.scrollZoom.disable();


map.on('load', function () {

    map.addSource('elections_06', {
        type: 'vector',
        tiles: ["https://texty.github.io/parliament_elections/tiles/lines_06/{z}/{x}/{y}.pbf"]
    });

    map.addSource('elections_07', {
        type: 'vector',
        tiles: ["https://texty.github.io/parliament_elections/tiles/lines_07/{z}/{x}/{y}.pbf"]
    });

    map.addSource('elections_12', {
        type: 'vector',
        tiles: ["https://texty.github.io/parliament_elections/tiles/lines_12/{z}/{x}/{y}.pbf"]
    });

    map.addSource('elections_14', {
        type: 'vector',
        tiles: ["https://texty.github.io/parliament_elections/tiles/lines_14/{z}/{x}/{y}.pbf"]
    });

    map.addSource('elections_19', {
        type: 'vector',
        tiles: ["https://texty.github.io/parliament_elections/tiles/lines_19/{z}/{x}/{y}.pbf"]
    });

    var red_url = 'img/red-triangle.png';
    var blue_url = 'img/blue-triangle.png';
    var green_url = 'img/green-triangle.png';


    function add_year(source, source_layer) {
        map.loadImage(red_url, function (err, red) {
            if (err) {
                console.error('err image', err);
                return;
            }

            map.addImage('red_arrow', red);

            map.addLayer({
                'id': 'arrow-layer-red',
                'type': 'symbol',
                'source': source,
                "source-layer": source_layer,
                'layout': {
                    'symbol-placement': "point",
                    'symbol-spacing': 1,
                    'icon-allow-overlap': true,
                    "icon-image": [
                        "match",
                        ["get", "color"],
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



        map.loadImage(blue_url, function (err, blue) {
            if (err) {
                console.error('err image', err);
                return;
            }

            map.addImage('blue_arrow', blue);

            map.addLayer({
                'id': 'arrow-layer-blue',
                'type': 'symbol',
                'source': source,
                "source-layer": source_layer,
                'layout': {
                    'symbol-placement': "point",
                    'symbol-spacing': 1,
                    'icon-allow-overlap': true,
                    "icon-image": [
                        "match",
                        ["get", "color"],
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



        map.loadImage(green_url, function (err, green) {
            if (err) {
                console.error('err image', err);
                return;
            }

            map.addImage('green_arrow', green);

            map.addLayer({
                'id': 'arrow-layer-green',
                'type': 'symbol',
                'source': source,
                "source-layer": source_layer,
                'layout': {
                    'symbol-placement': "point",
                    'symbol-spacing': 1,
                    'icon-allow-overlap': true,
                    "icon-image": [
                        "match",
                        ["get", "color"],
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

        map.addLayer({
            "id": "election_data",
            'type': 'line',
            'source': source,
            "source-layer": source_layer,
            'layout': {

                'line-join': 'round',
                'line-cap': 'round'


            },
            "paint": {
                'line-color': ["get", "color"],
                'line-width': 1
            }
        })
    }


        add_year("elections_06", "lines_06_4326");

        var nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-left');

        d3.selectAll("#data06").on("click", function(){
            d3.selectAll(".pane").classed("active", false);
            d3.select(this).classed("active", true);

            map.removeLayer('arrow-layer-green');
            map.removeLayer('arrow-layer-red');
            map.removeLayer('arrow-layer-blue');
            map.removeLayer('election_data');
            add_year("elections_06", "lines_06_4326");

            // let year = d3.select(this).attr("data");
            // changeData(year);
        });

        d3.selectAll("#data07").on("click", function(){
            d3.selectAll(".pane").classed("active", false);
            d3.select(this).classed("active", true);

            map.removeLayer('arrow-layer-green');
            map.removeLayer('arrow-layer-red');
            map.removeLayer('arrow-layer-blue');
            map.removeLayer('election_data');
            add_year("elections_07", "lines_07_4326");

            // let year = d3.select(this).attr("data");
            // changeData(year);
        });

        d3.selectAll("#data12").on("click", function(){
            d3.selectAll(".pane").classed("active", false);
            d3.select(this).classed("active", true);
            map.removeLayer('arrow-layer-green');
            map.removeLayer('arrow-layer-red');
            map.removeLayer('arrow-layer-blue');
            map.removeLayer('election_data');

            add_year("elections_12", "lines_12_4326");

            // let year = d3.select(this).attr("data");
            // changeData(year);
        });

        d3.selectAll("#data14").on("click", function(){
            d3.selectAll(".pane").classed("active", false);
            d3.select(this).classed("active", true);
            map.removeLayer('arrow-layer-green');
            map.removeLayer('arrow-layer-red');
            map.removeLayer('arrow-layer-blue');
            map.removeLayer('election_data');

            add_year("elections_14", "lines_14_4326");

            // let year = d3.select(this).attr("data");
            // changeData(year);
        });

        d3.selectAll("#data19").on("click", function(){
            d3.selectAll(".pane").classed("active", false);
            d3.select(this).classed("active", true);
            map.removeLayer('arrow-layer-green');
            map.removeLayer('arrow-layer-red');
            map.removeLayer('arrow-layer-blue');
            map.removeLayer('election_data');

            add_year("elections_19", "lines_19_4326");

            // let year = d3.select(this).attr("data");
            // changeData(year);
        });

        // initialize the scrollama
        var container = d3.select('#scroll');
        var graphic = container.select('.scroll__graphic');
        var chart = graphic.select('#map');
        var text = container.select('.scroll__text');
        var step = text.selectAll('.step');
        var scroller = scrollama();



        // generic window resize listener event
        function handleResize() {
            // 1. update height of step elements
            var stepHeight = Math.floor(window.innerHeight * 0.5);
            step.style('height', stepHeight + 'px');

            // 2. update width/height of graphic element
            var bodyWidth = d3.select('body').node().offsetWidth;
            var textWidth = text.node().offsetWidth;

            var graphicWidth = bodyWidth - textWidth;

            var chartMargin = 32;
            var chartWidth = graphic.node().offsetWidth - chartMargin;

            // 3. tell scrollama to update new element dimensions
            scroller.resize();
        }

        // scrollama event handlers
        function handleStepEnter(r) {

            //scroll down
            if(r.index === 0 && r.direction === "down") {

            }

            if(r.index === 0 && r.direction === "up") {
                 d3.selectAll(".pane").classed("active", false);
                d3.select("#data06").classed("active", true);
                map.flyTo({
                    center: [
                        32,
                        48
                    ],
                    zoom: default_zoom,
                    essential: true // this animation is considered essential with respect to prefers-reduced-motion
                });
            }

            if(r.index === 1) {
                // by up to 5 degrees.
                map.removeLayer('arrow-layer-green');
                map.removeLayer('arrow-layer-red');
                map.removeLayer('arrow-layer-blue');
                map.removeLayer('election_data');

                add_year("elections_19", "lines_19_4326");
                map.flyTo({
                    center: [
                        31,
                        49
                    ],
                    zoom: 8,
                    speed: 0.5, // make the flying slow
                    curve: 1, // change the speed at which it zooms out
                    essential: true // this animation is considered essential with respect to prefers-reduced-motion
                });

                d3.selectAll(".pane").classed("active", false);
                d3.select("#data07").classed("active", true);
            }

            if(r.index === 2 && r.direction === "down") {
                d3.selectAll(".pane").classed("active", false);
                d3.select("#data12").classed("active", true);
            }

            if(r.index === 2 && r.direction === "up") {
            }

            if(r.index === 3 && r.direction === "down") {
            }

            if(r.index === 3 && r.direction === "up") {

                d3.selectAll(".pane").classed("active", false);
                d3.select("#data12").classed("active", true);
            }


            if(r.index === 4) {

                d3.selectAll(".pane").classed("active", false);
                d3.select("#data14").classed("active", true);



            }

            if(r.index === 5 && r.direction === "down") {
            }

            if(r.index === 5 && r.direction === "up") {


                d3.selectAll(".pane").classed("active", false);
                d3.select("#data14").classed("active", true);
            }

            if(r.index === 6) {

                d3.selectAll(".pane").classed("active", false);
                d3.select("#data19").classed("active", true);

            }

            if(r.index === 7) {}
        }


        function handleContainerEnter(response) {
            // response = { direction }
        }

        function handleContainerExit(response) {
            // response = { direction }
        }



        function init() {
            handleResize();
            scroller.setup({
                container: '#scroll',
                graphic: '.scroll__graphic',
                text: '.scroll__text',
                step: '.scroll__text .step',
                offset: 0.9,
                debug: false
            })
                .onStepEnter(handleStepEnter)
                .onContainerEnter(handleContainerEnter)
                .onContainerExit(handleContainerExit);

            window.addEventListener('resize', handleResize);
        }

        init();





});






















