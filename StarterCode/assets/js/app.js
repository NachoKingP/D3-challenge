// @TODO: YOUR CODE HERE!
// Define global variables
var chartData = null;

// Define SVG
var svgWidth = 1000;
var svgHeight = 600;

// Define margins
var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

// Define chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Define Chart Group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Load data from data.csv
d3.csv("/StarterCode/assets/data/data.csv").then(function(data)  {
    // Print the data to error-check
    console.log(data);

    // Parse data: Cast the data values to a number
    data.forEach(d => {
      d.poverty = +d.poverty;
      d.age = +d.age;
      d.income = +d.income;
      d.obesity = +d.obesity;
      d.healthcare = +d.healthcare;
      d.smokes = +d.smokes;
    });

    var chartData = data;
    var xData = data.poverty;      // Change here to change the data variable for the X-Axis
    var yData = data.obesity;      // Change here to change the data variable for the Y-Axis

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty) * 0.95,
            d3.max(data, d => d.poverty) * 1.05])
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.obesity) * 0.95
            , d3.max(data, d => d.obesity) * 1.05])
        .range([chartHeight, 0]);
    
    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);
    
    var circlesLabels = chartGroup.selectAll("g circlesLabels")
        .data(data)
        .enter().append("g");

    //console.log(circlesLabels);

    circlesLabels.append("text")
        .attr("x", d => xLinearScale(d.poverty) - 11)
        .attr("y", d => yLinearScale(d.obesity) + 5)
        //.attr("dy", ".35em")
        .text(d => d.abbr);
      
    // Create Circles
    circlesLabels
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("fill", "red")
    .attr("opacity", ".5");
    
    // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state} <br>${d.poverty}: ${d[d.poverty]} <br>${d.obesity}: ${d[d.obesity]}`);
      });
      
    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesLabels.on("click", function(data) {
        toolTip.show(data, this);
    })

    // onmouseout event
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    // append Chart Title
    chartGroup.append("text")
      //.attr("transform", "rotate(-90)")
      .attr("x", (chartWidth / 2))
      .attr("y", (-30))
      .attr("text-anchor", "middle")
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity v. Poverty Rate");

      // append x axis
      chartGroup.append("text")
        //.attr("transform", "rotate(-90)")
        .attr("x", (chartWidth / 2))
        .attr("y", (chartHeight + 30))
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Poverty Rate");

    // append y axis
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (chartHeight / 2))
    .attr("y", 0 - margin.left)
    .attr("text-anchor", "middle")
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Rate of Obesity");

// }).catch(function(error) {
//     console.log(error);
});

//Display Chart Data outside of load function
//console.log(chartData);

