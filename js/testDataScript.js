/**
 * Created by yevheniia on 19.07.19.
 */
// this is used to simulate leaflet zoom animation timing:
var easing = BezierEasing(0, 0, 0.25, 1);

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

var map = L.map('map').setView([49.49229399862877, 29.94335937500001], 7);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', { minZoom: 5, maxZoom: 18,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

new L.GeoJSON.AJAX("data/ukr_shape.geojson",{
    style: {
        fillColor: 'transparent',
        weight: 1,
        opacity: 1,
        color: 'grey',  //Outline color
        fillOpacity: 0.7
    }
}).addTo(map);

map.attributionControl.setPosition('bottomleft');
map.zoomControl.setPosition('bottomright');


var loader = new PIXI.loaders.Loader();
loader
    .add('blue', 'img/blue.png')
    .add('red', 'img/red.png')
    .add('green', 'img/green.png');

var markerSprites = [];
var markerSprites_slugi = [];
var pixiContainer = new PIXI.Container();
var greenMarkersContainer = new PIXI.Container();

var zoomChangeTs = null;
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
                            var proEuropePercentage = +marker['data06'];

                            //Кут для проєвропейських
                            var radians = Math.PI / 100 * proEuropePercentage;
                            var markerSprite;

                            // змінити колір стрілки (замінити текстуру, якщо кут більший чи менший за половину)
                            if (radians < Math.PI / 2) {
                                markerSprite = new PIXI.Sprite(textures[1]);
                                markerSprite.textureIndex = 1;
                            }
                            else {
                                markerSprite = new PIXI.Sprite(textures[0]);
                                markerSprite.textureIndex = 0;

                            }

                            var coords = project([marker.Latitude, marker.Longitude]);
                            markerSprite.x = coords.x;
                            markerSprite.y = coords.y;
                            markerSprite.anchor.set(0.5, 0.5);
                            // if(invScale > 5){
                                markerSprite.scale.set(2);
                            // } else {
                            //     markerSprite.scale.set(invScale);
                            // }
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



        getJSON('data/slugi_2019.json', function (markers) {

            markers.forEach(function(d){
                d.Latitude = +d.Latitude;
                d.Longitude = +d.Longitude
            });

            slugiLayer = function () {
                return L.pixiOverlay(function (utils, event) {
                    var zoom = utils.getMap().getZoom();
                    var container = utils.getContainer();
                    var renderer = utils.getRenderer();
                    var project = utils.latLngToLayerPoint;
                    var getScale = utils.getScale;
                    var invScale = 0.8 / getScale();

                    if (event.type === 'add') {
                        markers.forEach(function (marker) {
                            var proEuropePercentage = +marker['data19'];

                            //Кут для проєвропейських
                            var radians = Math.PI / 100 * 50;
                            var markerSprite;


                            markerSprite = new PIXI.Sprite(textures[2]);

                            if (proEuropePercentage != undefined){
                                markerSprite.alpha = 1;
                                markerSprite.texture = textures[2];
                                markerSprite.rotation = 0;
                            } else {
                                markerSprite.alpha = 0;
                            }

                            markerSprite.textureIndex = 2;


                            var coords = project([marker.Latitude, marker.Longitude]);
                            markerSprite.x = coords.x;
                            markerSprite.y = coords.y;
                            markerSprite.anchor.set(0.5, 0.5);
                            if(invScale > 5){
                                markerSprite.scale.set(5);
                            } else {
                                markerSprite.scale.set(invScale);
                            }

                            container.addChild(markerSprite);
                            markerSprites_slugi.push(markerSprite);

                            // Тут можна в спрайт упакувати ті дані, що потрібно
                            markerSprite.info = [marker["Polling_station"], marker['data19'] ];
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
                            markerSprites_slugi.forEach(function (markerSprite) {
                                markerSprite.scale.set(markerSprite.currentScale + lambda * (markerSprite.targetScale - markerSprite.currentScale));
                            });
                        }
                        else {
                            markerSprites_slugi.forEach(function (markerSprite) {
                                markerSprite.scale.set(invScale);
                            });
                        }
                    }
                renderer.render(container);
                }, greenMarkersContainer, {
                    // doubleBuffering: doubleBuffering,
                    destroyInteractionManager: true
                });
            } ();


            slugiLayer.addTo(tempLayer);

            var ticker = new PIXI.ticker.Ticker();

            ticker.add(function (delta) {
                slugiLayer.redraw({type: 'redraw', delta: delta});
            });

            ticker.start();
            map.on('zoomanim', slugiLayer.redraw, slugiLayer);
        });





    ////////////////////////////////////////////////////////////////////////

        function changeData(n) {
                markerSprites.forEach(function(p, i){
                    var markerSprite = markerSprites[i];
                    var proEuropePercentage = markerSprite.info[n];

                    if (proEuropePercentage != undefined){
                        markerSprite.alpha = 1;
                        var radians = Math.PI / 100 * proEuropePercentage;

                        if (radians < Math.PI / 2) {
                             markerSprite.texture = textures[1];
                        }
                        else {
                            markerSprite.texture = textures[0];
                        }

                        markerSprite.rotation =  0;
                        markerSprite.rotation -= radians;
                    } else {
                        markerSprite.alpha = 0;
                    }


                })
        }


        document.getElementById("e_2006").addEventListener("click", function(){  changeData(1); greenMarkersContainer.alpha = 0; });
        document.getElementById("e_2007").addEventListener("click", function(){  changeData(2); greenMarkersContainer.alpha = 0; });
        document.getElementById("e_2012").addEventListener("click", function(){  changeData(3); greenMarkersContainer.alpha = 0; });
        document.getElementById("e_2014").addEventListener("click", function(){  changeData(4); greenMarkersContainer.alpha = 0; });
        document.getElementById("e_2019").addEventListener("click", function(){  changeData(5); tempLayer.addTo(map); greenMarkersContainer.alpha = 1; });





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
