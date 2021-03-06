/* based on
 - Tom Pearson's Ternary plot example:  http://bl.ocks.org/tomgp/7674234
 - Tom Shanley’s Ternary color grid https://bl.ocks.org/tomshanley/db1ac0efe50844239f20aa3762dd1729
 - Marielle Lange’s Rapid implementation of a ternary plot with d3js http://bl.ocks.org/widged/5780720
 */


const delay_r = 0;
const delay_anim = 1000;

//однорідні області
const smooth = ["Львівська область", "Івано-Франківська область", "Тернопільська область", "Донецька область", "Луганська область"];

//строкаті області
const unsmooth = ["Житомирська область", "Закарпатська область", "Чернівецька область", "Сумська область", "Чернігівська область", "Полтавська область"];


//Точки в Закарпатській, Чернівецькій та Сумській обл., про які йде мова в тексті і які треба підсвітити
const scale_points = [

    //Закарпатська
    "місто Берегове",
    "Берегівський район",
    "Виноградівський район",

    //Чернівецька
    "Герцаївський район",
    "Глибоцький район",
    "Сторожинецький район",
    "Новоселицький район",

    //Сумська
    "Середино-Будський район",
    "Великописарівський район",

    //Тернопільська
    "Шумський район",
    "Лановецький район",
    "Кременецький район",
    "Збаразький район",

    //Житомирська область
    "місто Коростень"
];



//райони в Чернівецькій області, що були у складі Російської імперії, які теж треба підсвітити по тексту
const chernivetska = [
    "Сокирянський район",
    "Хотинський район",
    "Кельменецький район",
    "Новоселицький район"
];

