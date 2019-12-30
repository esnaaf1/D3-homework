// D3 Homework
// Submitted by Farshad Esnaashari


// Set up the svg area
//***************************

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, 
// and shift the latter by left and top margins.
//****************************

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data 
//****************************
d3.csv('data/data.csv').then( function(censusData){
    console.log(  censusData[0]);
    // parse data
    censusData.forEach(function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.income =+data.income;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    });
  
    // create scale functions
    //***********************
    var  xScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.poverty)*.9, d3.max(censusData, d => d.poverty)*1.1])
    .range([0, width]);

    var yScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.healthcare )])
    .range([height, 0]);

    // create axes functions
    //*********************** 
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale)
  
    // append axes to the chart
    //*************************
    chartGroup.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append('g')
    .call(leftAxis);

    //create circles
    //***************

    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr('class', 'stateCircle')
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "15");

    //add state abbrevations to the circles
     var textsGroup = chartGroup.selectAll(null)
    .data(censusData)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => yScale(d.healthcare))
    .text( d => d.abbr);  
    
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")  
    .attr("class", "aText")
    .style('text-anchor', 'middle')
    .text("Lacks Healthcare (%)");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("text-anchor", "middle")
    .attr("class", "aText")
    .text("In Poverty (%)");

    // Initialize tooltip
    var toolTip = d3.tip() 
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
        return  `${d.state}<br>In Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}%<br>`; 
    });
    
    // Create tooltip in the chart
    textsGroup.call(toolTip);
  
    // Create event listeners to display and hide the tooltip
    textsGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });

}).catch( function(error){
    console.log(error)
});
