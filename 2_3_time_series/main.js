 /* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * 0.7,
 height = window.innerHeight * 0.7,
 margin = { top: 20, bottom: 50, left: 60, right: 60 }

/*
this extrapolated function allows us to replace the "G" with "B" min the case of billions.
we cannot do this in the .tickFormat() because we need to pass a function as an argument,
and replace needs to act on the text (result of the function).
*/
const formatBillions = (num) => d3.format(".2s")(num).replace(/G/, 'B')
const formatDate = d3.timeFormat("%Y")

/* LOAD DATA */
d3.csv('../data/Water_Consumption_in_the_City_of_New_York.csv', d => {
  return {
    year: new Date(+d.year, 0, 1),
    total_consumption: d.total_consumption,
    population: +d.population,
    per_capita: +d.per_capita
  }
}).then(data => {
 console.log('data :>> ', data);

 // + SCALES
 const xScale = d3.scaleTime()
   .domain(d3.extent(data, d => d.year))
   .range([margin.right, width - margin.left])

 const yScale = d3.scaleLinear()
   .domain(d3.extent(data, d => d.per_capita))
   .range([height - margin.bottom, margin.top])

 // CREATE SVG ELEMENT
 const svg = d3.select("#container")
   .append("svg")
   .attr("width", width)
   .attr("height", height)

 // BUILD AND CALL AXES
 const xAxis = d3.axisBottom(xScale)
   .ticks(6) // limit the number of tick marks showing -- note: this is approximate

 const xAxisGroup = svg.append("g")
   .attr("class", "xAxis")
   .attr("transform", `translate(${0}, ${height - margin.bottom})`)
   .call(xAxis)
   .style("font-family", "Noto Sans Mono");

 const yAxis = d3.axisLeft(yScale)
   .tickFormat(formatBillions)

 const yAxisGroup = svg.append("g")
   .attr("class", "yAxis")
   .attr("transform", `translate(${margin.right}, ${0})`)
   .call(yAxis)
   .style("font-family", "Noto Sans Mono");

 // Area GENERATOR FUNCTION
 const areaGen = d3.area()
   .x(d => xScale(d.year))
   .y1(d => yScale(d.per_capita))
   .y0(d => yScale(117))

 // Area
 svg.selectAll(".area")
   .data([data]) // data needs to take an []
   .join("path")
   .attr("class", 'area')
   .attr("fill", "#ffcccc")
   .attr("stroke", "#ffcccc")
   .attr("opacitty", 0.2)
   .attr("d", d => areaGen(d))
   .style("font-family", "Noto Sans Mono");


   //Titles
   svg.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", (margin.left/3))
   .attr("x", 0 - (height/2))
   .style("text-anchor", "middle")
   .text("Per Capita Water Consumption (Gallons)")
   .style("font-family", "Noto Sans Mono");

   svg.append("text")
   .attr("transform", "translate(" + (width / 2) + " ," + (height - (margin.bottom / 4)) + ")")
   .style("text-anchor", "middle")
   .text("Year")
   .style("font-family", "Noto Sans Mono"); 

});