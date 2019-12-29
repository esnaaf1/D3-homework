// D3 Homework
// Submitted by Farshad Esnaashari

function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }
};

// Set up the svg area

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 20,
  bottom: 90,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data 
d3.csv('data/data.csv').then( function(censusData){
    
    console.log(  censusData[0]);
    // parse data
    censusData.forEach(function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    });
  
    // create scale functions
    var  xScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.poverty) -1, d3.max(censusData, d => d.poverty)+2])
    .range([0, width]);

    var yScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcare)-1, d3.max(censusData, d => d.healthcare )+2])
    .range([height, 0]);

    // create axes functions
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale)
  
    // append axes to the chart
    chartGroup.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append('g')
    .call(leftAxis);

    //create circles
    console.log('census data', censusData);
    chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .classed('stateCircle', true)
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "15");
    chartGroup.exit().remove();

    // add state abbrevations to the circles

    chartGroup.selectAll('text')
    .data(censusData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => yScale(d.healthcare))
    .text( d => d.abbr);  
    
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("aText", true)
    .text("Lacks Healthcare (%)");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
    .attr("text-anchor", "middle")
    .classed("aText", true)
    .text("In Poverty (%)");

}).catch( function(error){
    console.log(error)
});
