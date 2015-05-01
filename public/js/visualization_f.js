var margin = {top: 20, right: 20, bottom: 100, left: 40};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

//define scale of x to be from 0 to width of SVG, with .1 padding in between
var scaleX = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

//define scale of y to be from the height of SVG to 0
var scaleY = d3.scale.linear()
  .range([height, 0]);

//define axes
var xAxis = d3.svg.axis()
  .scale(scaleX)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(scaleY)
  .orient("left");

//create svg
var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var tip = d3.tip().attr('class', 'd3.tip').offset([-10, 0]).html(function(d) {
  return "<strong>Category:</strong> <span style='color:red'>" + d.category + "</span>";
});

//get json object which contains media counts
d3.json('/facefeed', function(error, data) {
  //set domain of x to be all the usernames contained in the data
  scaleX.domain(data.likes.map(function(d) { return d.name; }));
  //set domain of y to be from 0 to the maximum media count returned
  scaleY.domain([0, d3.max(data.likes, function(d) { return 5; })]);


svg.call(tip);
  //set up x axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")") //move x-axis to the bottom
    .call(xAxis)
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
      return "rotate(-35)" 
    });

  //set up y axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of Photos");

  //set up bars in bar graph
  svg.selectAll(".bar")
    .data(data.likes)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return scaleX(d.name); })
    .attr("width", scaleX.rangeBand())
    .attr("y", function(d) { return scaleY(5); })
    .attr("height", function(d) { return height - scaleY(5); }).on('mouseover', tip.show)
  .on('mouseout', tip.hide);





d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = scaleX.domain(data.likes.sort(this.checked
        ? function(a, b) { return d3.ascending(a.name, b.name); }
        : function(a, b) { return d3.descending(a.name, b.name); })
        .map(function(d) { return d.name; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.name) - x0(b.name); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.name); });

   transition.select(".x.axis")
    .call(xAxis)
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
        .delay(delay);
  }






});