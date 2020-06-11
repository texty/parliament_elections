/**
 * Created by yevheniia on 04.06.20.
 */
/** актуальний файл для ternary-plots */

// const green = '#009601';
// const red = '#FF2121';
// const blue = '#0887FF';

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


//точки для пояснювального блоку
const instructions = [
    {"vector": "ru", "pos": [5, 90, 5], "fill": "#FF2121"},
    {"vector": "ua", "pos": [90, 5, 5], "fill": "#0887FF"},
    {"vector": "pop", "pos": [5, 5, 90], "fill": "#009601"},
    {"vector": "center", "pos": [33, 33, 33], "fill": "white"}
];





d3.csv("data/ternary_big.csv").then(function(data) {

    const green = '#009601';
    const red = '#FF2121';
    const blue = '#0887FF';

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
        height: 800,
        side: 700,
        margin: 100,
        axis_labels: ['проукраїнські', 'проросійські', 'популістські'],
        axis_ticks: [0, 20, 40, 60, 80, 100],
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
        {antialias: !0, transparent: !0, resolution: 1});

    document.getElementById("big_ternary").appendChild(renderer.view);



    const tick_labels = [
        { label: "проросійські", pos: [0, 55, 100 - 55], rot: -45, color: red, transform: 80 },
        { label: "популісти", pos: [100 - 35, 0, 35], rot: 45, color: green, transform: 80 },
        { label: "проукраїнські", pos: [55, 100 - 55, 0], rot: 0, color: blue, transform: -60 }
    ];

    tick_labels.forEach(function (v) {
        const style_labels = new PIXI.TextStyle({ fontSize: 18,  fill: v.color, anchor: (0.5, 0.5) });
        var tick_label = new PIXI.Text(v.label, style_labels);
        tick_label.position.x = coord(v.pos).x;
        tick_label.position.y = coord(v.pos).y + v.transform;
        tick_label.rotation = v.rot;
        stage.addChild(tick_label);


    });


    opt.axis_ticks.forEach(function (v) {
        var coord1 = coord([v, 100 - v, 0]);
        var coord2= coord([0, 100 - v, v]);
        var coord3 = coord([100 - v, 0, v]);
        var coord4 = coord([v, 0, 100 - v]);
        var coord5 = coord([0, v, 100 - v]);

        const style_a = new PIXI.TextStyle({ fontSize: 14,  fill: blue });
        var tick_a = new PIXI.Text(v, style_a);
        tick_a.position.x = coord1.x;
        tick_a.position.y = coord1.y - 30;
        stage.addChild(tick_a);

        const style_b = new PIXI.TextStyle({ fontSize: 14,  fill: red });
        var tick_b = new PIXI.Text(v, style_b);
        tick_b.position.x = coord5.x + 20;
        tick_b.position.y = coord5.y;
        stage.addChild(tick_b);

        const style_c = new PIXI.TextStyle({ fontSize: 14,  fill: green });
        var tick_c = new PIXI.Text(v, style_c);
        tick_c.position.x = coord3.x-20;
        tick_c.position.y = coord3.y;
        stage.addChild(tick_c);

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
        poly.lineStyle(1, 0x000000, 1);
        poly.beginFill(fillcolor);
        poly.drawPolygon(this.polyPts);
        poly.endFill();
        poly.alpha = 0.2;
        stage.addChild(poly);


    });




    var points_all = [];
    var lines_all = [];
    var instruction_points = [];

    //////////////////////////////////////////////
    // Точки інструкції
    instructions.forEach(function(d){
        var p = new PIXI.Graphics();

        let x = coord([33, 33, 33]).x;
        let y = coord([33, 33, 33]).y;

        p.lineStyle(1, 0x000000, 1);
        p.beginFill(0xffffff, 1);
        p.drawCircle(0, 0, 8);
        p.endFill();

        p.position.x = x;
        p.position.y = y;

        p.info = [{
            "title": d.vector,
            "coord": d.pos,
            "fill": d.fill
        }];

        instruction_points.push(p);
        stage.addChild(p);

    });

    function run_instruction(vector){
        instruction_points.forEach(function(d,i){
            var current_p = instruction_points[i];

            if(current_p.info[0].title === vector && vector != "center"){

                let xpos = coord(current_p.info[0].coord).x;
                let ypos = coord(current_p.info[0].coord).y;
                let fill = current_p.info[0].fill;

                TweenMax.to(current_p, 1, { x: xpos, y: ypos  });
                TweenMax.to(current_p, 0, {  pixi: { fillColor: fill }  })
            }

            if(vector === "center"){
                let pos =  coord([33, 33, 33]);

                TweenMax.to(current_p, 1, { x: pos.x, y: pos.y  });
                TweenMax.to(current_p, 0, {  pixi: { fillColor: "white" }  })

            }
        })
    }



    //////////////////////////////////////////////
    // Додати всі точки
    function draw_all_points(df, scale_array, tip_array) {
        points_all = [];

        df.forEach(function(d){

            var radius = scale_array.includes(d.rayon) ? 10 : 5;

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
            var message = new PIXI.Text(d.rayon, tooltipStyle);

            //create white rect behind tip
            const txtBG = new PIXI.Sprite(PIXI.Texture.WHITE);
            txtBG.width = message.width, txtBG.height = message.height;

            if(tip_array.includes(d.rayon)) {
                message.x = radius * 1.5;
                message.y = -10;
                txtBG.x = radius * 1.5;
                txtBG.y = -10;
                point.message = message;
                point.background = txtBG;
                point.addChild(txtBG);
                point.addChild(message);
                //можливо закинути їх в окремий array і вмнести наверх, коли всі точки буде додано

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

            point.alpha = 0;
            stage.addChild(point);

            TweenMax.to(point, 2, {
                pixi: { alpha: 1 }
            });


            //прибираємо точки-інструкції
            instructions.forEach(function(d, i){
                var current_p = instruction_points[i];
                stage.removeChild(current_p);

            })

        });
    }


    //////////////////////////////////////////////
    // Додати лінії
    function drawLines(oblast, years){



        const filtered = data.filter(function(d){
            return oblast.includes(d.oblast)
        });




        filtered.forEach(function(d){

            var segment_fill = d.oblast === "Рівненська область" ?  0xFF2121 : 0x808080;

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

                    segment
                        .lineStyle(1, segment_fill, opacity_value)
                        .moveTo(line.info[0][current_year].x, line.info[0][current_year].y)
                        .lineTo(line.info[0][next_year].x, line.info[0][next_year].y);

                    lines_all.push(segment);
                    stage.addChild(segment);

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

    /////////////////////////////////////////////
    // Показати конкретну область
    // function filter_data(oblast, array){
    //     points_all.forEach(function(p, i) {
    //         var point = points_all[i];
    //         point.alpha = 1;
    //
    //
    //         if(!array.includes(point.info[0].rayon)) {
    //             TweenMax.to(point, 0.5, {
    //                 pixi: {alpha: 1, scale: 1 }
    //             })
    //         }
    //
    //         if(point.info[0].oblast != oblast) {
    //             TweenMax.to(point, 0.5, {
    //                 pixi: { alpha: 0 }
    //             })
    //         }
    //
    //         if(array.includes(point.info[0].rayon)) {
    //             TweenMax.to(point, 0.5, {
    //                 pixi: { lineWidth: 2, scale: 1.5 }
    //             });
    //         }
    //     });
    //
    //
    //     lines_all.forEach(function(p, i) {
    //         stage.removeChild(lines_all[i])
    //     })
    // }


    function filter_data(oblast, scale_array, tip_array){

        points_all.forEach(function(p, i) {
            stage.removeChild(points_all[i]);
        });

        points_all = [];

        let input = data.filter(function(d){  return oblast.includes(d.oblast)  });

        draw_all_points(input,  scale_array, tip_array);

        lines_all.forEach(function(p, i) {
            stage.removeChild(lines_all[i])
        })
    }


    animate();

    function animate() {
        renderer.render(stage);
        requestAnimationFrame( animate );
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

            //костиль для світло-зеленої зони,  яка шлючить
            if(hslColor._rgb[0] === 255 && hslColor._rgb[1] === 255 && hslColor._rgb[2] === 255){
                hslColor._rgb[0] = 202;
                hslColor._rgb[1] = 230;
                hslColor._rgb[2] = 193;
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
            d3.selectAll(".test_big").style("display", "block");
            draw_all_points(data, [], []);
            show_smooth();
        }

        if(r.index === 8 && r.direction === "up") {
            d3.selectAll(".test_big").style("display", "block");
        }


        if(r.index === 9) {
            change_data("2012");
            show_unsmooth()
        }

        if(r.index === 10) {
            points_all.forEach(function(p, i) {
                points_all[i].alpha = 1;
            });

        }

        if(r.index === 11) {
            change_data("2012");
            filter_data("Закарпатська область", scale_points, scale_points)
        }


        if(r.index === 12) {
            // drawLines(["Закарпатська область"], ["2012", "2014", "2019"]);
            change_data("2019");
        }


        if(r.index === 13) {
            change_data("2012");
            filter_data("Чернівецька область", scale_points, scale_points)
        }

        if(r.index === 14) {

        }

        if(r.index === 15) {
            filter_data("Чернівецька область", chernivetska, ["Кельменецький район", "Сокирянський район"])
        }
        
        if(r.index === 16) {
            filter_data("Тернопільська область", scale_points, ["Шумський район", "Лановецький район", "Збаразький район"])
        }

        if(r.index === 17) {
            filter_data("Сумська область", scale_points, scale_points)
        }

        if(r.index === 18) {
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
        let year = d3.select(this).attr("id").replace("show_", "");
        change_data(year);
    })


});
