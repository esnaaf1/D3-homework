// D3 Homework, versipn 2
// Submitted by Farshad Esnaaashari


// set up svg area

svgWidth = 960;
svgHeight = 500;

var margin = {
  top: 10,
  left: 120,
  right: 60,
  bottom: 140
};

// set up the chart area

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create a svg wrapper and append a svg group that holds the chart

var svg = d3.select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

// append an svg group
var chartGroup = svg.append('g')
  .append('g')
  .attr('transform', `translate (${margin.left}, ${margin.right})`);

// initial parameters
var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';

// create a function to update the x-scale upon click on the x-axis label
function xScale (censusData, chosenXAxis) {
// create a scale
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) *.9, d3.max(censusData, d => d[chosenXAxis])*1.1])
    .range([0, width]);

  return xLinearScale;

}

//create a function to update the y-scale upon click on the y-axis label
function yScale (censusData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(censusData, d => d[chosenYAxis])*.8, d3.max(censusData, d => d[chosenYAxis])])
  .range([height, 0]);

  return yLinearScale;
}

// create a function to update the x-Axis var upon click on the x-axis label
function renderXAxes( newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  
  return xAxis;
}

// create a function to update the y-Axis var upon click on the x-axis label
function renderYAxes( newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  
  return yAxis;
}

