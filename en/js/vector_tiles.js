/**
 * Created by yevheniia on 09.06.20.
 */
var default_zoom = window.innerWidth > 800 ? 5.5 : 4;
var min_zoom =  window.innerWidth > 800 ? 5 : 4;
var enlarged_zoom = window.innerWidth > 800 ? 7 : 5;

mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpbWFjdXMxODIiLCJhIjoiWGQ5TFJuayJ9.6sQHpjf_UDLXtEsz8MnjXw';
var map = new mapboxgl.Map({
    container: 'map',
    minZoom: min_zoom,
    maxZoom: 9,
    hash: false,
    tap: false,
    attributionControl: false,
    style: '../dark_matter_en.json',
    center: [31.5, 48.5],
    zoom: default_zoom // starting zoom
});



map.scrollZoom.disable();




map.on('load', function () {

    var layers = map.getStyle().layers;
    var firstSymbolId;

    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }


    map.addSource("admin0", {
        "type": "geojson",
        'data': "../data/UKR_adm0.json"
    });



    //geojson полігони областей
    map.addSource("po_ch", {
        "type": "geojson",
        'data': "../data/shapes/to_Poltavska_Cherkaska.json"
    });

    map.addSource("vi_kh", {
        "type": "geojson",
        'data': "../data/shapes/to_Vinnitska_Khmelnitska.json"

    });

    map.addSource("od_do_kh", {
        "type": "geojson",
        'data': "../data/shapes/Odesa_Donbas_Kharkiv2.json"


    });

    map.addSource("lubash", {
        "type": "geojson",
        'data': "../data/shapes/Lubashevsky.json"
    });



    map.addLayer({
        "id": "boundary-layer",
        'type': 'line',
        "source": "admin0",
        'paint': {
            'line-color': 'lightgrey',
            'line-width': 1,
            'line-opacity': 0.8
        }
    });



    //векторні тайли
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
        tiles: ["https://texty.github.io/parliament_elections/tiles/lines_14_new/{z}/{x}/{y}.pbf"]
    });

    map.addSource('elections_19', {
        type: 'vector',
        tiles: ["https://texty.github.io/parliament_elections/tiles/lines_19_new/{z}/{x}/{y}.pbf"]
    });

    var red_url = '../img/red-triangle.png';
    var blue_url = '../img/blue-triangle.png';
    var green_url = '../img/green-triangle.png';


    map.loadImage(red_url, function (err, red) {
        if (err) {
            console.error('err image', err);
            return;
        }
        map.addImage('red_arrow', red);
    });

    map.loadImage(blue_url, function (err, blue) {
        if (err) {
            console.error('err image', err);
            return;
        }
        map.addImage('blue_arrow', blue);
    });


    map.loadImage(green_url, function (err, green) {
        if (err) {
            console.error('err image', err);
            return;
        }

        map.addImage('green_arrow', green);
    });

    //Полтавська Черкаська
    function add_po_ch(){
        map.addLayer({
            "id": "po-ch-layer",
            'type': 'line',
            "source": "po_ch",
            'paint': {
                'line-color': 'lightgrey',
                'line-width': 2,
                'line-opacity': 0.8
            }
        });
    }

    //Вінницька Хмельницька Закарпатська
    function add_vi_kh(){
        map.addLayer({
        "id": "vi-kh-layer",
            'type': 'line',
            "source": "vi_kh",
            'paint': {
                'line-color': 'lightgrey',
                'line-width': 2,
                'line-opacity': 0.8
            }
        });
    }

    //Одеса-Донбас-Харків
    function add_od_do_kh(){
        map.addLayer({
            "id": "od-do-kh-layer",
            'type': 'line',
            "source": "od_do_kh",
            'paint': {
                'line-color': 'lightgrey',
                'line-width': 2,
                'line-opacity': 0.8
            }
        });
    }

    //Любашевський
    function add_lubash(){
        map.addLayer({
            "id": "lubash-layer",
            'type': 'line',
            "source": "lubash",
            'paint': {
                'line-color': 'lightgrey',
                'line-width': 2,
                'line-opacity': 0.8
            }
        });
    }



    function removeLayer(layer){
        map.removeLayer(layer)
    }

    function removeTiles(){
        map.removeLayer('arrow-layer-small');
        map.removeLayer('arrow-layer-mid');
        map.removeLayer('arrow-layer-big');
        map.removeLayer('election_data');
    }



    function add_year(source, source_layer) {
        map.addLayer({
            'id': 'arrow-layer-small',
            'minzoom': 7,
            'maxzoom': 8,
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
                    "blue",
                    "blue_arrow",
                    "green",
                    "green_arrow",
                    ""
                ],


                'icon-size': 0.15,
                'visibility': 'visible',
                "icon-rotate": {
                    "property": "angle",
                    "type": "identity"
                }

            }
        }, firstSymbolId);


        map.addLayer({
            'id': 'arrow-layer-mid',
            'minzoom': 8,
            'maxzoom': 9,
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
                    "blue",
                    "blue_arrow",
                    "green",
                    "green_arrow",
                    ""
                ],


                'icon-size': 0.2,
                'visibility': 'visible',
                "icon-rotate": {
                    "property": "angle",
                    "type": "identity"
                }

            }
        }, firstSymbolId);

         map.addLayer({
                'id': 'arrow-layer-big',
               'minzoom': 8,
               'maxzoom': 10,
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
                        "blue",
                        "blue_arrow",
                        "green",
                        "green_arrow",
                        ""
                    ],


                    'icon-size': 0.3,
                    'visibility': 'visible',
                    "icon-rotate": {
                        "property": "angle",
                        "type": "identity"
                    }

                }
            }, firstSymbolId);




        map.addLayer({
            "id": "election_data",
            'type': 'line',
            'minzoom': 4,
            'maxzoom': 10,
            'source': source,
            "source-layer": source_layer,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'

            },
            "paint": {

                'line-color': [
                    'match',
                    ['get', 'color'],
                    'green', '#E6F164',
                    'red', '#F47874',
                    '#5B95FF'
                ],
                'line-width': 1
            }
        }, firstSymbolId);

    }





        function sourceCallback() {
            if (map.getSource('elections_06') && map.isSourceLoaded('elections_06') && map.isStyleLoaded()) {
                d3.select("#spinner").remove();
            }
        }
    
    map.on('sourcedata', sourceCallback);    
  



        add_year("elections_06", "lines_06_4326");

        var nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-left');

        d3.selectAll("#data06").on("click", function(){
            d3.selectAll(".pane").classed("active", false);
            d3.select(this).classed("active", true);
            removeTiles();
            add_year("elections_06", "lines_06_4326");

        });

        d3.selectAll("#data07").on("click", function(){
            d3.selectAll(".pane").classed("active", false);
            d3.select(this).classed("active", true);
            removeTiles();
            add_year("elections_07", "lines_07_4326");
        });

        d3.selectAll("#data12").on("click", function(){
            d3.selectAll(".pane").classed("active", false);
            d3.select(this).classed("active", true);
            removeTiles();
            add_year("elections_12", "lines_12_4326");

        });

        d3.selectAll("#data14").on("click", function(){
            d3.selectAll(".pane").classed("active", false);
            d3.select(this).classed("active", true);
            removeTiles();
            add_year("elections_14", "lines_14_4326_new");

        });

        d3.selectAll("#data19").on("click", function(){
            d3.selectAll(".pane").classed("active", false);
            d3.select(this).classed("active", true);
            removeTiles();
            add_year("elections_19", "lines_19_4326");
        });

    d3.select("#center_ukraine").on("click", function(){
        map.flyTo({ center: [  32,   48 ], zoom: default_zoom  });
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
            if(r.index === 0 && r.direction === "down") {}


            if(r.index === 1) {
                removeTiles();
                add_year("elections_07", "lines_07_4326");
                add_po_ch();
                d3.selectAll(".pane").classed("active", false);
                d3.select("#data07").classed("active", true);
            }

            if(r.index === 2 && r.direction === "down") {
                removeLayer("po-ch-layer");
                removeTiles();
                add_year("elections_12", "lines_12_4326");
                d3.selectAll(".pane").classed("active", false);
                d3.select("#data12").classed("active", true);
                add_vi_kh()
            }


            if(r.index === 3 && r.direction === "down") {
                removeLayer("vi-kh-layer");
                removeTiles();
                add_year("elections_14", "lines_14_4326_new");
                d3.selectAll(".pane").classed("active", false);
                d3.select("#data14").classed("active", true);

            }


            if(r.index === 4  && r.direction === "down") {
                add_od_do_kh();
            }

            if(r.index === 5 && r.direction === "down") {
                removeLayer("od-do-kh-layer");
                add_lubash();
            }



            if(r.index === 6 && r.direction === "down") {
                removeLayer("lubash-layer");
                removeTiles();
                add_year("elections_19", "lines_19_4326");
                d3.selectAll(".pane").classed("active", false);
                d3.select("#data19").classed("active", true);

            }

            if(r.index === 7) {}


            //scroll up
            if(r.index === 0 && r.direction === "up") {
                d3.selectAll(".pane").classed("active", false);
                d3.select("#data06").classed("active", true);
                removeLayer("po-ch-layer");
                removeTiles();
                add_year("elections_06", "lines_06_4326");
            }

            if(r.index === 2 && r.direction === "up") {
                removeTiles();
                add_year("elections_12", "lines_12_4326");
                d3.selectAll(".pane").classed("active", false);
                d3.select("#data12").classed("active", true);
            }

            if(r.index === 3 && r.direction === "up") {
                removeLayer("od-do-kh-layer");
            }

            if(r.index === 4 && r.direction === "up") {
                removeLayer("lubash-layer");
                add_od_do_kh();
            }



            if(r.index === 5 && r.direction === "up") {
                removeTiles();
                add_year("elections_14", "lines_14_4326_new");
                add_lubash();
                d3.selectAll(".pane").classed("active", false);
                d3.select("#data14").classed("active", true);
            }

            if(r.index === 6 && r.direction === "up") {

            }



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






















