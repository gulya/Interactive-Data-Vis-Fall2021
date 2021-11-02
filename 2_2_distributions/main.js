///GLOBALS
const width = window.innerWidth * 0.6;
const height = window.innerHeight * 0.6;
const r = 5;
const margin = {top: 50, bottom:60, left:60, right:40};

// append the svg object to the body of the page
var svg = d3.select("#container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("../data/workouts_by_discipline.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 45])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 28])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([0, 435])
    .range([4, 15]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["Bike Bootcamp", "Cycling", "Meditation", "Strength", "Stretching", "Walking", "Yoga"])
    .range(d3.schemeSet2);

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#container")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Discipline: " + d.discipline + "</n>,  Total Length of Workouts: " + d.total_length + " minutes")
      // .html("Month: " + d.month)
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var moveTooltip = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  //Legends

  svg.append("text")
  .attr("class", "y label")
  .attr("text-anchor", "begin")
  .attr("y", -50)
  .attr("x", -height/1.5 )
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("Count of Total Workouts")
  .style("font-family", "Noto Sans Mono");
  ;


  svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "begin")
  .attr("x", width/3)
  .attr("y", height + margin.bottom * 0.8)
  .text("Month since start of workouts")
  .style("font-family", "Noto Sans Mono");
  ;  

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("cx", function (d) { return x(d.month); } )
      .attr("cy", function (d) { return y(d.count); } )
      .attr("r", function (d) { return z(d.total_length); } )
      .style("fill", function (d) { return myColor(d.discipline); } )
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )
    .style("font-family", "Noto Sans Mono");


  })