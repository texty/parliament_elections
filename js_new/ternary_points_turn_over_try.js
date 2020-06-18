/* base code is taken from
 - Tom Pearson's Ternary plot example:  http://bl.ocks.org/tomgp/7674234
 - Tom Shanley’s Ternary color grid https://bl.ocks.org/tomshanley/db1ac0efe50844239f20aa3762dd1729
 */

/** актуальний файл для ternary-plots */

const green = '#009601';
const red = '#FF2121';
const blue = '#0887FF';

d3.csv("data/ternary_data.csv").then(function(data) {

    const years_arr = ["2006", "2007", "2012", "2014", "2019"];

    const sort_keys = [
        

        "Львівська область",
        "Івано-Франківська область",
        "Тернопільська область",


        "Закарпатська область",
        "Сумська область",
        "Чернівецька область",
        "Чернігівська область",
        "Полтавська область",
        "Житомирська область",
        "Волинська область",
        "Рівненська область",
        "Вінницька область",
        "Хмельницька область",
        "Київська область, Київ",
        "Черкаська область",
        "Кіровоградська область",
        "Херсонська область",
        "Дніпропетровська область",
        "Миколаївська область",
        "Запорізька область",

        "Одеська область",
        "Харківська область",
        "Донецька область",
        "Луганська область",
        "АР Крим, Севастополь"
    ];


    data.forEach(function (d) {
        d.ua = +d.ua * 100;
        d.ru = +d.ru * 100;
        d.pop = +d.pop * 100;
    });

    const nested = d3.nest()
        .key(function (d) {
            return d.oblast;
        })
        .entries(data)
        .sort( function(a, b) {
            return sort_keys.indexOf(a.key) - sort_keys.indexOf(b.key)
        });

    function ternaryPlot(selector, userOpt) {
        var plot = {
            dataset: []
        };

        var opt = {
            width: 350,
            height: 380,
            side: 250,
            margin: 30,
            axis_labels: ['A', 'B', 'C'],
            axis_ticks: [0, 20, 40, 60, 80, 100],
            tickLabelMargin: 10,
            axisLabelMargin: 40
        };

        for (var o in userOpt) {
            opt[o] = userOpt[o];
        }


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


        var wrapper = d3.select(selector)
            .selectAll("svg")
            .data(nested)
            .enter()
            .append('svg')
            .attr("width", opt.width)
            .attr("height", opt.height);

        //triangle
        var chartBackground = wrapper.append("g")
            .attr("id", "grid")
            .attr("transform", "translate(0,100)");

        //points
        var svg = wrapper
            .append("g")
            .attr("data", function(d){ return d.key })
            .attr("transform", "translate(0,100)");

        //facet labels
        svg.append("text")
            .text(function (d) {
                return d.key.replace("область", "обл.")
            })
            .attr("transform", "translate(0," + -20 + ")")
            .attr("x", opt.width / 2)
            .attr("text-anchor", "middle")
            .style("font-weight", "600")
            .style("font-size", "20px")
            .style("fill", "grey");


        // //axis name
        // svg.append("g")
        //     .attr("font-size", 16)
        //     .selectAll(".labels")
        //     .data([
        //         { label: "проросійські", pos: [290, 170], rot: -60, color: red },
        //         { label: "популісти", pos: [65, 170], rot: 60, color: green },
        //         { label: "проукраїнські", pos: [170, 10], rot: 0, color: blue }
        //     ])
        //     .enter().append("text")
        //     .attr("transform", function(d){ return `translate(${d.pos[0]}, ${d.pos[1]}) rotate(${d.rot})`})
        //     .attr("text-anchor", "middle")
        //     .text(function(d){ return d.label})
        //     .style("fill", function(d) {
        //         return d.color
        //     });


        //ticks
        var axes = svg.append('g').attr('class', 'axes');
        opt.axis_ticks.forEach(function (v) {
            var coord4 = coord([v, 20, 100 - v]);
            var coord1 = coord([v, 100 - v, -8]);
            var coord2= coord([0, 100 - v, v]);
            var coord3 = coord([100 - v, 0, v]);


            axes.append('g')
                .attr('transform', function (d) {
                    return 'translate(' + coord1.x + ',' + coord1.y + ')'
                })
                .append("text")
                // .attr('transform', 'rotate(60)')
                .attr('text-anchor', 'end')
                .attr('x', 0)
                .text(function (d) {
                    return v;
                })
                .classed('a-axis tick-text', true);

            axes.append('g')
                .attr('transform', function (d) {
                    return 'translate(' + coord2.x + ',' + coord2.y + ')'
                })
                .append("text")
                .attr('transform', 'rotate(0)')
                .attr('text-anchor', 'start')
                .attr('x', opt.tickLabelMargin)
                .text(function (d) {
                    return (100 - v);
                })
                .classed('b-axis tick-text', true);

            axes.append('g')
                .attr('transform', function (d) {
                    return 'translate(' + coord3.x + ',' + coord3.y + ')'
                })
                .append("text")
                .attr('text-anchor', 'end')
                .text(function (d) {
                    return v;
                })
                .attr('x', -opt.tickLabelMargin)
                .classed('c-axis tick-text', true);

        });


        //функція, що переводить три значення у X та Y координати на трикутнику
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

        //функція відмальовки ліній
        const line = d3.line()
            .x(function(d, i) { return coord([d.ua, d.ru, d.pop]).x; })
            .y(function(d) { return coord([d.ua, d.ru, d.pop]).y; });


        //////////////////////////////////////////////
        // Add Lines
        plot.data_l = function (target_years, bindBy) {

            svg.each(function(){
                let obl = d3.select(this).attr("data");
                var base_data = nested.filter(function(d){ return d.key === obl });

                var lines_data = d3.nest()
                    .key(function (d) {
                        return d.rayon;
                    })
                    .entries(base_data[0].values);

                plot.dataset = lines_data;

                var lines = d3.select(this).selectAll("path")
                    .data(lines_data.map(function (d) {
                        return {"key": d.key,  "values": d.values};
                    }), function (d, i) {
                        return bindBy && plot.dataset[i] ? plot.dataset[i][bindBy] : i;
                    });

                lines
                    .enter()
                    .append("path")
                    .attr('class', "trail-line")
                    .transition().duration(1000)
                    .attr("d", function (d) {
                        var sample = d.values
                            .sort(function (a, b) {  return a.year - b.year  })
                            .filter(function(p) { return target_years.includes(p["year"]) });

                        return line(sample);
                    })
                    // .attr("data-tippy-content", function (d) {  return d.key  })
                ;

                lines
                    .transition().duration(1000)
                    .attr('class', "trail-line")
                    .attr("d", function (d) {
                        var sample = d.values
                            .sort(function (a, b) {  return a.year - b.year  })
                            .filter(function(p) { return target_years.includes(p["year"]) });

                        return line(sample);
                    });
                    // .attr("data-tippy-content", function (d) { return d.key });

                lines
                    .exit().remove();

                return this;

            });


            tippy('.tip', {
                arrow: false,
                arrowType: 'round',
                allowHTML: true,
                onShow(tip) {
                    tip.setContent(tip.reference.getAttribute('data-tippy-content'))
                }
            });
        };



        //////////////////////////////////////////////
        // Add Points
        plot.data_p = function (year, bindBy) {

            var circles;
            svg.each(function(){
                let obl = d3.select(this).attr("data");

                var points_data = nested
                    .filter(function(d){ return d.key === obl })[0].values
                    .filter(function(d){ return d.year === year});

                plot.dataset = points_data;

                circles = d3.select(this).selectAll("circle")
                    .data(points_data.map(function (d) {
                        return {"coord": coord([d.ua, d.ru, d.pop]), "rayon": d.rayon, "ua": d.ua, "ru": d.ru, "pop": d.pop };
                    }), function (d, i) {
                        return bindBy && plot.dataset[i] ? plot.dataset[i][bindBy] : i;
                    });

                circles
                    .enter()
                    .append("circle")
                    .attr('class', "circle-tip")
                    .transition().duration(1000)
                    .attr("cx", function (d) { return d.coord.x; })
                    .attr("cy", function (d) { return d.coord.y; })
                    .attr("r", 5)
                    .style("fill", function(d) { return ternaryFill(d.coord.x, d.coord.y) })
                    .attr("data-tippy-content", function (d) {  return d.rayon });

                circles
                    .transition().duration(1000)
                    .attr('class', "circle-tip")
                    .attr("cx", function (d) { return d.coord.x; })
                    .attr("cy", function (d) { return d.coord.y; })
                    .style("fill", function(d) { return ternaryFill(d.coord.x, d.coord.y) })
                    .attr("data-tippy-content", function (d) {  return d.rayon });

                circles
                    .exit().remove();

                return this;

            });

            //функція пошуку по точках
            $("#filter").keyup(function () {
                var value = $(this).val();
                if (value) {
                    var i = 0; var re = new RegExp(value, "i");


                    var points = d3.selectAll(".circle-tip");
                    points.each(function(circle){
                        console.log(circle.rayon);
                        if (!circle.rayon.match(re)) {
                            d3.select(this).style("visibility", "hidden");
                        } else {
                            d3.select(this).style("visibility", "visible");
                        }
                        i++
                    });
                } else {
                    circles.style("visibility", "visible");
                }
            }).keyup();


            tippy('.circle-tip', {
                arrow: false,
                arrowType: 'round',
                allowHTML: true,
                onShow(tip) {
                    tip.setContent(tip.reference.getAttribute('data-tippy-content'))
                }
            });
        };


        //////////////////////////////////////////////
        // Draw triangle color background
        var rows = 3 ; // *
        var rotateHSL = 180; //*

        var classGrid = "triangle-grid"; //*
        var maxDistanceToCentre = Math.ceil(2 * (h / 3)); //*

        var centre = {
            "x": (w / 2) + opt.margin,
            "y": opt.margin/2 + maxDistanceToCentre
        };

        let colourArr = [green, red, blue]; // *

        let colourScale = chroma.scale() // *
            .mode('lab')
            .domain([0, 120, 240, 360])
            .range([colourArr[0], colourArr[1], colourArr[2], colourArr[0]]);

        var triangles = createTriangleGrid(rows, w, h);

        drawGrid(chartBackground, triangles, classGrid);

        function drawGrid(sel, gridData, attrClass) {
            sel.selectAll("path")
                .data(gridData)
                .enter()
                .append("path")
                .attr("class", attrClass)
                .attr("d", function(d) {
                    return trianglePath(d.corners)
                })
                .style("fill", function(d) {
                    return d.color
                })
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

            return hslColor
        }


        plot.getPosition = coord;

        return plot;
    }




//ACTIVATE!
    var plot_opts = {
        side: 250,
        margin: 50,
        // axis_labels: ['націонал-демократичні', 'проросійські', 'популістичні'],
        axis_ticks: d3.range(0, 101, 20),
        minor_axis_ticks: d3.range(0, 101, 5)
    };

    var tp = ternaryPlot('#scatter-plot', plot_opts);

    function next_P(year) {
        tp.data_p(year, 'rayon');
    }

    function next_L(target_years) {
        tp.data_l(target_years, 'key');
    }

    next_L(["2006"]);
    next_P("2019");


    // d3.select("#update-scatter").on("click", function(d){
    //     var seleted_years = [];
    //     $("#select-years input:checkbox:checked").map(function(){
    //         seleted_years.push($(this).val());
    //     });
    //     next_L(seleted_years);
    //     d3.event.preventDefault();
    // });

    d3.selectAll('.update').on('click', function (e) {
        var seleted_years = [];
        let the_year = d3.select(this).attr("id").replace("update_", "");

        let index = years_arr.indexOf(the_year);
        seleted_years.push(years_arr[index]);
        if(the_year !="2006") {
            seleted_years.push(years_arr[index-1]);
        }

        next_P(the_year);
        next_L(seleted_years);
        d3.event.preventDefault();
    });






    // d3.selectAll('.update').on('click', function (e) {
    //     let the_year = d3.select(this).attr("id").replace("update_", "");
    //     // next_L(target_years);
    //     next_P(the_year);
    //
    // });

});
