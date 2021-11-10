/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5;
// since we use our scales in multiple functions, they need global scope
let xScale, yScale, x;

/* APPLICATION STATE */
let state = {
  data: [],
};

/* LOAD DATA */
d3.csv('../data/lana_del_rey.csv', d3.autoType).then(raw_data => {
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  /* SCALES */
  //x=scale linear
  xScale = d3.scaleLinear()
      .domain([0, d3.max(state.data, d => d.Rating)])
      .range([0, width - margin * 2])
      .nice()

    // yscale - linear,count
  yScale = d3.scaleBand()
    .domain(state.data.map(d => d.Album))
    .range([0, height - margin])
    .paddingInner(.2)
    .paddingOuter(.1)

      // Add X axis
  x = d3.scaleLinear()
      .domain([0, 4000])
      .range([ 0, width]);

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {
  /* HTML ELEMENTS */
  // svg
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)


  //bars
  svg.selectAll("rect")
    .data(state.data)
    .join("rect")
    // .attr("class", "bar")
    .attr("y", d => yScale(d.Album))
    .attr("x", d => xScale(0))
    .attr("height", yScale.bandwidth())
    .attr("width", d => xScale(d.Rating))
}