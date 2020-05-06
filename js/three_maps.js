/**
 * Created by yevheniia on 06.05.20.
 */
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



drawMap = function(container, df, texture_n){
    
    var map = L.map(container).setView([49.49229399862877, 29.94335937500001], 5);
    map.scrollWheelZoom.disable();

// CTRL + scroll
    $("#"+container).bind('mousewheel DOMMouseScroll', function (event) {
        event.stopPropagation();
        if (event.ctrlKey == true) {
            event.preventDefault();
            map.scrollWheelZoom.enable();
            $("#"+container).removeClass('map-scroll');
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
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', { minZoom: 5, maxZoom: 18,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);


// додаємо шейп України
    new L.GeoJSON.AJAX("data/ukr_shape.geojson",{
        style: {
            fillColor: 'transparent',
            weight: 1,
            opacity: 1,
            color: 'grey',  // stroke color
            fillOpacity: 0.7
        }
    }).addTo(map);

//контроли у правий ніжній кут
    map.attributionControl.setPosition('bottomleft');
    map.zoomControl.setPosition('bottomright');

//шейпи спрайтів
    var loader = new PIXI.loaders.Loader();
    loader
        .add('blue', 'img/blue.png')
        .add('red', 'img/red.png')
        .add('green', 'img/green.png');


    var markerSprites = [];
    var pixiContainer = new PIXI.Container();
    var zoomChangeTs = null;

//слуги окремо, щоб їх можна було прибирати та повертати
    var greenMarkersContainer = new PIXI.Container();
    var tempLayer = new L.LayerGroup();


    document.addEventListener("DOMContentLoaded", function() {

        loader.load(function(loader, resources) {

            var textures = [resources.blue.texture, resources.red.texture, resources.green.texture];

            getJSON(df, function (markers) {

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
                        var invScale = 0.5 / getScale();

                        if (event.type === 'add') {
                            markers.forEach(function (marker) {
                                var proEuropePercentage = +marker['data06'];

                                //Кут для проєвропейських
                                var radians = Math.PI / 100 * proEuropePercentage;
                                var markerSprite = new PIXI.Sprite(textures[texture_n]);
                                markerSprite.textureIndex = 0;
                                markerSprite.alpha =  proEuropePercentage/100;


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




            ////////////////////////////////////////////////////////////////////////

            function changeData(n) {
                markerSprites.forEach(function(p, i){
                    var markerSprite = markerSprites[i];
                    var proEuropePercentage = markerSprite.info[n];

                    if (proEuropePercentage != undefined){
                        markerSprite.alpha =  markerSprite.info[n]/100;
                        var radians = Math.PI / 100 * proEuropePercentage;
                        markerSprite.texture = textures[texture_n];
                        markerSprite.rotation = 0;
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
    
};



drawMap('map1', 'data/ua.json', 0);
drawMap('map2', 'data/ru.json', 1);
drawMap('map3', 'data/green.json', 2);