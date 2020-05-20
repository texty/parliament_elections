/**
 * Created by yevheniia on 19.05.20.
 */
/**
 * Created by yevheniia on 18.05.20.
 */
/**
 * Created by yevheniia on 18.05.20.
 */


Promise.all([
    d3.csv("data/dataset_2020_long.csv")
    // d3.csv("data/split_longitude.csv")
]).then(function(data) {

    const margin = { top: 50, right: 20, bottom: 50, left: 20},
        width = 300 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const ideology_groups = ["ua", "ru", "undefined"];

    var myColor = d3.scaleOrdinal()
        .domain(ideology_groups)
        .range(["#4b97fb", "#f1483e", "#00A56C"]);

    var xScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([width, 0]);


    data[0].forEach(function(d){
        d.dem = +d.dem;
        d.prorus = +d.prorus;
        d.dem = (d.dem).toFixed(3);
        d.prorus = (d.prorus).toFixed(3);
        d.dem = +d.dem;
        d.prorus = +d.prorus;
    });


    var line = d3.line()
        .x(function(d, i) { return xScale(d.dem); })
        .y(function(d) { return yScale(d.prorus); });


    var wrapper = d3.select("#scatter-plot");

    var nested = d3.nest()
        .key(function (d) {
            return d.oblast;
        })
        .key(function (d) {
            return d.rayon;
        })
        .entries( data[0]);


    const multiple = wrapper
        .selectAll(".multiple")
        .data(nested)
        .enter()
        .append("svg")
        .attr("viewBox", "0 0 " + 300 + " 350")
        .attr("width", "300")
        .attr("class", "multiple")
        .attr("height", "350")
        .append("g")
        .attr("transform", "translate(" + 20 + "," + 50 + ")");


    // build the arrow.
    multiple.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "-5 -5 10 10")
        // .attr("refX", 1.5)
        // .attr("refY", -1.5)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M 0,0 m -5,-5 L 5,0 L -5,5 Z")
        .attr("fill", "#555555");


    multiple.append("g")
        .attr("class", "x axis")
        .style("stroke-dasharray", ("3, 5"))
        .attr("transform", "translate(0," + width + ")");

    multiple.append("g")
        .attr("class", "y axis")
        .style("stroke-dasharray", ("3, 5"));

    multiple.selectAll(".x.axis")
        .call(d3.axisBottom()
            .scale(xScale)
            .ticks(5)
            .tickSize(-width)
        );

    multiple.selectAll(".y.axis")
        .call(d3.axisLeft()
            .scale(yScale)
            .ticks(5)
            .tickSize(-width)
        );

    multiple.append("text")
        .text(function (d) {
            return d.key.replace("область", "")
        })
        .attr("transform", "translate(0," + -10 + ")")
        .attr("x", 250 / 2)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "20px")
        .style("fill", "grey");



    var updateScatter = function(target_years) {

        var group = multiple
            .selectAll(".scatter-line")
            .data(function (d) {
                return d.values
            });


        group
            .enter()
            .append("path")
            .attr("class", "scatter-line tip")
            .attr("stroke", "grey")
            .attr("fill", "none")
            .attr("opacity", "0.5")
            .attr("stroke-width", "1px")
            .attr("marker-end", "url(#end)")
            .transition()
            .duration(1000)
            .attr("d", function (k) {
                var sample = k.values.sort(function (a, b) {  return a.year - b.year  });

                sample = sample.filter(function(p) {
                    return target_years.includes(p["year"]) });

                return line(sample);
            })

            .attr("data-tippy-content", function (d) {
                return d.rayon
            });


        group
            .transition()
            .duration(1000)
            .attr("d", function (k) {
                var sample = k.values.sort(function (a, b) {  return a.year - b.year  });
                sample = sample.filter(function(p) {
                    return target_years.includes(p["year"]) });

                return line(sample);
            })
            ;


        group
            .exit()
            .transition()
            .duration(1000)
            .remove();

    };


    updateScatter(["2006","2007"]);

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
