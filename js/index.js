// Graph Nodes
let nodes = [
  { name: "s" },
  { name: "t" },
  { name: "a" },
  { name: "b" },
  { name: "c" },
  { name: "d" },
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

// Adds start end nodes from DOM
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

// Text area / Editor input

function addEdge(s, t, c) {
  for (let i = 0; i < links.length; i++) {
    if (links[i].source === s && links[i].target === t) {
      links[i].capacity = c;
      return;
    }
  }
  links.push({ source: s, target: t, capacity: c, flow: 0 });
}

function getNode(name) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].name == name) {
      return i;
    }
  }

  nodes.push({ name: name });
  return nodes.length - 1;
}

function getText() {
  let lines = document.getElementById("textAreaID").value.split("\n");
  let edgeData;
  console.log(lines);
  for (let i = 0; i < lines.length; i++) {
    edgeData = lines[i].split(" ");
    console.log(edgeData);
    if (edgeData.length >= 3) {
      let s = getNode(edgeData[0]);
      let t = getNode(edgeData[1]);
      let c = parseInt(edgeData[2], 10);
      addEdge(s, t, c);
    }
  }
}

// Buttons functionality

// Max Flow Button
document.getElementById("maxFlowBtn").onclick = function () {
  addStartEndNodes();
  if (s.length != 0 && t.length != 0) {
    alert("Max flow is " + multiFord(links, nodes, s, t));
  } else {
    alert("Add start and end nodes.");
  }
};

// Add Edge
document.getElementById("addEdgesBtn").onclick = function () {
  getText();
  graphRemove();
  graphInit();
};

// Delete Graph
document.getElementById("deleteGraphBtn").onclick = function () {
  nodes = [];
  links = [];
  graphRemove();
  graphInit();
};

//////////////////// D3.js ///////////////////

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

  // This part of code is an good example of graph visualization with d3.js

  //initilize svg or grab svg
  svg = d3.select("svg");
  var width = svg.attr("width");
  var height = svg.attr("height");

  var simulation = d3
    .forceSimulation(d3nodes)
    .force("link", d3.forceLink().links(d3links))
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("center", d3.forceCenter(width / 2, height / 2));

  link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(d3links)
    .enter()
    .append("line")
    .attr("stroke-width", 5)
    .attr("stroke", "lightgray")
    .attr("stroke-opacity", "0.5");

  node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(d3nodes)
    .enter()
    .append("g");

  node
    .append("circle")
    .attr("r", 7)
    .attr("fill", "red")
    .attr("stroke", "white")
    .attr("stroke-width", "2px");

  node
    .append("text")
    .text(function (d) {
      return d.name;
    })
    .attr("x", 0)
    .attr("y", -20)
    .attr("fill", "white");

  simulation.nodes(d3nodes).on("tick", ticked);

  simulation.force("link").links(d3links);

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

    node.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  }
}

// The firs graph render
graphInit();

//////////// TEST CASE ///////////////
// All the input fields and buttons:
// Maximum Flow
// Add Edges
// Delete Graph

// Are fully functional but without data validation
