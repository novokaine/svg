var margin = { top: 10, right: 10, bottom: 100, left: 40 },
    margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

//   var parseDate = d3.time.format("%b %Y").parse;
var parseDate = d3.scaleTime().rangeRound([0, width]);

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

//   var xAxis = d3.svg.axis().scale(x).orient("bottom"),
//       xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
//       yAxis = d3.svg.axis().scale(y).orient("left");

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX(x2)
    .on("brush", brushed);



var area = d3.area()
    .curve(d3.curveMonotoneX)
    //   .interpolate("monotone")
    .x(function (d) {
        // debugger;
        return x(new Date(d.date));
    })
    .y0(height)
    .y1(function (d) {
        // debugger;
        return y(d.price);
    });

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    //   .interpolate("monotone")
    .x(function (d) { return x2(new Date(d.date)); })
    .y0(height2)
    .y1(function (d) { return y2(d.price); });


// make some buttons to drive our zoom
d3.select("body").append("div")
    .attr("id", "btnDiv")
    .style('font-size', '75%')
    .style("width", "250px")
    .style("position", "absolute")
    .style("left", "5%")
    .style("top", "200px")
// debugger;

d3.select("#btnDiv")["_groups"][0][0].innerHML = [
    //   d3.select("#btnDiv")[0][0].innerHTML = [
    '<h3>Buttons To Drive Our Zoom</h3>',
    '<p>push a button and watch the brush react</p>',
    '<ul>',
    '<li>note: deliberately slowed down so each step can be seen and demonstrate how to inject transition</li>',
    '<li>also, play with the brush after drawn to see how it acts as if we drew with our mouse</li>',
    '</ul>'
].join('\n')


var btns = d3.select("#btnDiv").selectAll("button").data([2001, 2002, 2003, 2004])

btns = btns.enter().append("button").style("display", "inline-block")

// fill the buttons with the year from the data assigned to them
btns.each(function (d) {
    this.innerText = d;
})

btns.on("click", drawBrush);

function drawBrush() {
    // our year will this.innerText
    console.log(this.innerText)

    // debugger;
    // define our brush extent to be begin and end of the year
    // brush.extent([
        
    //     new Date(this.innerText + '-01-01').getTime(), 
    //     new Date(this.innerText + '-12-31').getTime()
    // ])
    let start = x(new Date(this.innerText + '-01-01'));
    let end   = x(new Date(this.innerText + '-12-31'));
    // brush.move(context.select("g.brush").transition().delay(1000).duration(500), [start, end]);

    brush.move( [[0, 10], [15, 20]]);

    // brush.extent([
    //     [0, 0], 
    //     [10, 15]
    // ])

    // now draw the brush to match our extent
    // use transition to slow it down so we can see what is happening
    // remove transition so just d3.select(".brush") to just draw
    brush(d3.select(".brush").transition());

    // now fire the brushstart, brushmove, and brushend events
    // remove transition so just d3.select(".brush") to just draw
    brush.event(d3.select(".brush").transition().delay(1000))
}


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.csv('/brush').then((data, error) => {
    if (error) throw error;
    x.domain(d3.extent(data.map(function (d) { return new Date(d.date) })));
    y.domain([0, d3.max(data.map(function (d) { return d.price; }))]);
    x2.domain(x.domain());
    y2.domain(y.domain());
    focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area2);

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    var brush = d3.brushX()
        .extent([[0, 0], [width, 70]])
    


    context.append('g')
        .attr("class", "x brush")
        .attr('width', width)
        .attr('height', 70)
        .call(brush)
        
        // .extent( [ [0,0], [400,400] ])

    // context.append("g")
        // .attr("class", "x brush")
        // .call(brush)
    //     .selectAll("rect")
    //     .attr("y", -6)
    //     .attr("height", height2 + 7);
});

function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.select(".area").attr("d", area);
    focus.select(".x.axis").call(xAxis);
}

function type(d) {
    d.date = parseDate(d.date);
    d.price = +d.price;
    return d;
}