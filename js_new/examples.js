/**
 * Created by yevheniia on 22.05.20.
 */
d3.csv("data/dataset_2020_long.csv").then(function(input) {

    const arc = d3.symbol().size(30).type(d3.symbolTriangle);
    
    const margin = { top: 50, right: 20, bottom: 35, left: 50},
        width = 300 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([width, 0]);

    var test =
        [
            {
            "key": "2006",
            "values": [
                    { "x": 13, "y": 34, "text": "м.Берегове", "textOffset": [ 13, 34  ] },
                    { "x": 3, "y": 24, "text": "Берегівський", "textOffset": [  3, 24 ] },
                    { "x": 40, "y": 17, "path": "", "text": "Виноградівський", "textOffset": [ 40, 17]}
                ]
            },
            {
                "key": "2007",
                "values": [
                    { "x": 0, "y": 0, "text": "м.Берегове", "textOffset": [ 13, 34  ] },
                    { "x": 0, "y": 0, "text": "Берегівський", "textOffset": [  3, 24 ] },
                    { "x": 0, "y": 0, "path": "", "text": "Виноградівський", "textOffset": [ 40, 17]}
                ]
            },
            {
                "key": "2012",
                "values": [
                    { "x": 0,  "y": 0, "text": "м.Берегове", "textOffset": [ 13, 34 ] },
                    { "x": 0, "y": 0, "text": "Берегівський", "textOffset": [  3, 24 ] },
                    { "x": 0, "y": 0, "path": "", "text": "Виноградівський", "textOffset": [40, 17 ]}
                ]
            },
            {
                "key": "2014",
                "values": [
                    { "x": 0,  "y": 0, "text": "м.Берегове", "textOffset": [ 13, 34 ] },
                    { "x": 0, "y": 0, "text": "Берегівський", "textOffset": [  3, 24 ] },
                    { "x": 0, "y": 0, "path": "", "text": "Виноградівський", "textOffset": [40, 17 ]}
                ]
            },
            {
                "key": "2019",
                "values": [
                    { "x": 0,  "y": 0, "text": "м.Берегове", "textOffset": [ 13, 34 ] },
                    { "x": 0, "y": 0, "text": "Берегівський", "textOffset": [  3, 24 ] },
                    { "x": 0, "y": 0, "path": "", "text": "Виноградівський", "textOffset": [40, 17 ]}
                ]
            }
        ];



    const data = input.filter(function(d){ return d.oblast === "Закарпатська область"});

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
            return d.year;
        })
        .entries(data);


    const svg = d3.select("#example-1")
        .selectAll(".multiple")
        .data(nested)
        .enter()
        .append("svg")
        .attr("viewBox", "0 0 " + 300 + " 350")
        .attr("width", "300")
        .attr("class", "multiple")
        .attr("height", "350")
        .attr("key", function(d){ return d.key })
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
            "translate(" + 0 + " ," + (height-50) + ")")
        .attr("x", width)
        .style("text-anchor", "end")
        .style("fill", "grey")
        .style("font-size", "14px")
        .text("націонал-демократичні, %");


    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 30)
        .attr("x", 0)
        // .attr("dy", "1em")
        .style("fill", "grey")
        .style("font-size", "14px")
        .style("text-anchor", "end")
        .text("комуністичні та проросійські, %");


    const Zakarpatska = ["місто Берегове", "Берегівський район", "Виноградівський район"];


    const markers = svg
            .selectAll(".circle")
            .data(function (d) { return d.values });


    markers
            .enter()
            .append("path")
            .attr("class", "circle tip")
            .attr('d', arc)
            .attr("fill", function(d){ return Zakarpatska.includes(d.rayon) ? "red" : "grey"; })
            .attr("transform", function (k) {
                return "translate(" + xScale(k.dem) + "," + yScale(k.prorus) + ")";
            })
            .attr("opacity", "1")
            .attr("data-tippy-content", function (d) {
                return d.rayon
            });

    svg.each(function(d){
            let wrapper = this;
            let current_year = d3.select(this.parentNode).attr("key");
            let labels = test.filter(function(d){
                return d.key === current_year
            });

            labels[0].values.forEach(function(d) {
                console.log(d);
                d3.select(wrapper)
                    .append("text")
                    .attr("class", "label")
                    .text(function(k) {
                        return d.text
                    })
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("transform", function(k) {
                        console.log(k);
                        return "translate(" + xScale(d.textOffset[0]) + "," + yScale(d.textOffset[1]) + ")"
                    })
                    .style("font-size", "12px")
                    .style("fill", "red")
            });
        });

        tippy('.scatter-line, .tip', {
            arrow: false,
            arrowType: 'round',
            allowHTML: true,
            onShow(tip) {
                tip.setContent(tip.reference.getAttribute('data-tippy-content'))
            }
        });


});
