// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 40, left: 150},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("../data/peloton_workouts.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 4000])
    .range([ 0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-family", "Noto Sans Mono");

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.Instructor; }))
    .padding(.15);

  svg.append("g")
    .call(d3.axisLeft(y))
    .style("font-family", "Noto Sans Mono");

  //Bars
  svg.selectAll(".myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Instructor); })
    .attr("width", function(d) { return x(d.Minutes); })
    .attr("height", y.bandwidth() )
    .attr("fill", "#ffcccc")
    .style("font-family", "Noto Sans Mono");

})