// create a function to update the circles group upon transition to the new x axis

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAXis) {

  circlesGroup.transition()
    .duration(1000)
    .attr('cx', d => newXScale(d[chosenXAxis]))
    .attr('cy', d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// create a function to update the texts group upon transition to the new x axis

function renderStates(textsGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  textsGroup.transition()
    .duration(1000)
    .attr('x', d => newXScale(d[chosenXAxis]))
    .attr('y', d => newYScale(d[chosenYAxis]));

  return textsGroup;
}

// create a function to update the circles group upon the new x axis
function updateToolTip(chosenXAxis, chosenYAxis, textsGroup) {

  switch (chosenXAxis) {
    case 'poverty':
      var xlabel = 'Poverty (%) ';
      break;
    case 'age':
      var xlabel = 'Age (Median)';
      break;
    case 'income': 
      var xlabel = 'Income (Median)';
      break;
    default: 
      var xlabel = 'undefined'
  }

  switch (chosenYAxis) {
    case 'healthcare':
      var ylabel = 'Healthcare (%) ';
      break;
    case 'smokes':
      var ylabel = 'Smokes (%)';
      break;
    case 'obesity': 
      var ylabel = 'Obese (%)';
      break;
    default: 
      var ylabel = 'undefined'
  }

  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([80,-60])
    .html (function(d) {
      return  `${d.state}<br>${xlabel}: ${d[chosenXAxis]}<br> ${ylabel}: ${d[chosenYAxis]}<br>`; 
    });
 

  textsGroup.call(toolTip);

  textsGroup.on('mouseover', function(data){
    toolTip.show(data, this);
  })
    .on('mouseout', function (data) {
      toolTip.hide(data);
    });

  return textsGroup;
}


// retrieve data from the csv file and execute everything below

d3.csv('data/data.csv').then( function (censusData){

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

  // create x and y scale functions

  var xLinearScale = xScale(censusData, chosenXAxis);

  var yLinearScale = yScale(censusData, chosenYAxis);

  // create x and y axes

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis 
  var xAxis = chartGroup.append('g')
    .classed('x-axis', true)
    .attr('transform', `translate (0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append('g')
    .classed('y-axis', true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr('class', 'stateCircle')
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15");

  // append the initial states
  var textsGroup = chartGroup.selectAll(null)
    .data(censusData)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.healthcare))
    .text( d => d.abbr); 

  // create group for the 3 x axes labels

  var labelsGroup = chartGroup.append('g')
    .attr('transform', `translate(${width /2}, ${height + 20})` );

  var povertyLabel = labelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'poverty')  //value to grab for the event listeter
    .attr('class', 'aText')
    .classed('active', true)
    .text('In Poverty (%)');
  
  var ageLabel = labelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 40)
    .attr('value', 'age')  //value to grab for the event listeter
    .attr('class', 'aText')
    .classed('inactive', true)
    .text('Age (Median)');

  var incomeLabel = labelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 60)
    .attr('value', 'income')  //value to grab for the event listeter
    .attr('class', 'aText')
    .classed('inactive', true)
    .text('Household Income (Median)');


  // create gruop for the 3 y axes labels

  var labelsYGroup = chartGroup.append('g');

  var healthcareLabel = labelsYGroup.append('text')
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+60)
    .attr("x", 0 - (height / 2))
    .attr('value', 'healthcare')  // value to grab for the event listener
    .attr("dy", "1em")  
    .attr("class", "aText")
    .classed('active', true)
    .text("Lacks Healthcare (%)");

  var smokesLabel = labelsYGroup.append('text')
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+40)
    .attr("x", 0 - (height / 2))
    .attr('value', 'smokes') // value to grab for the event listener
    .attr("dy", "1em")  
    .attr("class", "aText")
    .classed('inactive', true)
    .text("Smokes (%)");
  
  var obesityLabel = labelsYGroup.append('text')
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+20)
    .attr("x", 0 - (height / 2))
    .attr('value', 'obesity')  //value to grab for the event listner
    .attr("dy", "1em")  
    .attr("class", "aText")
    .classed('inactive', true)
    .text("Obese (%)");


  // updateToolTip function
  var textsGroup = updateToolTip(chosenXAxis, chosenYAxis, textsGroup);

  // x axis labels event listener
  labelsGroup.selectAll('text')
    .on('click', function (){
        //get value of the selection
        var value = d3.select(this).attr('value');
        if (value !=chosenXAxis) {
          // replace chosenXAxis with value
          chosenXAxis = value;
          // update the x scale with the new data
          xLinearScale = xScale(censusData, chosenXAxis);

          // update the x axis with transiton
          xAxis = renderXAxes(xLinearScale, xAxis);

          // update the circles with new values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

          // update the states with new values
          textsGroup = renderStates(textsGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

          // update the tootips with new values
          textsGroup = updateToolTip(chosenXAxis, chosenYAxis, textsGroup);
          

          // change classess to change bold text

          switch (chosenXAxis) {
            case 'poverty':
              povertyLabel
                .classed('active', true)
                .classed('inactive', false);
              ageLabel
                .classed('active', false)
                .classed('inactive', true);
              incomeLabel
                .classed('active', false)
                .classed('inactive', true);
              break;

            case 'age':
              povertyLabel
                .classed('active', false)
                .classed('inactive', true);
              ageLabel
                .classed('active', true)
                .classed('inactive', false);
              incomeLabel
                .classed('active', false)
                .classed('inactive', true);
              break;
            
            case 'income':
              povertyLabel
                .classed('active', false)
                .classed('inactive', true);
              ageLabel
                .classed('acrtive', false)
                .classed('inactive', true);
              incomeLabel
                .classed('active', true)
                .classed('inactive', false);
              break;  
            default:
              console.log('error with labels')    
          }
        }

    });

  // y axis labels event listener
  labelsYGroup.selectAll('text')
  .on('click', function (){
      //get value of the selection
      var value = d3.select(this).attr('value');
      if (value !=chosenYAxis) {
        // replace chosenXAxis with value
        chosenYAxis = value;
        // update the x scale with the new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // update the x axis with transiton
        yAxis = renderYAxes(yLinearScale, yAxis);

        // update the circles with new values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis,chosenYAxis);

        // update the states with new values
        textsGroup = renderStates(textsGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // update the tootips with new values
        textsGroup = updateToolTip(chosenXAxis, chosenYAxis, textsGroup);
        

        // change classess to change bold text

        switch (chosenYAxis) {
          case 'healthcare':
            healthcareLabel
              .classed('active', true)
              .classed('inactive', false);
            smokesLabel
              .classed('active', false)
              .classed('inactive', true);
            obesityLabel
              .classed('active', false)
              .classed('inactive', true);
            break;

          case 'smokes':
            healthcareLabel
              .classed('active', false)
              .classed('inactive', true);
            smokesLabel
              .classed('active', true)
              .classed('inactive', false);
            obesityLabel
              .classed('active', false)
              .classed('inactive', true);
            break;
          
          case 'obesity':
            healthcareLabel
              .classed('active', false)
              .classed('inactive', true);
            smokesLabel
              .classed('active', false)
              .classed('inactive', true);
            obesityLabel
              .classed('active', true)
              .classed('inactive', false);
            break;
          default:
            console.log('error with labels')    
        }
      }

  });

}).catch( function(error){
    console.log(error)
});