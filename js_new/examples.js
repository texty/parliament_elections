/**
 * Created by yevheniia on 22.05.20.
 */
d3.csv("data/dataset_2020_long.csv").then(function(input) {

   const arc = d3.symbol().size(40).type(d3.symbolTriangle);
    
    const margin = { top: 50, right: 20, bottom: 35, left: 50},
        width = 300 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .range([width, 0]);

    const zakarpatska_red = ["місто Берегове", "Берегівський район", "Виноградівський район"];
    const zakarpatska_labels =  [{
        "key": "2006",
        "values": [
                { "x": 12, "y": 35, "text": "м.Берегове" },
                { "x": 3, "y": 24, "text": "Берегівський" },
                { "x": 60, "y": 25, "path": "", "text": "Виноградівський"}
            ]
        }];

    const chernivetska_red = ["Герцаївський район", "Глибоцький район", "Сторожинецький район", "Новоселицький район"];
    const chernivetska_labels = [{
        "key": "2006",
        "values": [
            { "x": 8, "y": 35, "text": "Новоселицький" },
            { "x": 3, "y": 49, "text": "Герцаївський" },
            { "x": 22, "y": 15, "path": "", "text": "Сторожинецький"},
            { "x": 62, "y": 25, "path": "", "text": "Глибоцький"}
        ]
    }];

    const sumska_red = ["Середино-Будський район", "Великописарівський район"];
    const sumska_labels = [{
        "key": "2006",
        "values": [
            { "x": 22, "y": 70, "text": "Середино-Будський" },
            { "x": 40, "y": 51, "text": "Великописарівський" }

        ]
    }];


    const drawExample = function(container, target_oblast, red_points, labels_array) {

        xScale.domain([0,100]);
        yScale.domain([0,100]);

        const data = input.filter(function (d) {
            return d.oblast === target_oblast
        });

        data.forEach(function (d) {
            d.dem = +d.dem * 100;
            d.prorus = +d.prorus * 100;
            d.dem = (d.dem).toFixed(3);
            d.prorus = (d.prorus).toFixed(3);
            d.dem = +d.dem;
            d.prorus = +d.prorus;
        });

        const nested = d3.nest()
            .key(function (d) {
                return d.year;
            })
            .entries(data);


        const svg = d3.select(container)
            .selectAll(".multiple")
            .data(nested)
            .enter()
            .append("svg")
            .attr("viewBox", "0 0 " + 300 + " 350")
            .attr("width", "300")
            .attr("class", "multiple")
            .attr("height", "350")
            .attr("key", function (d) {
                return d.key
            })
            .append("g")
            .attr("transform", "translate(" + 50 + "," + 50 + ")");

        svg.append("svg:defs").append("svg:marker")
            .attr("id", "808080")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 5)
            .attr("refY", 0)
            .attr("markerWidth", 9)
            .attr("markerHeight", 9)
            .attr("orient", "auto")
            .attr("markerUnits", "userSpaceOnUse")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5")
            .style("fill", "#808080");

        svg.append("svg:defs").append("svg:marker")
            .attr("id", "black")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 5)
            .attr("refY", 0)
            .attr("markerWidth", 9)
            .attr("markerHeight", 9)
            .attr("orient", "auto")
            .attr("markerUnits", "userSpaceOnUse")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5")
            .style("fill", "#black");

        svg.append("g")
            .attr("class", "x axis")
            .style("stroke-dasharray", ("3, 5"))
            .attr("transform", "translate(0," + width + ")");

        svg.append("g")
            .attr("class", "y axis")
            .style("stroke-dasharray", ("3, 5"));

        svg.selectAll(".x.axis")
            .call(d3.axisBottom()
                .scale(xScale)
                .ticks(5)
                .tickSize(-width)
            );

        svg.selectAll(".y.axis")
            .call(d3.axisLeft()
                .scale(yScale)
                .ticks(5)
                .tickSize(-width)
            );

        svg.append("text")
            .text(function (d) {
                return d.key
            })
            .attr("transform", "translate(0," + -10 + ")")
            .attr("x", width / 2)
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", "20px")
            .style("fill", "grey");

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + 0 + " ," + (height - 50) + ")")
            .attr("x", width)
            .style("text-anchor", "end")
            .style("fill", "grey")
            .style("font-size", "13px")
            .text("націонал-демократичні, %");


        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - 30)
            .attr("x", 0)
            // .attr("dy", "1em")
            .style("fill", "grey")
            .style("font-size", "13px")
            .style("text-anchor", "end")
            .text("комуністичні та проросійські, %");


        const markers = svg
            .selectAll(".example_circle")
            .data(function (d) {
                return d.values
            });


        markers
            .enter()
            .append("path")
            .attr("class", "example_circle tip")
            .attr('d', arc)
            .attr("fill", function (d) {
                return red_points.includes(d.rayon) ? "red" : "grey";
            })
            .attr("transform", function (k) {
                return "translate(" + xScale(k.dem) + "," + yScale(k.prorus) + ")";
            })
            .attr("opacity", "0.6")
            .attr("data-tippy-content", function (d) {
                return d.rayon
            })
            .on("mouseover", function(d){
                d3.select(this).style("stroke-width", "2px").style("stroke", "black")
            })
            .on("mouseleave", function(d){
                d3.select(this).style("stroke-width", "0")
            });

        svg.each(function (d) {
            let wrapper = this;
            let current_year = d3.select(this.parentNode).attr("key");
            var key;
            let labels = labels_array.filter(function (d) {
                key = d.key;
                return d.key === current_year
            });

            if (labels[0]) {
                labels[0].values.forEach(function (d) {
                    d3.select(wrapper)
                        .append("text")
                        .attr("class", "label")
                        .text(function (k) {
                             return current_year === "2006" ? d.text : "";

                        })
                        .attr("x", function (k) {
                            return xScale(d.x)
                        })
                        .attr("y", function (k) {
                            return yScale(d.y)
                        })
                        .style("font-size", "12px")
                        .style("fill", "red")
                        .style("pointer-events", "none")

                });
            }
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



    drawTrajectories = function(container, region, xdomain, ydomain, years){

        const volun = ["Рокитнівський район", "Зарічненський район", "місто Ковель", "місто Дубно", "Любешівський район", "Шацький район", "Корецький район", "місто Вараш", "місто Нововолинськ", "місто Луцьк", "місто Володимир-Волинський", "місто Острог", "місто Рівне"];

        xScale.domain(xdomain);
        yScale.domain(ydomain);

        const line = d3.line()
            .x(function(d, i) { return xScale(d.dem); })
            .y(function(d) { return yScale(d.prorus); });

        const data = input.filter(function (d) {
            return d.region === region && !volun.includes(d.rayon)
        });



        data.forEach(function(d){
            d.dem = +d.dem * 100;
            d.prorus = +d.prorus * 100;
            d.dem = (d.dem).toFixed(3);
            d.prorus = (d.prorus).toFixed(3);
            d.dem = +d.dem;
            d.prorus = +d.prorus;
        });



        const nested = d3.nest()
            .key(function (d) {
                return d.oblast;
            })
            .key(function (d) {
                return d.rayon;
            })
            .entries(data);


        const svg = d3.select(container)
            .selectAll(".multiple")
            .data(nested)
            .enter()
            .append("svg")
            .attr("viewBox", "0 0 " + 300 + " 350")
            .attr("width", "300")
            .attr("class", "multiple")
            .attr("height", "350")
            .attr("key", function (d) {
                return d.key
            })
            .append("g")
            .attr("transform", "translate(" + 50 + "," + 50 + ")");

        svg.append("g")
            .attr("class", "x axis")
            .style("stroke-dasharray", ("3, 5"))
            .attr("transform", "translate(0," + width + ")");

        svg.append("g")
            .attr("class", "y axis")
            .style("stroke-dasharray", ("3, 5"));

        svg.selectAll(".x.axis")
            .call(d3.axisBottom()
                .scale(xScale)
                .ticks(5)
                .tickSize(-width)
            );

        svg.selectAll(".y.axis")
            .call(d3.axisLeft()
                .scale(yScale)
                .ticks(5)
                .tickSize(-width)
            );

        svg.append("text")
            .text(function (d) {
                return d.key
            })
            .attr("transform", "translate(0," + -10 + ")")
            .attr("x", width / 2)
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", "20px")
            .style("fill", "grey");

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + 0 + " ," + (height - 50) + ")")
            .attr("x", width)
            .style("text-anchor", "end")
            .style("fill", "grey")
            .style("font-size", "13px")
            .text("націонал-демократичні, %");


        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - 30)
            .attr("x", 0)
            // .attr("dy", "1em")
            .style("fill", "grey")
            .style("font-size", "13px")
            .style("text-anchor", "end")
            .text("комуністичні та проросійські, %");


        var group = svg
            .selectAll(".example4-line")
            .data(function (d) {
                return d.values
            });

        group
            .enter()
            .append("path")
            .attr("class", "example4-line")
            .attr("key", function(d){ return d.key })
            .attr("fill", "none")
            .attr("opacity", "0.5")
            .attr("d", function (k) {
                var sample = k.values.sort(function (a, b) {  return a.year - b.year  }).filter(function() { return k.values.length > 3.});
                sample = sample.filter(function(p) {
                    return years.includes(p["year"]) });
                return line(sample);
            })
            .attr("stroke",  "#808080")
            .attr("stroke-width", "1px")
            .attr("marker-end",  "url(#808080)")
            .attr("data-tippy-content", function (d) {
                return d.key
            })
            .on("mouseover", function(d){
                d3.select(this).attr("marker-end",  "url(#black)").style("stroke-width", "3px").style("stroke", "black")
            })
            .on("mouseleave", function(d){
                d3.select(this).attr("marker-end",  "url(#808080)").style("stroke-width", "1px").style("stroke", "grey")
            });

        tippy('.example4-line', {
            arrow: false,
            arrowType: 'round',
            allowHTML: true,
            onShow(tip) {
                tip.setContent(tip.reference.getAttribute('data-tippy-content'))
            }
        });



    };





    drawExample("#example-1", "Закарпатська область", zakarpatska_red, zakarpatska_labels);
    drawExample("#example-2", "Чернівецька область", chernivetska_red, chernivetska_labels);
    drawExample("#example-3", "Сумська область", sumska_red, sumska_labels);
    drawTrajectories("#example-4", "Волинь", [60,90], [10,40], ["2002", "2006", "2007", "2012"]);
    drawTrajectories("#example-5", "Донбас", [0,25], [50,100], ["2012", "2019"]);



});
