/**
 * Created by yevheniia on 19.07.19.
 */
// this is used to simulate leaflet zoom animation timing:
var easing = BezierEasing(0, 0, 0.25, 1);
var default_zoom = window.innerWidth > 800 ? 6.5 : 5;
var marker_size  = window.innerWidth > 800 ? 20 : 10;

function getJSON(url, successHandler, errorHandler) {
    var xhr = typeof XMLHttpRequest != 'undefined'
        ? new XMLHttpRequest()
        : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
    xhr.onreadystatechange = function() {
        var status;
        var data;
        if (xhr.readyState == 4) {
            status = xhr.status;
            if (status == 200) {
                data = JSON.parse(xhr.responseText);
                successHandler && successHandler(data);
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.send();
}

var map = L.map('map').setView([49.49229399862877, 29.94335937500001], 6);
map.scrollWheelZoom.disable();


// L.control.sideBySide(stamenLayer, osmLayer).addTo(map);

// CTRL + scroll
$("#map").bind('mousewheel DOMMouseScroll', function (event) {
    event.stopPropagation();
    if (event.ctrlKey == true) {
        event.preventDefault();
        map.scrollWheelZoom.enable();
        $('#map').removeClass('map-scroll');
        setTimeout(function(){
            map.scrollWheelZoom.disable();
        }, 1000);
    } else {
        map.scrollWheelZoom.disable();
        $('#map').addClass('map-scroll');
    }

});

$(window).bind('mousewheel DOMMouseScroll', function (event) {
    $('#map').removeClass('map-scroll');
});


// додаємо тайли
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    minZoom: 5,
    maxZoom: 18,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);


// // додаємо шейп України
// new L.GeoJSON.AJAX("data/adm1.geojson",{
//     style: {
//         fillColor: 'transparent',
//         weight: 4,
//         opacity: 0.7,
//         color: 'black',  // stroke color
//         fillOpacity: 0.5
//     }
// }).addTo(map);

//контроли у правий ніжній кут
map.attributionControl.setPosition('bottomleft');
map.zoomControl.setPosition('bottomright');

//шейпи спрайтів
var loader = new PIXI.loaders.Loader();
loader
    .add('blue', 'img/blue-line.png')
    .add('red', 'img/red-line.png')
    .add('green', 'img/green-line.png');


var markerSprites = [];
var pixiContainer = new PIXI.Container();
var zoomChangeTs = null;

//слуги окремо, щоб їх можна було прибирати та повертати
var greenMarkersContainer = new PIXI.Container();
var markerSprites_slugi = [];
var tempLayer = new L.LayerGroup();
var slugiLayer;


document.addEventListener("DOMContentLoaded", function() {

    loader.load(function(loader, resources) {

        var textures = [resources.blue.texture, resources.red.texture, resources.green.texture];

        getJSON('data/fucking_end.json', function (markers) {

            markers.forEach(function(d){
                d.Latitude = +d.Latitude;
                d.Longitude = +d.Longitude
            });

            var pixiLayer = function () {
                return L.pixiOverlay(function (utils, event) {
                    var zoom = utils.getMap().getZoom();
                    var container = utils.getContainer();
                    var renderer = utils.getRenderer();
                    var project = utils.latLngToLayerPoint;
                    var getScale = utils.getScale;
                    var invScale = 0.8 / getScale();

                    if (event.type === 'add') {
                        markers.forEach(function (marker) {
                            var radians = Math.PI / 100 * 30;
                            var texture_value = +marker['data06'];
                            var markerSprite;

                            if (texture_value != undefined){
                                markerSprite = new PIXI.Sprite(textures[texture_value]);
                                markerSprite.textureIndex = texture_value;
                            } else {
                                markerSprite = new PIXI.Sprite(textures[texture_value]);
                                markerSprite.alpha = 0;
                            }
                            
                            var coords = project([marker.Latitude, marker.Longitude]);
                            markerSprite.x = coords.x;
                            markerSprite.y = coords.y;
                            markerSprite.anchor.set(0.5, 0.5);
                            markerSprite.scale.set(invScale);

                            // var tint = d3.color(colorScale(Math.random() * 100)).rgb();
                            // markerSprite.tint = 230 * (tint.r * 230 + tint.g) + tint.b;
                            container.addChild(markerSprite);
                            markerSprites.push(markerSprite);

                            // Тут можна в спрайт упакувати ті дані, що потрібно
                            markerSprite.info = [marker["Polling_station"], marker['data06'], marker['data07'], marker['data12'], marker['data14'],  marker['data19'] ];
                            markerSprite.rotation -= radians
                        });
                    }


                    if (event.type === 'redraw') {
                        var delta = event.delta;
                        if (zoomChangeTs !== null) {
                            var duration = 17;
                            zoomChangeTs += delta;
                            var lambda = zoomChangeTs / duration;
                            if (lambda > 1) {
                                lambda = 1;
                                zoomChangeTs = null;
                            }
                            lambda = easing(lambda);
                            markerSprites.forEach(function (markerSprite) {
                                markerSprite.scale.set(markerSprite.currentScale + lambda * (markerSprite.targetScale - markerSprite.currentScale));
                            });
                        }
                        else {
                            markerSprites.forEach(function (markerSprite) {
                                markerSprite.scale.set(invScale);
                            });
                        }
                    }



                    renderer.render(container);
                }, pixiContainer, {
                    // doubleBuffering: doubleBuffering,
                    destroyInteractionManager: true
                });
            } ();


            pixiLayer.addTo(map);


            var ticker = new PIXI.ticker.Ticker();

            ticker.add(function (delta) {
                pixiLayer.redraw({type: 'redraw', delta: delta});
            });

            ticker.start();
            map.on('zoomanim', pixiLayer.redraw, pixiLayer);
        });


    //////////////////////////////////////////////////////////////////////////







    ////////////////////////////////////////////////////////////////////////

        function changeData(n) {
                markerSprites.forEach(function(p, i){
                    var markerSprite = markerSprites[i];
                    let texture_value = markerSprite.info[n];
                    // console.log(markerSprite.info[n]);
                    // var proEuropePercentage = markerSprite.info[n];

                    if (markerSprite.info[n] != undefined){
                        markerSprite.alpha =  1;
                        // var radians = Math.PI / 100 * proEuropePercentage;
                        // radians < Math.PI / 2 ? markerSprite.texture = textures[1] :  markerSprite.texture = textures[0];
                        markerSprite.texture = textures[texture_value];
                        // markerSprite.rotation = 0;
                        // markerSprite.rotation -= radians;
                    } else {
                        markerSprite.alpha = 0;
                    }
                })
        }


        //переключалка по роках
        d3.selectAll(".pane").on("click", function(){
            d3.selectAll(".pane").style("font-size", "25px");
            d3.select(this).style("font-size", "40px");
            let n = d3.select(this).attr("data");
            changeData(n);
        });

        function start(){
            map.flyTo([49, 31], default_zoom);
            // map.animateTo({ center: [31, 49],  zoom: default_zoom }, { duration: 2000 });
        }

        /* scrollama section */
        function to_Poltavska_Cherkaska_2007(){
            map.flyTo([49, 31], 8);
            // map.animateTo({ center: [31, 49],  zoom: 8  }, { duration: 2000 });
        }

        function to_Dnipro_Nikopol_2012(){
            map.flyTo([47.5, 32.5], 8);
            // map.animateTo({ center: [32.5, 47.5],  zoom: default_zoom + 1.5 }, {  duration: 2000 });
        }

        function to_Vinnitska_Khmelnitska(){
            map.flyTo([49, 31], default_zoom);

            // map.animateTo({ center: [31, 49],  zoom: default_zoom  }, { duration: 2000 });
        }

        function to_common() {
            map.flyTo([49, 31], default_zoom);
            // map.animateTo({ center: [31, 49],  zoom: default_zoom }, { duration: 2000 });
        }

        function to_Volyn() {
            // map.animateTo({ center: [25, 52],  zoom: 7 }, { duration: 2000 });
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
                // updateFill('data06');
                d3.selectAll(".pane").style("font-size", "25px");
                d3.select("#data06").style("font-size", "40px");


            }

            if(r.index === 1) {
                to_Poltavska_Cherkaska_2007();
                changeData(2);
                d3.selectAll(".pane").style("font-size", "25px");
                d3.select("#data07").style("font-size", "40px");
            }

            if(r.index === 2 && r.direction === "down") {
                to_Dnipro_Nikopol_2012();
                changeData(3);

                d3.selectAll(".pane").style("font-size", "25px");
                d3.select("#data12").style("font-size", "40px");
            }

            if(r.index === 2 && r.direction === "up") {
                to_Dnipro_Nikopol_2012();
            }

            if(r.index === 3 && r.direction === "down") {
                to_Vinnitska_Khmelnitska()
            }

            if(r.index === 3 && r.direction === "up") {
                changeData(4);
                to_Vinnitska_Khmelnitska();
                d3.selectAll(".pane").style("font-size", "25px");
                d3.select("#data12").style("font-size", "40px");

            }


            if(r.index === 4) {
                to_common();
                changeData(4);
                d3.selectAll(".pane").style("font-size", "25px");
                d3.select("#data14").style("font-size", "40px");
            }

            if(r.index === 5 && r.direction === "down") {
                to_Volyn();
            }

            if(r.index === 5 && r.direction === "up") {
                to_Volyn();
                changeData(4);
                d3.selectAll(".pane").style("font-size", "25px");
                d3.select("#data14").style("font-size", "40px");
            }

            if(r.index === 6) {
                changeData(5);
                to_common();
                d3.selectAll(".pane").style("font-size", "25px");
                d3.select("#data19").style("font-size", "40px");

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

        // document.getElementById("data06").addEventListener("click", function(){  changeData(1); });
        // document.getElementById("data07").addEventListener("click", function(){  changeData(2); });
        // document.getElementById("data12").addEventListener("click", function(){  changeData(3); });
        // document.getElementById("data14").addEventListener("click", function(){  changeData(4); });
        // document.getElementById("data19").addEventListener("click", function(){  changeData(5); });





    });
});




//
// //Функція яку можна запускати глобально, щоб повертати стрілочки. Поки вона їх повертає моментально. Ти даєш їй число і вона повертає на стільки.
// function smth(number) {
//     var delta = number;
//     // функція крутить rotate спрайт і змінює його текстуру (якщо він перейшов якщо підтримка одного блоку перевалила за середину)
//     markerSprites.forEach(function (markerSprite) {
//         markerSprite.rotation -= delta;
//
//         //поки, що кожен раз коли ти запускаєш
//         markerSprite.setTexture(textures[1])
//     });
//
//     if (zoomChangeTs !== null) {
//         var duration = 17;
//         zoomChangeTs += delta;
//         var lambda = zoomChangeTs / duration;
//         if (lambda > 1) {
//             lambda = 1;
//             zoomChangeTs = null;
//         }
//         lambda = easing(lambda);
//         markerSprites.forEach(function (markerSprite) {
//             markerSprite.scale.set(markerSprite.currentScale + lambda * (markerSprite.targetScale - markerSprite.currentScale));
//         });
//     }
//     else {
//         markerSprites.forEach(function (markerSprite) {
//             markerSprite.scale.set(invScale);
//         });
//     }
// }