d3.csv("../data/ternary_big.csv").then(function(data) {

    const years_arr = ["2006", "2007", "2012", "2014", "2019"];


    const green_pixi = '0xFFC107';
    const green = '#FFC107';
    const red = '#F47874';
    const blue = '#5B95FF';

    data.forEach(function (d) {
        d.ua_2006 = +d.ua_2006 * 100;
        d.ua_2007 = +d.ua_2007 * 100;
        d.ua_2012 = +d.ua_2012 * 100;
        d.ua_2014 = +d.ua_2014 * 100;
        d.ua_2019 = +d.ua_2019 * 100;

        d.ru_2006 = +d.ru_2006 * 100;
        d.ru_2007 = +d.ru_2007 * 100;
        d.ru_2012 = +d.ru_2012 * 100;
        d.ru_2014 = +d.ru_2014 * 100;
        d.ru_2019 = +d.ru_2019 * 100;

        d.pop_2006 = +d.pop_2006 * 100;
        d.pop_2007 = +d.pop_2007 * 100;
        d.pop_2012 = +d.pop_2012 * 100;
        d.pop_2014 = +d.pop_2014 * 100;
        d.pop_2019 = +d.pop_2019 * 100;

    });


    var plot = {
        dataset: []
    };

    var opt = {
        width: 900,
        height: 650,
        side: 500,
        margin: 150,
        axis_labels: ['national-democratic', 'pro-Russian or communist', 'populist'],
        axis_ticks: [0, 33, 66, 100],
        ticks_line: [0, 33, 66, 100],
        tickLabelMargin: 10,
        axisLabelMargin: 40
    };

    var w = opt.side;
    var h = Math.sqrt(opt.side * opt.side - (opt.side / 2) * (opt.side / 2));

    var corners = {
        "left": {},
        "top": {},
        "right": {}
    };


    corners.left.x = opt.margin;
    corners.left.y = opt.margin;
    corners.top.x = (w / 2) + opt.margin;
    corners.top.y = h + opt.margin;
    corners.right.x = w + opt.margin;
    corners.right.y = opt.margin;

    function coord(arr) {
        var a = arr[0], b = arr[1], c = arr[2];
        var sum, pos = [0, 0];
        sum = a + b + c;
        if (sum !== 0) {
            a = a / sum;
            b = b / sum;
            c = c / sum;
            pos.x = corners.left.x * a + corners.right.x * b + corners.top.x * c;
            pos.y = corners.left.y * a + corners.right.y * b + corners.top.y * c;

        }
        return pos;
    }


    let stage = new PIXI.Container();

    let renderer = PIXI.autoDetectRenderer(opt.width, opt.height,
        { antialias: true, transparent: !0, resolution: window.devicePixelRatio });

    document.getElementById("big_ternary").appendChild(renderer.view);


    // підписи ло вісей
    const tick_labels = [
        { label: "pro-Russian or communist", pos: [0, 0, 100], rot: -45, color: red, yShift: 20, xShift: 40 },
        { label: "populist", pos: [100, 0, 0], rot: 45, color: green, yShift: 0, xShift: -40},
        { label: "support of the national-democratic forces", pos: [65, 100-65, 0], rot: 0, color: blue, yShift: -60, xShift: 0 }
    ];

    tick_labels.forEach(function (v) {
        const style_labels = new PIXI.TextStyle({ fontSize: 18,  fill: v.color, anchor: (1, 1), letterSpacing: 0.5 });
        var tick_label = new PIXI.Text(v.label, style_labels);
        tick_label.position.x = coord(v.pos).x + v.xShift;
        tick_label.position.y = coord(v.pos).y + v.yShift;
        tick_label.rotation = v.rot;
        stage.addChild(tick_label);
    });

    // стрілки вісів
    const tick_lines = [
        { label: "pro-Russian or communist", posFrom: [0, 45, 100-45], posTo: [0, 100, 0], rot: -45, color: 0xF47874, yShift: 20, xShift: 55 },
        { label: "populist", posFrom: [100-17, 0, 17], posTo: [0, 0, 110],  rot: 45, color: green_pixi, yShift: 0, xShift: -50 },
        { label: "support level of national-democratic forces", posFrom: [70, 100-70, 0], posTo: [100, 0, 0],  rot: 0, color: 0x5B95FF, yShift: -45, xShift: 0 }
    ];

    tick_lines.forEach(function (v) {

       var tick_line = new PIXI.Graphics();

        var from_x = coord(v.posFrom).x + v.xShift;
        var from_y = coord(v.posFrom).y + v.yShift ;
        var to_x = coord(v.posTo).x + v.xShift;
        var to_y = coord(v.posTo).y + v.yShift ;


        var headlen = 10;
        var angle = Math.atan2(to_y - from_y, to_x - from_x);

        tick_line
            .lineStyle(2, v.color, 1)
            .moveTo(from_x, from_y)
            .lineTo(to_x, to_y)
            .lineTo(to_x - headlen * Math.cos(angle - Math.PI / 6), to_y - headlen * Math.sin(angle - Math.PI / 6))
            .moveTo(to_x, to_y)
            .lineTo(to_x - headlen * Math.cos(angle + Math.PI / 6), to_y - headlen * Math.sin(angle + Math.PI / 6));

        stage.addChild(tick_line);


    });


    // ticks
    opt.axis_ticks.forEach(function (v) {
        var coord1 = coord([v, 100 - v, 0]);
        var coord2 = coord([0, v, 100 - v]);
        var coord3 = coord([100 - v, 0, v]);


        const style_a = new PIXI.TextStyle({ fontSize: 14,  fill: blue });
        var tick_a = new PIXI.Text(v, style_a);
        tick_a.position.x = coord1.x;
        tick_a.position.y = coord1.y - 30;
        stage.addChild(tick_a);

        const style_b = new PIXI.TextStyle({ fontSize: 14,  fill: red });
        var tick_b = new PIXI.Text(v, style_b);
        tick_b.position.x = coord2.x + 20;
        tick_b.position.y = coord2.y;
        stage.addChild(tick_b);

        const style_c = new PIXI.TextStyle({ fontSize: 14,  fill: green });
        var tick_c = new PIXI.Text(v, style_c);
        tick_c.position.x = coord3.x-20;
        tick_c.position.y = coord3.y;
        stage.addChild(tick_c);




    });

    opt.ticks_line.forEach(function (v) {
        var coord1 = coord([v, 100 - v, 0]);
        var coord2 = coord([0, v, 100 - v]);
        var coord3 = coord([0, 100 - v, v]);
        var coord4= coord([v, 0, 100 - v]);

        if(v !== 0 && v !== 100){
            let tick_a_line = new PIXI.Graphics();
            tick_a_line
                .lineStyle(2, 0x5B95FF, 0.5)
                .moveTo(coord1.x, coord1.y)
                .lineTo(coord4.x, coord4.y);
            stage.addChild(tick_a_line);


            let tick_b_line = new PIXI.Graphics();
            tick_b_line
                .lineStyle(2, green_pixi, 0.5)
                .moveTo(coord4.x, coord4.y)
                .lineTo(coord2.x, coord2.y);
            stage.addChild(tick_b_line);

            let tick_c_line = new PIXI.Graphics();
            tick_c_line
                .lineStyle(2, 0xF47874, 0.5)
                .moveTo(coord1.x, coord1.y)
                .lineTo(coord3.x, coord3.y);
            stage.addChild(tick_c_line);
        }

        if(v === 0 || v === 100){
            let tick_a_line = new PIXI.Graphics();
            tick_a_line
                .lineStyle(1, 0x808080, 1)
                .moveTo(coord1.x, coord1.y)
                .lineTo(coord4.x, coord4.y);
            stage.addChild(tick_a_line);


            let tick_b_line = new PIXI.Graphics();
            tick_b_line
                .lineStyle(1, 0x808080, 1)
                .moveTo(coord4.x, coord4.y)
                .lineTo(coord2.x, coord2.y);
            stage.addChild(tick_b_line);

            let tick_c_line = new PIXI.Graphics();
            tick_c_line
                .lineStyle(1, 0x808080, 1)
                .moveTo(coord1.x, coord1.y)
                .lineTo(coord3.x, coord3.y);
            stage.addChild(tick_c_line);
        }


    });


    //////////////////////////////////////////////
    // Draw triangle color background
    var rows = 3 ; // *
    var rotateHSL = 180; //*

    var maxDistanceToCentre = Math.ceil(2 * (h / 3)); //*

    var centre = {
        "x": (w / 2) + opt.margin,
        "y": opt.margin + maxDistanceToCentre
    };

    let colourArr = [green, red, blue]; // *

    let colourScale = chroma.scale() // *
        .mode('lab')
        .domain([0, 120, 240, 360])
        .range([colourArr[0], colourArr[1], colourArr[2], colourArr[0]]);

    var triangles = createTriangleGrid(rows, w, h);

    triangles.forEach(function(tr){

        this.polyPts = [
            tr.corners[0][0], tr.corners[0][1],
            tr.corners[1][0], tr.corners[1][1],
            tr.corners[2][0], tr.corners[2][1],
            tr.corners[0][0], tr.corners[0][1]
        ];

        let r = tr.color._rgb[0];
        let g = tr.color._rgb[1];
        let b = tr.color._rgb[2];

        let rgb_value = [r, g, b];
        let fillcolor =  "0x" + hex(rgb_value[0]) + hex(rgb_value[1]) + hex(rgb_value[2]);


        var poly = new PIXI.Graphics();
        poly.clear();
        //poly.lineStyle(1, 0x000000, 1);
        poly.lineStyle(1, fillcolor, 1);
        poly.beginFill(fillcolor);
        poly.drawPolygon(this.polyPts);
        poly.endFill();
        poly.alpha = 0.2;
        stage.addChild(poly);


    });




    var points_all = [];
    var lines_all = [];


    //////////////////////////////////////////////
    // Додати всі точки
    function draw_all_points(df, scale_array, tip_array) {
        points_all = [];

        df.forEach(function(d){

            var radius = scale_array.includes(d.rayon) ? 10 : 6;

            const point = new PIXI.Graphics();
            point.clear();
            
            if(!isNaN(d.ua_2012) ){
                //draw point
                let x = coord([d.ua_2012, d.ru_2012, d.pop_2012]).x;
                let y = coord([d.ua_2012, d.ru_2012, d.pop_2012]).y;

                let r = ternaryFill(x, y)._rgb[0];
                let g = ternaryFill(x, y)._rgb[1];
                let b = ternaryFill(x, y)._rgb[2];

                let rgb_value = [r, g, b];
                let fillcolor =  "0x" + hex(rgb_value[0]) + hex(rgb_value[1]) + hex(rgb_value[2]);

                point.lineStyle(1, 0x000000, 1);
                point.beginFill(fillcolor, 1);
                point.drawCircle(0, 0, radius);
                point.endFill();

                point.position.x = x;
                point.position.y = y;
            }

            const tooltipStyle = new PIXI.TextStyle({
                fontSize: '16px',
                fill: "#333",
                align: "center"
            });

            //create tooltip
            var message = new PIXI.Text(d.rayon_en, tooltipStyle);

            //create white rect behind tip
            const txtBG = new PIXI.Sprite(PIXI.Texture.WHITE);
            txtBG.width = message.width;
            txtBG.height = message.height;

            if(tip_array.includes(d.rayon)) {
                message.x = radius * 1.5;
                message.y = -10;
                txtBG.x = radius * 1.5;
                txtBG.y = -10;
                point.message = message;
                point.background = txtBG;
                point.addChild(txtBG);
                point.addChild(message);
            }

            point.on('mouseover', function(event) {
                message.x = radius * 1.5;
                message.y = -10;
                txtBG.x = radius * 1.5;
                txtBG.y = -10;
                point.message = message;
                point.background = txtBG;
                point.addChild(txtBG);
                point.addChild(message);
                stage.removeChild(point);
                stage.addChild(point);
            });

            point.on("mouseout", function(event) {
                point.removeChild(point.message);
                point.removeChild(point.background);
            });

            point.info = [{
                "rayon": d.rayon,
                "oblast": d.oblast,
                "2006": coord([d.ua_2006, d.ru_2006, d.pop_2006]),
                "2007": coord([d.ua_2007, d.ru_2007, d.pop_2007]),
                "2012": coord([d.ua_2012, d.ru_2012, d.pop_2012]),
                "2014": coord([d.ua_2014, d.ru_2014, d.pop_2014]),
                "2019": coord([d.ua_2019, d.ru_2019, d.pop_2019])
            }];

            point.interactive = true;
            points_all.push(point);

            //point.alpha = 0;
            stage.addChild(point);

            TweenMax.to(point, 1, {
                pixi: { alpha: 1 }
            });

        });
    }


    //////////////////////////////////////////////
    // Додати лінії
    var region_for_lines = "";
    function drawLines(years, delay){

        var filtered;
        if(region_for_lines != "") {
            filtered = data.filter(function(d){
                return region_for_lines.includes(d.oblast)
            });
        } else {
            filtered = data
        }

        filtered.forEach(function(d){

            var segment_fill = 0xD1D1D1;

            const line = new PIXI.Graphics();
            line.info = [{
                "rayon": d.rayon,
                "oblast": d.oblast,
                "2006": coord([d.ua_2006, d.ru_2006, d.pop_2006]),
                "2007": coord([d.ua_2007, d.ru_2007, d.pop_2007]),
                "2012": coord([d.ua_2012, d.ru_2012, d.pop_2012]),
                "2014": coord([d.ua_2014, d.ru_2014, d.pop_2014]),
                "2019": coord([d.ua_2019, d.ru_2019, d.pop_2019])
            }];

            years.forEach(function(year, i){
                if( i < years.length - 1){

                    const segment = new PIXI.Graphics();
                    segment.clear();

                    let current_year = years[i];
                    let next_year = years[i+1];

                    let opacity_value = (i * (1/(years.length-1))) + 0.2;
                    setTimeout(function(){
                        segment
                            .lineStyle(1, segment_fill, 1)
                            .moveTo(line.info[0][current_year].x, line.info[0][current_year].y)
                            .lineTo(line.info[0][next_year].x, line.info[0][next_year].y);

                        lines_all.push(segment);
                        stage.addChild(segment);
                        points_all.forEach(function(d, i){
                            let point = points_all[i];
                            stage.removeChild(point);
                            stage.addChild(point);
                        });
                     }, delay);



                }

            });
        });

    }



    //////////////////////////////////////////////
    // Поміняти рік
    function change_data(year){
        points_all.forEach(function(p, i) {
            var point = points_all[i];

            if(!isNaN(point.info[0][year].x) ) {
                point.alpha = 1;

                let xpos = point.info[0][year].x;
                let ypos = point.info[0][year].y;

                let r = ternaryFill(xpos, ypos)._rgb[0];
                let g = ternaryFill(xpos, ypos)._rgb[1];
                let b = ternaryFill(xpos, ypos)._rgb[2];

                let newFill = `rgb(${r},${g},${b})`;


                TweenMax.to(point, 1, {
                    x: xpos,
                    y: ypos
                });


                TweenMax.to(point, 0, {
                    pixi: { fillColor: newFill }
                })
            } else {
                 point.alpha = 0;
            }

            stage.removeChild(point);
            stage.addChild(point);
        });


    }


    //////////////////////////////////////////////
    // Однорідні області
    var show_smooth = function(){
        points_all.forEach(function(p, i) {
            var point = points_all[i];
            point.alpha = 1;

            if(!smooth.includes(point.info[0].oblast)) {
                TweenMax.to(point, 0.5, {
                    pixi: {alpha: 0.2 }
                })
            }
        });

    };

    //////////////////////////////////////////////
    // Неоднорідні області
    var show_unsmooth = function(){
        points_all.forEach(function(p, i) {
            var point = points_all[i];
            point.alpha = 1;

            if(!unsmooth.includes(point.info[0].oblast)) {
                TweenMax.to(point, 0.5, {
                    pixi: {alpha: 0.2 }
                })
            }
        });

    };

    function filter_data(oblast, scale_array, tip_array){

        points_all.forEach(function(p, i) {
            stage.removeChild(points_all[i]);
        });

        points_all = [];

        let input = data.filter(function(d){  return oblast.includes(d.oblast)  });

        draw_all_points(input,  scale_array, tip_array);
    }


    animate();

    function animate() {
        renderer.render(stage);
        requestAnimationFrame( animate );
    }


    function redrawLines(years, delay){
        lines_all.forEach(function(p, i) {
            stage.removeChild(lines_all[i])
        });

        lines_all = [];

        if(region_for_lines != '') {
            drawLines(years, delay)
        }

    }



    function ternaryFill(x, y) {
        let point = [x, y];
        let fillColor = "";

        triangles.some(function(t) {
            if (d3.polygonContains(t.corners, point)) {
                fillColor = t.color;
                return true
            }
        });

        return fillColor
    }

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }


    function triangleHeight(width) {
        return Math.sqrt((width * width) - (width / 2 * width / 2));
    }

    function angleTan(opposite, adjacent) {
        return Math.atan(opposite / adjacent);
    }

    function triangleHypotenuse(sideA, sideB) {
        return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2))
    }

    function distanceRatio(x, y) {
        return triangleHypotenuse(x, y) / maxDistanceToCentre
    }

    //////////////////////////////////////////////
    // Functions to draw the grid

        function trianglePath(corners) {
            return "M " + corners[0][0] +
                " " + corners[0][1] +
                " L " + corners[1][0] +
                " " + corners[1][1] +
                " L " + corners[2][0] +
                " " + corners[2][1] +
                " z"
        }

        //////////////////////////////////////////////
        // Functions to create the grid data

        function createTriangleGrid(_rows, _width, _height) {

            let trianglesHeight = _height / _rows;
            let trianglesWidth = _width / _rows;
            let arrGrid = [];

            for (var row = 0; row < _rows; row++) {
                for (var col = 0; col < ((row * 2) + 1); col++) {

                    let t = {};
                    t.row = row;
                    t.col = col;
                    t.corners = [];

                    let top = corners.top.y - (row * trianglesHeight);
                    let mid = corners.top.x - (row * (trianglesWidth / 2)) + (col * (trianglesWidth / 2));
                    let right = mid + (trianglesWidth / 2);
                    let left = mid - (trianglesWidth / 2);
                    let bottom = top - trianglesHeight;

                    if ((col % 2) == 0) {

                        t.corners[0] = [mid, top] ;// top
                        t.corners[1] = [left, bottom] ;// bottom left
                        t.corners[2] = [right, bottom] ;// bottom right
                        t.centre = [mid, (top - (2 * (trianglesHeight / 3)))]

                    } else {

                        t.corners[0] = [left, top]; // top left
                        t.corners[1] = [right, top]; // left right
                        t.corners[2] = [mid, bottom]; // right
                        t.centre = [mid, (top - (trianglesHeight / 3))]

                    }

                    t.color = colorStep(t);
                    arrGrid.push(t)

                }
            }

            return arrGrid
        }


        function colorStep(d) {

            let dx = d.centre[0];
            let dy = d.centre[1];

            let x = Math.abs(dx - centre.x);
            let y = Math.abs(dy - centre.y);

            if (dy < centre.y && dx > centre.x) {
                d.angle = 180 - (angleTan(x,y) * (180 / Math.PI))
            } else if (dy <= centre.y && dx <= centre.x) {
                d.angle = 220 + (angleTan(x,y) * (180 / Math.PI))
            } else if (dy >= centre.y && dx >= centre.x) {
                d.angle =  360 - (angleTan(x,y) * (180 / Math.PI))
            }

            // хз для чого це, воно ні на що візуально не впливає?
            // else if (dy > centre.y && dx < centre.x) {
            //     d.angle =  (angleTan(x,y) * (180 / Math.PI))
            // }

            if (d.angle < 60 || d.angle > 300 ) {
                x = Math.abs(dx - corners.top.x);
                y = Math.abs(dy - corners.top.y);
                d.distance = distanceRatio(x, y)

            } else if (d.angle >= 60 && d.angle <=  180  ) {
                x = Math.abs(dx - corners.right.x);
                y = Math.abs(dy - corners.right.y);
                d.distance = distanceRatio(x, y)

            } else if (d.angle > 180 && d.angle <=  300 ) {
                x = Math.abs(dx - corners.left.x);
                y = Math.abs(dy - corners.left.y);
                d.distance = distanceRatio(x, y)
            }

            d.hAngle = Math.floor(d.angle + rotateHSL);
            d.sat = 0.6 - (d.distance / 2);
            d.lum =  0.2 + (d.distance * 0.8);

            let hslColor = colourScale(d.angle)
                .luminance(d.lum, 'lab')
                .saturate(0.1);

            console.log(hslColor);

            //костиль для світло-зеленої зони,  яка глючить
            if(hslColor._rgb[0] === 255 && hslColor._rgb[1] === 255 && hslColor._rgb[2] === 255){
                hslColor._rgb[0] = 255;
                hslColor._rgb[1] = 218;
                hslColor._rgb[2] = 128;
            }

            //темно-зелений
            else if(Math.round(hslColor._rgb[0]) === 230 && Math.round(hslColor._rgb[1]) === 173 && Math.round(hslColor._rgb[2]) === 1) {
                hslColor._rgb[0] = 255;
                hslColor._rgb[1] = 193;
                hslColor._rgb[2] = 7;
            }



            return hslColor
        }


        plot.getPosition = coord;

    //     return plot;
    // }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }


    // initialize the scrollama
    var container = d3.select('#scroll_t');
    var graphic = container.select('.scroll__graphic');
    var chart = graphic.select('#big_ternary');
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

        if(r.index === 8 && r.direction === "down") {
            d3.select("#show_2012").style("background-color", "#f59894");
            region_for_lines = "";
            points_all.forEach(function(p, i) { stage.removeChild(points_all[i]); });
            draw_all_points(data, [], [], []);
            points_all.forEach(function(p, i) {
                points_all[i].alpha = 1;
            });
        }

        if(r.index === 8 && r.direction === "up") {
            // redrawLines(["2007", "2012"]);
            region_for_lines = "";
            lines_all.forEach(function(p, i) { stage.removeChild(lines_all[i]); });
            points_all.forEach(function(p, i) { stage.removeChild(points_all[i]); });
            d3.selectAll(".test_big").style("background-color", "lightgrey");
            d3.select("#show_2012").style("background-color", "#f59894");
            draw_all_points(data, [], [], []);
        }


        if(r.index === 9) {
            region_for_lines = "Закарпатська область";
            redrawLines(["2007", "2012"], delay_r);

            change_data("2012");
            d3.selectAll(".test_big").style("background-color", "lightgrey");
            d3.select("#show_2012").style("background-color", "#f59894");
            filter_data("Закарпатська область", scale_points, scale_points)
        }


        if(r.index === 10 && r.direction === "down") {
            region_for_lines = "Чернівецька область";
            redrawLines(["2007", "2012"], delay_r);
            d3.selectAll(".test_big").style("background-color", "lightgrey");
            d3.select("#show_2012").style("background-color", "#f59894");
            change_data("2012");
            filter_data("Чернівецька область", scale_points, scale_points)
        }

        if(r.index === 10 && r.direction === "up") {
            region_for_lines = "Закарпатська область";
            redrawLines(["2007", "2012"], delay_r);
            d3.selectAll(".test_big").style("background-color", "lightgrey");
            d3.select("#show_2012").style("background-color", "#f59894");
            change_data("2012");
            filter_data("Закарпатська область", scale_points, scale_points)
        }


        if(r.index === 11) {
            region_for_lines = "Чернівецька область";

        }

        if(r.index === 12) {
            region_for_lines = "Чернівецька область";
            redrawLines(["2007", "2012"], delay_r);
            d3.selectAll(".test_big").style("background-color", "lightgrey");
            d3.select("#show_2012").style("background-color", "#f59894");
            filter_data("Чернівецька область", chernivetska, ["Кельменецький район", "Сокирянський район"])
        }
        
        if(r.index === 13) {
            region_for_lines = "Тернопільська область";
            redrawLines(["2007", "2012"], delay_r);
            d3.selectAll(".test_big").style("background-color", "lightgrey");
            d3.select("#show_2012").style("background-color", "#f59894");
            filter_data("Тернопільська область", scale_points, scale_points)
        }

        if(r.index === 14) {
            region_for_lines = "Сумська область";
            redrawLines(["2007", "2012"], delay_r);
            d3.selectAll(".test_big").style("background-color", "lightgrey");
            d3.select("#show_2012").style("background-color", "#f59894");
            filter_data("Сумська область", scale_points, scale_points)
        }

        if(r.index === 15) {
            region_for_lines = "Житомирська область";
            redrawLines(["2007", "2012"], delay_r);
            d3.selectAll(".test_big").style("background-color", "lightgrey");
            d3.select("#show_2012").style("background-color", "#f59894");
            filter_data("Житомирська область", scale_points, scale_points)
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
            container: '#scroll_t',
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

    d3.selectAll(".test_big").on("click", function(d){
        var seleted_years = [];
        d3.selectAll(".test_big").style("background-color", "lightgrey");
        d3.select(this).style("background-color", "#f59894");
        let year = d3.select(this).attr("id").replace("show_", "");
        let index = years_arr.indexOf(year);
        seleted_years.push(years_arr[index]);
        if(year !="2006") {
            seleted_years.push(years_arr[index-1]);
        }
        redrawLines(seleted_years, delay_anim);
        change_data(year);

    })


});
