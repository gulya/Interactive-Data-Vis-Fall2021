/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.6;
const height = window.innerHeight * 0.6;
const radius = 5;
const margin = {top: 50, bottom:60, left:60, right:40};

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;
let xAxis;
let xAxisGroup;
let yAxis;
let yAxisGroup;
let colorScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedDiscipline: "All" // + YOUR INITIAL FILTER SELECTION
};

// let data;

/* LOAD DATA */
d3.csv("../data/workouts_by_discipline.csv", d3.autoType).then(raw_data => {
  // save our data to application state
  // console.log('state :>> ', state);
  state.data = raw_data;
  // data = raw_data
  init();
});

/* INITIALIZING FUNCTION */
function init() {
  xScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.month))
    .range([20, width - 20])

  yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.count))
    .range([height - 20, 20])

  xAxis = d3.axisBottom(xScale)
  yAxis = d3.axisLeft(yScale)

  colorScale = d3.scaleOrdinal()
    .domain(["Cycling", "Bike Bootcamp", "Yoga", "Walking", "Strength", "Meditation", "Running", "Stretching"])
    .range(d3.schemeSet2);


  const selectElement = d3.select("#dropdown")

  selectElement
    .selectAll("option")
    .data([
      { key: "All", label: "All Exercises" },
      { key: "Cycling", label: "Cycling" },
      { key: "Bike Bootcamp", label: "Bike Bootcamp" },
      { key: "Yoga", label: "Yoga" },
      { key: "Walking", label: "Walking" },
      { key: "Strength", label: "Strength" },
      { key: "Meditation", label: "Meditation" },
      { key: "Running", label: "Running" },
      { key: "Stretching", label: "Stretching" },

    ])
    // .data(Array.from(new Set(state.data.map(d => d.Party))))
    .join("option")
    // .attr("value", d => d)
    // .text(d => d)
    .attr("value", d => d.key)
    .text(d => d.label)

  selectElement.on("change", event => {
    state.selectedDiscipline = event.target.value
    // console.log('state :>> ', state);
    draw();
  })

  svg = d3.select("#container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  xAxisGroup = svg.append("g")
    .attr("class", 'xAxis')
    .attr("transform", `translate(${0}, ${height - 20})`) // move to the bottom
    .call(xAxis)

  yAxisGroup = svg.append("g")
    .attr("class", 'yAxis')
    .attr("transform", `translate(${20}, ${0})`) // align with left margin
    .call(yAxis)

  draw(); 
}

/* DRAW FUNCTION */
function draw() {

  /* have to make a copy of the scale, or else it will just point to the same
  reference that gets updated in just a few lines */
  let prevXScale = xScale.copy();
  let prevYScale = yScale.copy();

  const filteredData = state.data.filter(d => 
    state.selectedDiscipline === "All" || d.discipline === state.selectedDiscipline
  )
  // console.log('filteredData :>> ', filteredData);

  // xScale = d3.scaleLinear()
  //   .domain(d3.extent(state.filtered, d => d.ideologyScore2020))
  //   .range([0, width])

  xScale = xScale.domain(d3.extent(filteredData, d => d.month))
  xAxisGroup
    .transition()
    .duration(1000)
    .call(xAxis.scale(xScale))

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

  // yScale = d3.scaleLinear()
  // .domain(d3.extent(state.filteredData, d => d.envScore2020))
  // .range([height, 0])

  yScale = yScale.domain(d3.extent(filteredData, d => d.count))
  yAxisGroup
    .transition()
    .duration(1000)
    .call(yAxis.scale(yScale))

  const dots = svg.selectAll("circle.dot")
    .data(filteredData, d => d.discipline)
    .join(
      enter => enter.append("circle")
        .attr("r", radius)
        .attr("cx", d => prevXScale(d.month))
        .attr("cy", d => prevYScale(d.count))
        .attr("fill", d => colorScale(d.discipline))
        .attr("class", "dot")
        .style("font-family", "Noto Sans Mono")
        .call(sel => sel.transition().duration(1000)
          .attr("cx", d => xScale(d.month))
          .attr("cy", d => yScale(d.count))
        ),
      update => update.call(sel => sel.transition()
        .duration(1000)
        .attr("cx", d => xScale(d.month))
        .attr("cy", d => yScale(d.count))
        .style("font-family", "Noto Sans Mono")), 
      exit => exit.call(exit => exit.transition()
        .duration(1000)
        .attr("cx", d => xScale(d.month))
        .attr("cy", d => yScale(d.count))
        .style("font-family", "Noto Sans Mono")
        .style("opacity", 0)
        .remove()),
    )

}