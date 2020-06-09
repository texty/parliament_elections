/**
 * актуальний файл для карти зі стрілками різної довжини
 */

var easing = BezierEasing(0, 0, 0.25, 1);
var default_zoom = window.innerWidth > 800 ? 7 : 6;

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

var map = L.map('map').setView([49, 31], default_zoom);
map.scrollWheelZoom.disable();


//
//'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
// додаємо тайли
L.tileLayer('https://api.mapbox.com/styles/v1/evgeshadrozdova/cjsqjh1to30c81ftn8jnuikgj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXZnZXNoYWRyb3pkb3ZhIiwiYSI6ImNqMjZuaGpkYTAwMXAzMm5zdGVvZ2c0OHYifQ.s8MMs2wW15ZyUfDhTS_cdQ', {
    minZoom: 5,
    maxZoom: 10,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);




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

//контроли у правий ніжній кут
map.attributionControl.setPosition('bottomleft');
map.zoomControl.setPosition('bottomright');


map.on('click', function(ev){
    var latlng = map.mouseEventToLatLng(ev.originalEvent);
    console.log(latlng.lat + ', ' + latlng.lng);
});

var markerSprites = [];
var pixiContainer = new PIXI.Container();
var zoomChangeTs = null;

document.addEventListener("DOMContentLoaded", function() {

        getJSON('https://raw.githubusercontent.com/texty/parliament_elections/master/data/new_map_data.json', function (markers) {

           markers.forEach(function(d){
                d.Latitude = +d.Latitude;
                d.Longitude = +d.Longitude;
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
                            if (marker['x_2007'] != undefined) {
                                var radians = Math.PI / 100 * 50;

                                var coords = project([marker.Latitude, marker.Longitude]);

                                var line = new PIXI.Graphics();

                                line.clear();
                                let x = marker["x_2006"];
                                let y = marker["y_2006"];

                                var from_x = 0;
                                var from_y = 0;
                                var to_x = x * 100;
                                var to_y = y * 100;

                                var headlen = 10;
                                var angle = Math.atan2(to_y - from_y, to_x - from_x);
                                var colorAngle =  Math.atan2(y, x) * 180 / Math.PI;

                                line
                                    .lineStyle(2, 0xf3a33f, 1)
                                    .moveTo(from_x, from_y)
                                    .lineTo(to_x, to_y)
                                    .lineTo(to_x - headlen * Math.cos(angle - Math.PI / 6), to_y - headlen * Math.sin(angle - Math.PI / 6))
                                    .moveTo(to_x, to_y)
                                    .lineTo(to_x - headlen * Math.cos(angle + Math.PI / 6), to_y - headlen * Math.sin(angle + Math.PI / 6));


                                line.position.x = coords.x;
                                line.position.y = coords.y;

                                if(colorAngle >= 150 || colorAngle <= -90){ TweenMax.to(line,  0, {  pixi:{ lineColor: "blue" } } ) }  //ua
                                else if (colorAngle <= 30 &&  colorAngle > -90 ){  TweenMax.to(line,  0, {  pixi:{ lineColor: "red" } } )  } //ru
                                else  { TweenMax.to(line, 0, { pixi: {  lineColor: "green" }} ) } //pop


                                line.interactive = true;
                                line.scale.set(invScale);

                                // Тут можна в спрайт упакувати ті дані, що потрібно
                                line.info = [{
                                    "Polling_station": marker["2012_Polling_station"],
                                    "2006": [marker["x_2006"], marker["y_2006"]],
                                    "2007": [marker["x_2007"], marker["y_2007"]],
                                    "2012": [marker["x_2012"], marker["y_2012"]],
                                    "2014": [marker["x_2014"], marker["y_2014"]],
                                    "2019": [marker["x_2019"], marker["y_2019"]]

                                }];

                                container.addChild(line);
                                markerSprites.push(line);


                                line.rotation = 0;
                                //line.rotation -= radians
                            } else {
                                marker.alpha = 0;
                            }

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


                    // capture immediately
                    // var data = renderer.view.toDataURL("image/png", 1);
                    // $('img#render').attr('src', data);


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


        // changeData(1);




        ////////////////////////////////////////////////////////////////////////

        function changeData(year) {
            console.log(markerSprites[3]);
            markerSprites.forEach(function(p, i){
                var markerSprite = markerSprites[i];
                markerSprite.clear();
                if(markerSprite.info[0][year][0] !=  undefined) {

                    let x = markerSprite.info[0][year][0];
                    let y = markerSprite.info[0][year][1];

                    var from_x = 0;
                    var from_y = 0;
                    var to_x =  x * 100;
                    var to_y =  y * 100;

                    var headlen = 10;
                    var angle = Math.atan2(to_y - from_y, to_x - from_x);
                    var colorAngle =  Math.atan2(y, x) * 180 / Math.PI;


                    markerSprite
                        .lineStyle(2, 0xf3a33f, 1)
                        .moveTo(from_x, from_y)
                        .lineTo(to_x, to_y)
                        .lineTo(to_x - headlen * Math.cos(angle - Math.PI / 6), to_y - headlen * Math.sin(angle - Math.PI / 6))
                        .moveTo(to_x, to_y)
                        .lineTo(to_x - headlen * Math.cos(angle + Math.PI / 6), to_y - headlen * Math.sin(angle + Math.PI / 6));

                    markerSprite.alpha = 1;

                    if(colorAngle >= 150 || colorAngle <= -90){ TweenMax.to(markerSprite,  0, {  pixi:{ lineColor: "blue" } } ) }  //ua
                    else if (colorAngle <= 30 &&  colorAngle > -90 ){  TweenMax.to(markerSprite,  0, {  pixi:{ lineColor: "red" } } )  } //ru
                    else  { TweenMax.to(markerSprite, 0, { pixi: {  lineColor: "green" }} ) } //pop

                    markerSprite.rotation = 0;


                } else {
                    markerSprite.alpha = 0;
                }


            })
        }


    d3.selectAll(".pane").on("click", function(){
        d3.selectAll(".pane").classed("active", false);
        d3.select(this).classed("active", true);

        let year = d3.select(this).attr("data");
        changeData(year);
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




