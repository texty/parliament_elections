/**
 * Created by yevheniia on 18.05.20.
 */


Promise.all([
    d3.csv("data/dataset_2020_long.csv")
    // d3.csv("data/split_longitude.csv")
]).then(function(data) {

    const cities = ["місто Вінниця", "місто Луцьк", "місто Дніпро", "місто Донецьк", "місто Ужгород", "місто Запоріжжя", "місто Івано-Франківськ", "місто Житомир", "місто Київ", "місто Кропивницький", "місто Луганськ", "місто Львів", "місто Миколаїв", "місто Одеса", "місто Полтава", "місто Рівне", "місто Суми", "місто Тернопіль", "місто Харків", "місто Хмельницький", "місто Херсон", "місто Черкаси", "місто Чернівці", "місто Чернігів", "місто Севастополь"];

    const margin = { top: 50, right: 20, bottom: 50, left: 50},
        width = 300 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const ideology_groups = ["ua", "ru", "undefined"];



    const myColor = d3.scaleOrdinal()
        .domain(ideology_groups)
        .range(["#4b97fb", "#f1483e", "#00A56C"]);

    const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([width, 0]);


    data[0].forEach(function(d){
        d.dem = +d.dem * 100;
        d.prorus = +d.prorus * 100;
        d.dem = (d.dem).toFixed(3);
        d.prorus = (d.prorus).toFixed(3);
        d.dem = +d.dem;
        d.prorus = +d.prorus;
    });


    const line = d3.line()
        .x(function(d, i) { return xScale(d.dem); })
        .y(function(d) { return yScale(d.prorus); });




    const nested_grey = d3.nest()
        .key(function (d) {
            return d.oblast;
        })
        .key(function (d) {
            return d.rayon;
        })
        .entries(data[0]);


    console.log(nested_grey);

    const wrapper = d3.select("#scatter-plot")
        .selectAll(".multiple")
        .data(nested_grey)
        .enter()
        .append("svg")
        .attr("viewBox", "0 0 " + 300 + " 350")
        .attr("width", "300")
        .attr("class", "multiple")
        .attr("height", "350");

    const multiple = wrapper
        .append("g")
        .attr("transform", "translate(" + 50 + "," + 50 + ")");

    multiple.append("g")
        .attr("class", "x axis")
        .style("stroke-dasharray", ("3, 5"))
        .attr("transform", "translate(0," + width + ")");

    multiple.append("g")
        .attr("class", "y axis")
        .style("stroke-dasharray", ("3, 5"));

    const xAxis = multiple.selectAll(".x.axis")
        .call(d3.axisBottom()
            .scale(xScale)
            .ticks(5)
            .tickSize(-width)
        );

    const yAxis = multiple.selectAll(".y.axis")
        .call(d3.axisLeft()
            .scale(yScale)
            .ticks(5)
            .tickSize(-width)
        );


    const defs = multiple.append("svg:defs");

    defs.append("svg:marker")
        .attr("id", "ff0000")
        .attr("viewBox", "0 -5 10 10")
        .attr("markerWidth", 9)
        .attr("markerHeight", 9)
        .attr("orient", "auto")
        .attr("markerUnits", "userSpaceOnUse")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5")
        .style("fill", "#ff0000");

    defs.append("svg:marker")
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




    multiple.append("text")
        .text(function (d) {
            return d.key.replace("область", "")
        })
        .attr("transform", "translate(0," + -10 + ")")
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .style("font-weight", "600")
        .style("font-size", "20px")
        .style("fill", "grey");

    // text label for the x axis
    multiple.append("text")
        .attr("transform",
            "translate(" + 0 + " ," + (height-35) + ")")
        .attr("x", width)
        .style("text-anchor", "end")
        .style("fill", "grey")
        .style("font-size", "13px")
        .text("націонал-демократичні, %");


    // text label for the y axis
    multiple.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 30)
        .attr("x", 0)
        // .attr("dy", "1em")
        .style("fill", "grey")
        .style("font-size", "13px")
        .style("text-anchor", "end")
        .text("комуністичні та проросійські, %");



    var updateScatter = function(target_years) {

        const arc = d3.symbol().size(30).type(d3.symbolTriangle);

        const markers = multiple
            .selectAll(".circle")
            .data(function (d) { return d.values });

        if(target_years.length === 1) {
            markers
                .enter()
                .append("path")
                .attr("class", "circle tip")
                .attr('d', arc)
                .attr("fill", function(d) { return cities.includes(d.key) ? "#ff0000": "#808080";})
                .attr("opacity", "0")
                .transition()
                .duration(0)
                .attr("transform", function (k) {
                    var last_year = target_years.sort(function (a, b) {  return a - b  });
                    var point = k.values.filter(function (p) { return last_year.includes(p["year"])  });
                    return point.length > 0 ? "translate(" + xScale(point[0].dem) + "," + yScale(point[0].prorus) + ")" :  "translate(" + xScale(-5) + "," + yScale(-5) + ")";
                })
                .attr("opacity", "0.8")
                .attr("data-tippy-content", function (d) {
                    return d.key
                });


            markers
                .transition()
                .duration(750)
                .attr("transform", function (k) {
                    var last_year = target_years.sort(function (a, b) {  return a - b  });
                    var point = k.values.filter(function (p) { return last_year.includes(p["year"]) });
                    return point.length > 0 ? "translate(" + xScale(point[0].dem) + "," + yScale(point[0].prorus) + ")" :  "translate(" + xScale(-5) + "," + yScale(-5) + ")";
                })
                .attr("fill", function(d) { return cities.includes(d.key) ? "#ff0000": "#808080";})
                .attr("data-tippy-content", function (d) {
                    return d.key
                });


            markers
                .exit()
                .remove();
        } else {
            markers
                .remove();
        }


        var group = multiple
            .selectAll(".scatter-line")
            .data(function (d) {
                return d.values
            });

        group
            .enter()
            .append("path")
            .attr("class", "scatter-line")
            .attr("key", function(d){ return d.key })
            .attr("fill", "none")
            .attr("opacity", "0.5")
            .transition()
            .duration(750)
            .attr("d", function (k) {
                var sample = k.values.sort(function (a, b) {  return a.year - b.year  });
                sample = sample.filter(function(p) {
                    return target_years.includes(p["year"]) });
                return line(sample);
            })
            .attr("stroke", function(d){ return cities.includes(d.key)? "#ff0000": "#808080"})
            .attr("stroke-width", function(d){ return cities.includes(d.key)? "3px": "1px"})
            .attr("marker-end", function(d) {
                 let current_color = cities.includes(d.key) ? "#ff0000": "#808080";
                 return target_years.length > 1 ? "url(" + current_color + ")" : ""
            })
            .attr("data-tippy-content", function (d) {
                return d.key
            });


        group
            .transition()
            .duration(750)
            .attr("d", function (k) {
                var sample = k.values.sort(function (a, b) {  return a.year - b.year  });
                sample = sample.filter(function(p) {
                    return target_years.includes(p["year"]) });
                return line(sample);
            })
            .attr("stroke", function(d){ return cities.includes(d.key)? "#ff0000": "#808080"})
            .attr("stroke-width", function(d){ return cities.includes(d.key)? "3px": "1px"})
            .attr("marker-end", function(d) {
                let current_color = cities.includes(d.key)? "#ff0000": "#808080";
                return target_years.length > 1 ? "url(" + current_color + ")" : ""
            })
            .attr("data-tippy-content", function (d) {
                return d.key
            });


        group
            .exit()
            .transition()
            .duration(750)
            .remove();



        tippy('.scatter-line, .tip', {
            arrow: false,
            arrowType: 'round',
            allowHTML: true,
            onShow(tip) {
                tip.setContent(tip.reference.getAttribute('data-tippy-content'))
            }
        });



        //функція пошуку по точках
        $("#filter").keyup(function () {
            var value = $(this).val();
            if (value) {
                var i = 0; var re = new RegExp(value, "i");

                var lines = d3.selectAll(".scatter-line");
                lines.each(function(line){
                    if (!line.key.match(re)) {
                        d3.select(this).style("visibility", "hidden");
                    } else {                        
                        d3.select(this).style("visibility", "visible");
                    }
                    i++

                });
            } else {
                group.style("visibility", "visible");
            }
        }).keyup();


    };


    updateScatter(["2006", "2014", "2019"]);

    // var target_years = [2012, 2019];

    d3.select("#update-scatter").on("click", function(d){
        var seleted_years = [];
        $("#select-years input:checkbox:checked").map(function(){
            seleted_years.push($(this).val());
        });
        updateScatter(seleted_years);
    });



});

d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};

d3.selection.prototype.moveBehind = function(element) {
    return this.each(function() {
        this.parentNode.insertBefore(this, element);
    });
};
