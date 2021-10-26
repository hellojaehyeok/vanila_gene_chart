var svg = d3.select("svg"),
    margin = {top: 20, right: 60, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1)
    .align(0.2);

var y = d3.scaleLinear()
    .range([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#FF9BBD", "#95CAFF", "#A9FF95"]);

var stack = d3.stack()
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetExpand);  
  
d3.json("data.json", function(error, data) {
  if (error) throw error;
//   data.forEach(function(d){d.satisfied=d.totalHours-d.leftHours});
  data.sort(function(a, b) { return b.totalHours-a.totalHours; });
  
  x.domain(data.map(function(d) { return d.name; }));
//   z.domain(["leftHours", "totalHours"]);
  
  var serie = g.selectAll(".serie")
    .data(stack.keys(["leftHours","totalHours", "test1"])(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); });
  
   serie.selectAll("rect")
    .data(function(d) {return d; })
    .enter().append("rect")
      .attr("x", function(d) {return x(d.data.name); })
      .attr("y", function(d) {console.log(y(d[1])); return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());
  
   g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"));
  
  var legend = serie.append("g")
      .attr("class", "legend")
      .attr("transform", function(d) { var d = d[d.length - 1]; return "translate(" + (x(d.data.name) + x.bandwidth()) + "," + ((y(d[0]) + y(d[1])) / 2) + ")"; });
  
  legend.append("line")
      .attr("x1", -6)
      .attr("x2", 6)
      .attr("stroke", "#000");

  legend.append("text")
      .attr("x", 9)
      .attr("dy", "0.35em")
      .attr("fill", "#000")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.key; });
});