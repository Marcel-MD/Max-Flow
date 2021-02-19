// Graph Nodes
let nodes = [
  { index: 0, name: "s" },
  { index: 1, name: "t" },
  { index: 2, name: "a" },
  { index: 3, name: "b" },
  { index: 4, name: "c" },
  { index: 5, name: "d" },
];

// Graph Links/Eadges
let links = [
  { source: 0, target: 2, capacity: 10, flow: 0 },
  { source: 0, target: 3, capacity: 10, flow: 0 },
  { source: 2, target: 3, capacity: 2, flow: 0 },
  { source: 2, target: 4, capacity: 4, flow: 0 },
  { source: 2, target: 5, capacity: 8, flow: 0 },
  { source: 3, target: 5, capacity: 9, flow: 0 },
  { source: 4, target: 1, capacity: 10, flow: 0 },
  { source: 5, target: 4, capacity: 6, flow: 0 },
  { source: 5, target: 1, capacity: 10, flow: 0 },
];

// Sources and Targets of our flow, here can go any number of nodes
let s = [];
let t = [];

// Adds nodes from DOM
function addStartEndNodes() {
  let start = document.getElementById("startData").value;
  let end = document.getElementById("endData").value;

  s = [];
  t = [];

  start = start.split(" ");
  end = end.split(" ");

  for (let i = 0; i < start.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (start[i] == nodes[j].name) {
        s.push(j);
      }
    }
  }

  for (let i = 0; i < end.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (end[i] == nodes[j].name) {
        t.push(j);
      }
    }
  }
}

// Buttons functionality

document.getElementById("maxFlowBtn").onclick = function () {
  addStartEndNodes();
  if (s.length != 0 && t.length != 0) {
    alert("Max flow is " + multiFord(links, nodes, s, t));
  } else {
    alert("Add start and end nodes.");
  }
};

//////////////////// D3.js ///////////////////

// Iura daca stii vre-o metoda mai eficienta scrie

// These variables are used by D3.js to plot the graph
// These copies are created because D3.js changes some esential object proprieties and max flow algorithm won't work
let d3links; // Here will be a copy of links
let d3nodes; // Here will be a copy of nodes
let link;
let node;
let svg;

// Removes the existing graph
function graphRemove() {
  node.remove();
  link.remove();
  d3nodes = [];
  d3links = [];
}

// Draws a new graph
function graphInit() {
  d3links = JSON.parse(JSON.stringify(links));
  d3nodes = JSON.parse(JSON.stringify(nodes));

  //////// This part of code is just an example of graph visualization /////////
  // PS. I don't have a clue how D3.js library works

  //initilize svg or grab svg
  svg = d3.select("svg");
  var width = svg.attr("width");
  var height = svg.attr("height");

  var simulation = d3
    .forceSimulation(d3nodes)
    .force("link", d3.forceLink().links(d3links))
    .force("charge", d3.forceManyBody().strength(-30))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(d3links)
    .enter()
    .append("line")
    .attr("stroke-width", function (d) {
      return 3;
    });

  node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(d3nodes)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("fill", function (d) {
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
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
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
}

//////////// TEST CASE ///////////////
// The graph will dissapear and apear

graphInit();

setTimeout(function () {
  graphRemove();
}, 2000);

setTimeout(function () {
  graphInit();
}, 4000);

// You can add start and end nodes to calculate the max flow
// The nodes are declared by their names and are separated by one space