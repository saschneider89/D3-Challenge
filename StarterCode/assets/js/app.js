// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 60,
  right: 60,
  bottom: 100,
  left: 100
};

// chart area minus margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  // .select(".chart")
  // .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import data

d3.csv("assets/data/data.csv").then(function(censusData) {

  // Data
  console.log(censusData);

  // Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });


// // Initial Params
// var chosenXAxis = "hair_length";

  // create scales
 var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.poverty) - 1, d3.max(censusData, d => d.poverty) + 1])
      .range([0, chartWidth]);

   var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcare) -2, d3.max(censusData, d => d.healthcare) + 2])
    .range([chartHeight, 0]);

  // return xLinearScale;

//Create axis
    var yAxis = d3.axisLeft(yLinearScale);
    var xAxis = d3.axisBottom(xLinearScale);

//Append Axes
  chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);


// Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("r", "10")
      .attr("opacity", "0.75")
      .attr("class", "stateCircle")
      .attr("stroke", "black");

// Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([0, 0])
      .html(function(d) {
        return (`<strong>${d.state}</br></br>Lacks Healthcare (%):</br>${d.healthcare}</br></br>Poverty (%):</br> ${d.poverty}<strong>`);
      });


  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });




//From HW 16.3.8
// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//   var label;

//   if (chosenXAxis === "hair_length") {
//     label = "Hair Length:";
//   }
//   else {
//     label = "# of Albums:";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }

// // Retrieve data from the CSV file and execute everything below
// d3.csv("hairData.csv").then(function(hairData, err) {
//   if (err) throw err;

//   // parse data
//   hairData.forEach(function(data) {
//     data.hair_length = +data.hair_length;
//     data.num_hits = +data.num_hits;
//     data.num_albums = +data.num_albums;
//   });

//   // xLinearScale function above csv import
//   var xLinearScale = xScale(hairData, chosenXAxis);

//   // Create y scale function
//   var yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(hairData, d => d.num_hits)])
//     .range([height, 0]);

//   // Create initial axis functions
//   var bottomAxis = d3.axisBottom(xLinearScale);
//   var leftAxis = d3.axisLeft(yLinearScale);

//   // append x axis
//   var xAxis = chartGroup.append("g")
//     .classed("x-axis", true)
//     .attr("transform", `translate(0, ${height})`)
//     .call(bottomAxis);

//   // append y axis
//   chartGroup.append("g")
//     .call(leftAxis);

//   // append initial circles
//   var circlesGroup = chartGroup.selectAll("circle")
//     .data(hairData)
//     .enter()
//     .append("circle")
//     .attr("cx", d => xLinearScale(d[chosenXAxis]))
//     .attr("cy", d => yLinearScale(d.num_hits))
//     .attr("r", 20)
//     .attr("fill", "pink")
//     .attr("opacity", ".5");

//   // Create group for two x-axis labels
//   var labelsGroup = chartGroup.append("g")
//     .attr("transform", `translate(${width / 2}, ${height + 20})`);

//   var hairLengthLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("value", "hair_length") // value to grab for event listener
//     .classed("active", true)
//     .text("Hair Metal Ban Hair Length (inches)");

//   var albumsLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "num_albums") // value to grab for event listener
//     .classed("inactive", true)
//     .text("# of Albums Released");

//   // append y axis
//   chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Number of Billboard 500 Hits");

//   // updateToolTip function above csv import
//   var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//   // x axis labels event listener
//   labelsGroup.selectAll("text")
//     .on("click", function() {
//       // get value of selection
//       var value = d3.select(this).attr("value");
//       if (value !== chosenXAxis) {

//         // replaces chosenXAxis with value
//         chosenXAxis = value;

//         // console.log(chosenXAxis)

//         // functions here found above csv import
//         // updates x scale for new data
//         xLinearScale = xScale(hairData, chosenXAxis);

//         // updates x axis with transition
//         xAxis = renderAxes(xLinearScale, xAxis);

//         // updates circles with new x values
//         circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

//         // updates tooltips with new info
//         circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//         // changes classes to change bold text
//         if (chosenXAxis === "num_albums") {
//           albumsLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           hairLengthLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else {
//           albumsLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           hairLengthLabel
//             .classed("active", true)
//             .classed("inactive", false);
//         }
//       }
//     });
// }).catch(function(error) {
//   console.log(error);
// });
