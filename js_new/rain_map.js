/**
 * Created by yevheniia on 13.05.20.
 */

function save() {
    var data = map.toDataURL({
        'mimeType' : 'image/jpeg', // or 'image/png'
        'save' : true,             // to pop a save dialog
        'fileName' : 'map'         // file name
    });
}


var map = new maptalks.Map('map', {
    center: [31, 49],
    zoom: 6,
    zoomControl: {
        'position': 'top-left',
        'slider': false,
        'zoomLevel': false
    },
    baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://mapbox.com/">mapbox</a>'
    }),
    minZoom: 6,
    maxZoom: 11,
    maxPitch: 0,
    pitch: 0,
    scrollWheelZoom : false
});

map.setZoom(6);

var center = map.getCenter();


/* зум на утримання CTRL*/
$("#map").bind('mousewheel DOMMouseScroll', function (event) {
    event.stopPropagation();
    if (event.ctrlKey == true) {
        event.preventDefault();
        map.config('scrollWheelZoom', true);
    } else {
        map.config('scrollWheelZoom', false);
    }

});

/* маркери */
const texture0 = 'img/blue-line.png';
const texture1 = 'img/red-line.png';
const texture2 = 'img/green-line.png';

var layer;

Promise.all([
    d3.json("data/fucking_end.json")
//        d3.csv("data/deckGL_2007.csv")
]).then(function(data) {
    addMarkers('data06');


    /* додаємо маркери на карту*/
    function addMarkers(year) {
        layer = new maptalks.VectorLayer('vector').addTo(map);

        data[0].forEach(function(d){
            let texture;
            if(d[year] === "0"){
                texture = texture0;
            } else if(d[year] === "1"){
                texture = texture1;
            } else if(d[year] === "2"){
                texture = texture2;
            }
            new maptalks.Marker( [d.Longitude, d.Latitude],
                {
                    'symbol' : {
                        'markerFile'   : texture,
                        'markerWidth'  : 20,
                        'markerHeight' : 20,
                        'markerDx'     : 0,
                        'markerDy'     : 0,
                        'markerOpacity': 1,
                        'markerRotation' : 45,
                        'data': {'data06': d.data06, 'data07': d.data07, 'data12': d.data12, 'data14': d.data14, 'data19': d.data19 }
                    }
                }
            ).addTo(layer);
        });
    }

    /* оновлюємо колір текстури при зміні року*/
    function updateFill(newyear) {
        layer.forEach(function(marker){
            let texture;
            if(marker._symbol.data[newyear] === "0"){
                texture = texture0;
            } else if(marker._symbol.data[newyear] === "1"){
                texture = texture1;
            } else if(marker._symbol.data[newyear] === "2"){
                texture = texture2;
            }

            marker.updateSymbol({
                'markerFile'   : texture
            });
        });

    }

    //переключалка по роках
    d3.selectAll(".pane").on("click", function(){  updateFill(this.id);  });

    function start(){
        map.animateTo({ center: [31, 49],  zoom: 6  }, { duration: 2000 });
    }

    /* scrollama section */
    function to_Poltavska_Cherkaska_2007(){
        map.animateTo({ center: [31, 49],  zoom: 8  }, { duration: 2000 });
    }

    function to_Dnipro_Nikopol_2012(){
        map.animateTo({ center: [32.5, 47.5],  zoom: 8 }, {  duration: 2000 });
    }

    function to_Vinnitska_Khmelnitska(){
        map.animateTo({ center: [28, 49],  zoom: 7 }, { duration: 2000 });
    }

    function to_common() {
        map.animateTo({ center: [31, 49],  zoom: 6.5 }, { duration: 2000 });
    }

    function to_Volyn() {
        map.animateTo({ center: [25, 52],  zoom: 7 }, { duration: 2000 });
    }




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
            start();
            updateFill('data12');
        }

        if(r.index === 1) {
            to_Poltavska_Cherkaska_2007();
            updateFill('data07');
        }

        if(r.index === 2 && r.direction === "down") {
            to_Dnipro_Nikopol_2012();
            updateFill('data12');
        }

        if(r.index === 2 && r.direction === "up") {
            to_Dnipro_Nikopol_2012();
        }

        if(r.index === 3 && r.direction === "down") {
            to_Vinnitska_Khmelnitska()
        }

        if(r.index === 3 && r.direction === "up") {
            updateFill('data12');
            to_Vinnitska_Khmelnitska()
        }


        if(r.index === 4) {
            to_common();
            updateFill('data14');
        }

        if(r.index === 5 && r.direction === "down") {
            to_Volyn();
        }

        if(r.index === 5 && r.direction === "up") {
            to_Volyn();
            updateFill('data14');
        }

        if(r.index === 6) {
            updateFill('data19');
            to_common();

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






//--------------------------------------------------------------------------------------------------------------------------------------------




// 3D карта
    const deckglLayer = new maptalks.DeckGLLayer('kkkk', {});
    map.addLayer(deckglLayer);


    function getAvgPercent(points) {
        var maxValue = points.reduce((max, p) => Number(p.percent) > max ? Number(p.percent) : max, -Infinity);
        let sumValue = points.reduce(function(sum, elem) { return sum + Number(elem.percent); }, 0);
        return sumValue/points.length;
    }

    function getAvgVoices(points) {
        let sumValue = points.reduce(function(sum, elem) { return sum + Number(elem.voices); }, 0);
        return sumValue/points.length;
    }



    // map.setCenter([-116.71849765758043, 32.911171005023874]);
    //    renderLayer("2006", "ua");


    const LIGHT_SETTINGS = {
        lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
        ambientRatio: 0.4,
        diffuseRatio: 0.6,
        specularRatio: 0.2,
        lightsStrength: [0.8, 0.0, 0.8, 0.0],
        numberOfLights: 2
    };
    const options = {
        radius: 1000,
        coverage: 1,
        upperPercentile: 100
    };

    const COLOR_RANGE_ru = [
        [255,255,178],
        [254,217,118],
        [254,178,76],
        [253,141,60],
        [240,59,32],
        [189,0,38]
    ];

    const COLOR_RANGE_ua = [
        [255,255,204],
        [199,233,180],
        [127,205,187],
        [65,182,196],
        [44,127,184],
        [37,52,148]
    ];



    d3.selectAll('.button').on("click", function(){
        map.removeLayer(layer);
        console.log(this.id);
//        map.animateTo({
//            center: [33, 49],
//            zoom: 6,
//            pitch: 40,
//            bearing: 0
//        }, {
//            duration: 5000
//        });
        renderLayer(this.id.replace("e_", ""), "ua");
//        changeView();
    });

//    d3.selectAll('button#e_2007').on("click", function(){
//        renderLayer("2007", "ru");
//        setTimeout(changeView, 1000);
//    });
//
//    d3.selectAll('button#e_2006').on("click", function(){
//        renderLayer("2006", "ua");
//        setTimeout(goToWest, 1000);
//    });


    function changeView() {
        map.animateTo({
            center: [38, 48],
            zoom: 8,
            pitch: 40,
            bearing: 0
        }, {
            duration: 5000
        });
    }


    function goToWest(){
        map.animateTo({
            center: [28, 50],
            zoom: 8,
            pitch: 40,
            bearing: 0
        }, {
            duration: 7000
        });

    }


    function renderLayer(year, orientation) {
//        d3.csv('data/deckGL_2007.csv', function(error, response) {
//                (error, response) => {


        const hexagonLayer = {
                    layerType: "HexagonLayer",
                    id: 'heatmap',
                    colorRange: orientation === "ru"? COLOR_RANGE_ru : COLOR_RANGE_ua,
                    data: data[1].filter(function(d){ return d.Year === year && d.orientation === orientation}),
                    elevationDomain: [1, 100],
                    elevationRange: [1, 1000],
                    elevationScale: 50,
                    getColorValue: getAvgPercent,
//                getElevationValue: points => points.length,

                    getElevationValue: getAvgVoices,

                    extruded: true,
                    //pickable: true,
                    getPosition: d => [Number(d.lng), Number(d.lat)],
            onHover: info => { console.log(info) },
        lightSettings: LIGHT_SETTINGS,
            opacity: 1,
    ...options
    }
        deckglLayer.setProps({
            layers: [hexagonLayer]
        });
//    });

    }

});



