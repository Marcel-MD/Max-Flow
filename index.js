var nodes = [
    {id: 0, name: 's', },
    {id: 1, name: 't', },
    {id: 2, name: 'a', },
    {id: 3, name: 'b', },
    {id: 4, name: 'c', },
    {id: 5, name: 'd', }
  ];

var links = [
    {source: 0, target: 2, capacity: 10, flow: 0 },
    {source: 0, target: 3, capacity: 10, flow: 0 },
    {source: 2, target: 3, capacity: 2, flow: 0 },
    {source: 2, target: 4, capacity: 4, flow: 0 },
    {source: 2, target: 5, capacity: 8, flow: 0 },
    {source: 3, target: 5, capacity: 9, flow: 0 },
    {source: 4, target: 1, capacity: 10, flow: 0 },
    {source: 5, target: 4, capacity: 6, flow: 0 },
    {source: 5, target: 1, capacity: 10, flow: 0 },
  ];

var s = 0;
var t = 1;

  //initilize svg or grab svg
  var svg = d3.select("svg");
  var width = svg.attr("width");
  var height = svg.attr("height");
  

  var simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink()
        .id(function(d) {
          return d.id;
        })
        .links(links)
    )

    .force("charge", d3.forceManyBody().strength(-30))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", function(d) {
      return 3;
    });

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("fill", function(d) {
      return "red";
    })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  function ticked() {
    link
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    node
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }