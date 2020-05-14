
Promise.all([
    d3.json("data/ukr_shape.geojson"),
       d3.csv("data/split_longitude.csv")
]).then(function(data) {
    const grid = [22.16, 34.15258, 35.35102, 32.95415, 37.74790, 36.54946, 29.35883, 28.16039, 30.55727, 24.56507, 25.76351, 26.96195, 38.94634, 31.75571, 40.14478, 23.36663].sort(function(a,b) { return a - b  });

    const margin = { top: 0, right: 0, bottom: 0, left: 0},
        width = 500 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    var projection = d3.geoMercator()
        .scale(1350)
        .center([40, 46]);

    var path = d3.geoPath()
        .projection(projection);


    const split_map = d3.select("#split-map")
        .append('svg')
        .attr("id", "split-map")
        .attr("viewBox", "0 0 500 350")
        .attr("width", "100%")
        .append("g");

    split_map.selectAll("path")
        .data(data[0].features)
        .enter()
        .append("path")
        .attr("class", "tip")
        .attr("d", path)
        .attr("stroke", "grey")
        .attr("stroke-width", "1px")
        .attr("fill", "lightgrey")
    ;

    grid.forEach(function(value, i){
        split_map.append("line")
            .attr("x1", projection([value])[0])
            .attr("y1", 0)
            .attr("x2", projection([value])[0])
            .attr("y2", height)
            .style("stroke", "grey")
            .style("stroke-dasharray", ("3, 5"));
    });

    data[1].forEach(function(d){
        d.voices_per_group = +d.voices_per_group;
        d.group = +d.group;
    });

    const max_voices = d3.max(data[1], function(d){ return d.voices_per_group });

    const wrapper_width = 420;
    const wrapper_height = 300;
    // const wrapper_width = d3.select('#split-longitude').node().getBoundingClientRect().width;

    const ideology_groups = ["ua", "ru", "undefined"];

    var myColor = d3.scaleOrdinal()
        .domain(ideology_groups)
        .range(["#4b97fb", "#f1483e", "green"]);

    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data[1], function (d) { return d.group })])
        .range([0, wrapper_width]);

    const yScale = d3.scaleLinear()
        .domain([0, max_voices])
        .range([wrapper_height, 0]);

    var line = d3.area()
        .x(function(d, i) { return xScale(d.group - 0.5); })
        // .y(function(d) { return yScale(d.voices_per_group); })
        .y0(function(d) { return yScale(d.voices_per_group); })
        .y1( wrapper_height )
        ;


    const multiple = d3.select("#split-longitude")
        .append("svg")
        .attr("viewBox", "0 0 " + (wrapper_width + 60) + " 350")
        .attr("width", "100%")
        .attr("class", "multiple")
        .attr("height", wrapper_height + 50)
        .append("g")
        // .attr("data", function(d) { return d.key })
        .attr("transform", "translate(" + 50 + "," + 0 + ")");

    multiple.append("g")
        .attr("class", "x axis")
        .style("stroke-dasharray", ("3, 5"))
        .attr("transform", "translate(0," + wrapper_height + ")");

    multiple.append("g")
        .attr("class", "y axis");



    function drawAll(){

        var nested = d3.nest()
            .key(function(d){ return d.Year; })
            .key(function(d){ return d['ru.ua']; })
            .entries(data[1]);


        const multiple = d3.select("#split-longitude")
            .selectAll("svg.multiple")
            .data(nested)
            .enter()
            .append("svg")
            .attr("viewBox", "0 0 " + (wrapper_width + 60) + " 350")
            .attr("width", "100%")
            // .attr("width", wrapper_width + 60)
            .attr("height", wrapper_height + 50)
            .attr("class", "multiple")
            .append("g")
            .attr("transform", "translate(" + 50 + "," + 0 + ")");



        multiple.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + wrapper_height + ")");

        multiple.append("g")
            .attr("class", "y axis");

        multiple.selectAll(".x.axis")
                .style("stroke-dasharray", ("3, 5"))
                .call(d3.axisBottom().scale(xScale)
                    .ticks(15)
                    .tickSize(- (wrapper_height)));

        multiple.selectAll(".y.axis")
                .call(d3.axisLeft()
                .scale(yScale)
                .tickFormat(d3.format('.2s')));


        var glines = multiple.selectAll(".line-group")
                .data(function(d){ return d.values })
                .enter()
                .append('g')
                .attr('class', 'line-group')
                .on("mouseover", function() {
                    d3.select(this).moveToFront();
                });


        const lines = glines
                .append('path')
                .attr('class', 'line-interactive')
                .attr("fill-opacity", 0.7)
                .attr("stroke-width", "2px")
                .attr('d', function (d) {
                    return line(d.values.sort(function (a, b) {
                        return a.group - b.group
                    }))
                })
                .attr("fill", function (d) {
                    return myColor(d.key)
                })
                .attr("stroke", function (d) {
                    return myColor(d.key)
                });

        multiple.append("text")
            .text(function(d) { return d.key  })
            .attr("transform", "translate(0," + 20 + ")")
            .attr("x", wrapper_width/2)
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", "25px")
            .style("fill", "grey");



    }

    // drawAll();


    function update(df) {

        var nested = d3.nest()
            .key(function (d) {
                return d['ru.ua'];
            })
            .entries(df);

        nested.sort( function(a, b) { return  ideology_groups.indexOf(a.key) - ideology_groups.indexOf(b.key)});


        // Create the X axis:
        xScale.domain([0, d3.max(df, function (d) { return d.group })]);

        multiple.selectAll(".x.axis")
            .transition()
            .duration(750)
            .call(d3.axisBottom().scale(xScale)
                .ticks(15)
                .tickSize(- (wrapper_height)));

        // create the Y axis
        yScale.domain([0, max_voices]);

        multiple.selectAll(".y.axis")
            .transition()
            .duration(750)
            .call(d3.axisLeft()
                .scale(yScale)
                .tickFormat(d3.format('.2s')));

        //
        // var glines = multiple.selectAll('.line-group')
        //     .data(nested)
        //     .enter()
        //     .append('g')
        //     .attr('class', 'line-group');

        /* countries lines */
        const lines = multiple.selectAll(".line-interactive")
            .data(nested);


        lines
            .enter()
            .append('path')
            .attr('class', 'line-interactive')
            .attr("fill-opacity", 0.7)
            .attr("stroke-width", "2px")
            .on("mouseover", function(){
                var sel = d3.select(this);
                sel.moveToFront();
            })
            .transition()
            .duration(750)
            .attr('d', function (d) {
                return line(d.values.sort(function (a, b) {
                    return a.group - b.group
                }))
            })
            .attr("fill", function (d) {
                return myColor(d.key)
            })
            // .attr("fill", "none")
            .attr("stroke", function (d) {
                return myColor(d.key)
            })
            ;


        lines
            .transition()
            .duration(750)
            .attr('d', function (d) {
                return line(d.values.sort(function (a, b) {
                    return a.group - b.group
                }))
            })
            // .attr("fill", "none")
            .attr("stroke", function (d) {
                return myColor(d.key)
            })
            .attr("fill", function (d) {
                return myColor(d.key)
            })
        ;

        lines
            .exit()
            .remove()

    }

    update(data[1].filter(function(d){ return d.Year === "2006"}));

    d3.selectAll('.update').on("click", function(){
        let id = this.id;
        update(data[1].filter(function(d){ return d.Year === id}));
    })
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