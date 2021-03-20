/////////    Our Graph /////////

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

///////////    Text area / Editor input    //////////////

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

// Adds a new edge
function addEdge(s, t, c) {
  for (let i = 0; i < links.length; i++) {
    if (links[i].source === s && links[i].target === t) {
      links[i].capacity = c;
      return;
    }
  }
  links.push({ source: s, target: t, capacity: c, flow: 0 });
}

// Gets the node index if it exists else a new node is created
function getNode(name) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].name == name) {
      return i;
    }
  }
  nodes.push({ name: name });
  return nodes.length - 1;
}

// Gets the text from editor and passes it to the required functions
function getText() {
  let lines = document.getElementById("textAreaID").value.split("\n");
  let edgeData;
  for (let i = 0; i < lines.length; i++) {
    edgeData = lines[i].split(" ");
    if (edgeData.length >= 3) {
      let c = parseInt(edgeData[2], 10);
      if (isNaN(c)) {
        alert("Invalid edge data on line " + (i + 1));
      } else {
        let s = getNode(edgeData[0]);
        let t = getNode(edgeData[1]);
        addEdge(s, t, c);
      }
    }
  }
}

////////   Buttons functionality    ///////////

var result = document.getElementById("result");

// Max Flow Button
document.getElementById("maxFlowBtn").onclick = function () {
  addStartEndNodes();
  if (s.length != 0 && t.length != 0) {
    result.innerHTML = "Maximum flow is " + multiFord(links, nodes, s, t);
  } else {
    alert("Add valid start and end nodes.");
  }
  graphRemove();
  graphInit();
};

// Add Edge Button
document.getElementById("addEdgesBtn").onclick = function () {
  getText();
  graphRemove();
  graphInit();
};

// Delete Graph Button
document.getElementById("deleteGraphBtn").onclick = function () {
  nodes = [];
  links = [];
  graphRemove();
  graphInit();
};

// Load File Button
document.getElementById("input-file").addEventListener("change", getFile);

function getFile(event) {
  const input = event.target;
  if ("files" in input && input.files.length > 0) {
    readFileContent(input.files[0]);
  }
}

function readFileContent(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) =>
      (document.getElementById("textAreaID").value = event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

// Scroll to the top of the window when page is loaded
window.scrollTo(0, 0);

///////////////    D3.js    ////////////////

// These variables are used by D3.js to plot the graph
// These copies are created because D3.js changes some esential object proprieties and max flow algorithm won't work
let d3links; // Here will be a copy of links
let d3nodes; // Here will be a copy of nodes
let svg;

// Removes the existing graph
function graphRemove() {
  svg.selectAll("*").remove();
  d3nodes = [];
  d3links = [];
}

// Draws a new graph
function graphInit() {
  d3links = JSON.parse(JSON.stringify(links));
  d3nodes = JSON.parse(JSON.stringify(nodes));

  svg = d3.select("svg");
  var colors = d3.scaleOrdinal(d3.schemeCategory10),
    width = window.innerWidth * 0.75,
    height = +svg.attr("height"),
    node,
    link,
    edgepaths,
    edgelabels;

  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 13)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5")
    .attr("fill", "#999")
    .attr("fill-opacity", "0.8")
    .style("stroke", "none");

  var simulation = d3
    .forceSimulation(d3nodes)
    .force("link", d3.forceLink().links(d3links)) //.distance(150).strength(1))
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("center", d3.forceCenter(width / 2, height / 2));

  update(d3links, d3nodes);

  // ---
  function update(links, nodes) {
    link = svg
      .selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", 5)
      .attr("stroke", "lightgray")
      .attr("stroke-opacity", "0.5")
      .attr("class", "link")
      .attr("marker-end", "url(#arrowhead)");

    link.append("title").text(function (d) {
      if (d.flow) {
        return d.flow + " / " + d.capacity;
      } else {
        return 0 + " / " + d.capacity;
      }
    });

    edgepaths = svg
      .selectAll(".edgepath")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "edgepath")
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .attr("id", (d, i) => "edgepath" + i)
      .style("pointer-events", "none");

    edgelabels = svg
      .selectAll(".edgelabel")
      .data(links)
      .enter()
      .append("text")
      .style("pointer-events", "none")
      .attr("class", "edgelabel")
      .attr("id", (d, i) => "edgelabel" + i)
      .attr("writing-mode", "vertical-rl")
      .attr("font-size", 11)
      .attr("fill", "white");

    edgelabels
      .append("textPath")
      .attr("xlink:href", (d, i) => "#edgepath" + i)
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .attr("startOffset", "50%")
      .text(function (d) {
        if (d.flow) {
          return d.flow + " / " + d.capacity;
        } else {
          return 0 + " / " + d.capacity;
        }
      });

    node = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node");

    node
      .append("circle")
      .attr("r", 7)
      .style("fill", (d, i) => colors(i))
      .attr("stroke", "white")
      .attr("stroke-width", "2px");

    node.append("title").text((d) => d.name);

    node
      .append("text")
      .attr("dy", -10)
      .text((d) => d.name)
      .attr("fill", "white");

    simulation.nodes(nodes).on("tick", ticked);

    simulation.force("link").links(links);
  }

  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("transform", (d) => "translate(" + d.x + ", " + d.y + ")");

    edgepaths.attr(
      "d",
      (d) => `M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`
    );
  }
}

// The firs graph render
graphInit();
