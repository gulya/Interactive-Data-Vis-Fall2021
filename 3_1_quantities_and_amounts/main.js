

/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 60, bottom: 120, left: 60, right: 40 },
  radius = 5;
// since we use our scales in multiple functions, they need global scope
let xScale, yScale, colorScale, xAxis, yAxis;

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
  // xscale - categorical, activity
  xScale = d3.scaleBand()
    .domain(state.data.map(d=> d.Album))
    // .range([0, width])
    .range([margin.left, width - margin.right])    // visual variable
    .paddingInner(.2)
    .paddingOuter(.1);

    // yscale - linear,count
  yScale = d3.scaleLinear()
    .domain([3, d3.max(state.data, d => d.Rating)])
    // .range([height, 0])
    .range([height  - margin.bottom, 0])
    .nice()

  xAxis = d3.axisBottom()
    .scale(xScale);

  yAxis = d3.axisLeft()
    .scale(yScale);


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

  svg.append("g")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll("text")
      .attr("transform", "translate(0,0)rotate(-30)")
      .style("text-anchor", "end")
      .style("font-family", "Noto Sans Mono");


  svg.append("g")
      .attr("transform", `translate(${margin.left}, ${0})`)
      .call(yAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-family", "Noto Sans Mono");

  // bars
  svg.selectAll("rect")
    .data(state.data)
    .join("rect")
    .attr("width", xScale.bandwidth())
    .attr("height", d=> height - yScale(d.Rating) - margin.bottom)
    .attr("x", d=>xScale(d.Album))
    .attr("y", d=> yScale(d.Rating))
    .attr("fill", "#ffcccc")
    .style("font-family", "Noto Sans Mono");
}