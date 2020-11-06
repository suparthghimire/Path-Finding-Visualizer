const gridContainer = document.querySelector(".grid-container");
const dim = 16;
let totalVisited = 0;
let pathLength = 0;
let allNodes = [];
let startNode = null;
let endNode = null;

let exploringNodes = [];
let visitedNodes = [];
let finalPath = [];
let nodeBeingExplored = null;
class Node {
  constructor(name, gn, hn, parent, isEnd, isStart, isObstacle) {
    this.name = name;
    this.gn = gn;
    this.hn = hn;
    this.fn = null;
    this.parent = parent;
    this.end = isEnd;
    this.start = isStart;
    this.obstacle = isObstacle;
  }
  calc() {
    return this.gn + this.hn;
  }
}

drawGrid();

function drawGrid() {
  console.clear();
  console.log(allNodes);
  allNodes = [];
  exploringNodes = [];
  visitedNodes = [];
  finalPath = [];
  nodeBeingExplored = null;
  totalVisited = 0;
  pathLength = 0;

  document.querySelector("#path-length").innerText = pathLength;
  document.querySelector("#visited-nodes").innerText = totalVisited;

  console.log(allNodes);
  document.querySelector("#reset_board").disabled = false;
  // console.log("allNodes: ", allNodes);
  document.querySelector(".grid-container").innerHTML = "";
  let count = 0;
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      const span = document.createElement("button");
      span.classList.add("grid");
      // span.innerHTML = count;
      span.id = count;
      gridContainer.appendChild(span);
      allNodes.push(new Node(count, null, null, null, false, false, false));
      count++;
    }
  }
  setStartAndEndNode();
}

function traverse(node) {
  node = node.toString();
  document.getElementById(`${node}`).classList.add("traverse");
}
function setStartAndEndNode() {
  let start = Math.floor(Math.random() * 255);
  let end = Math.floor(Math.random() * 255);

  document.getElementById(start).classList.add("start");
  startNode = allNodes.find((node) => node.name === start);
  startNode.start = true;
  console.log("start ", startNode);

  document.getElementById(end).classList.add("end");
  endNode = allNodes.find((node) => node.name === end);
  endNode.end = true;
  console.log("end ", endNode);
}

gridContainer.addEventListener("click", (e) => {
  const obsCheckBox = document.querySelector("#add_obstacle");
  if (e.target.classList.contains("grid")) {
    if (
      obsCheckBox.checked &&
      !e.target.classList.contains("start") &&
      !e.target.classList.contains("end")
    ) {
      e.target.classList.toggle("obstacle");
      let obstacleNode = allNodes.find((node) => node.name == e.target.id);
      obstacleNode.obstacle = !obstacleNode.obstacle;
    }
  }
});

gridContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("grid")) {
    console.log(e.target.id);
    if (e.target.classList.contains("start")) {
      setNewStartLocation(e.target);
    } else if (e.target.classList.contains("end")) {
      setNewEndLocation(e.target);
    }
  }
});

function setNewStartLocation(oldStart) {
  gridContainer.addEventListener(
    "click",
    (e) => {
      if (!e.target.classList.contains("obstacle")) {
        if (
          e.target.classList.contains("grid") &&
          !e.target.classList.contains("end")
        ) {
          oldStart.classList.remove("start");
          e.target.classList.add("start");
          let oldStartNode = allNodes.find((node) => node.name == oldStart.id);
          oldStartNode.start = false;
          startNode = allNodes.find((node) => node.name == e.target.id);

          startNode.start = true;
          document.getElementById(startNode.name).classList.add("start");
        }
      }
    },
    { once: true }
  );
}
function setNewEndLocation(oldEnd) {
  gridContainer.addEventListener(
    "click",
    (e) => {
      if (!e.target.classList.contains("obstacle")) {
        if (
          e.target.classList.contains("grid") &&
          !e.target.classList.contains("start")
        ) {
          oldEnd.classList.remove("end");
          e.target.classList.add("end");
          let oldEndNode = allNodes.find((node) => node.name == oldEnd.id);
          oldEndNode.end = false;

          endNode = allNodes.find((node) => node.name == e.target.id);
          endNode.end = true;
          document.getElementById(endNode.name).classList.add("end");
        }
      }
    },
    { once: true }
  );
}

function traversePath(node, key) {
  if (node[key] == null) {
    return;
  } else {
    traversePath(node[key], key);
    let keyName = node[key].name.toString();
    finalPath.push(keyName);
  }
}
function fillPath(data) {
  document.getElementById(startNode.name).classList.add("path");
  document.getElementById(endNode.name).classList.add("path");
  setTimeout(() => {
    document.getElementById(finalPath[data]).classList.add("path");
    pathLength++;
    document.querySelector("#path-length").innerText = pathLength;
  }, 200 * data);
  const time = 200 * parseInt(data);
}

function drawPath() {
  document.querySelector("#reset_board").disabled = false;

  let finalNode = exploringNodes.find((node) => node.name == endNode.name);

  traversePath(finalNode, "parent");

  console.log(finalPath);
  for (let i = 0; i < finalPath.length; i++) fillPath(i);
}

document.querySelector("#reset_board").addEventListener("click", drawGrid);
document.querySelector(".overlay").style.visibility = "visible";

document.querySelector(".help").addEventListener("click", () => {
  document.querySelector(".overlay").style.visibility = "visible";
});

document.querySelector("#overlay-close").addEventListener("click", () => {
  document.querySelector(".overlay").style.visibility = "hidden";
});
// A Star Codes
function A_Star() {
  console.log("Start", startNode);
  console.log("Start", endNode);

  let startNodePtr = startNode;

  startNode.gn = calcGCost(startNode.name);
  startNode.hn = calcHCost(startNode.name);
  startNode.fn = calcFCost(startNode);

  exploringNodes.push(startNodePtr);
  visitedNodes.push(startNodePtr);

  let animate = setInterval(() => {
    document.querySelector("#reset_board").disabled = true;

    if (document.getElementById(startNodePtr.name).classList.contains("end")) {
      clearInterval(animate);
      console.log("found");
      drawPath();
      // break;
    } else {
      let top = allNodes.find(
        (node) => node.name == findNeighbours(startNodePtr).top
      );
      let right = allNodes.find(
        (node) => node.name == findNeighbours(startNodePtr).right
      );
      let bottom = allNodes.find(
        (node) => node.name == findNeighbours(startNodePtr).bottom
      );
      let left = allNodes.find(
        (node) => node.name == findNeighbours(startNodePtr).left
      );
      setGCost(top, right, bottom, left);
      setHCost(top, right, bottom, left);
      setFnCost(top, right, bottom, left);
      updateExploringList(top, right, left, bottom, startNodePtr);

      exploringNodes.sort((a, b) => a.fn - b.fn);

      let nodeBeingExplored = exploringNodes.shift();

      const status = visitedNodes.filter(
        (node) => node.name == nodeBeingExplored.name
      ).length;
      if (status == 0) visitedNodes.push(nodeBeingExplored);

      startNodePtr = exploringNodes[0];
      traverse(startNodePtr.name);
      document.querySelector("#visited-nodes").innerText = totalVisited;

      totalVisited++;
    }
  }, 50);
}
function checkVisited(node) {
  return visitedNodes.includes(node) ? true : false;
}

function updateExploringList(top, right, left, bottom, parent) {
  if (top != null && !checkVisited(top)) {
    top.parent = parent;
    const status = exploringNodes.filter((node) => node.name === top.name)
      .length;
    if (status == 0) {
      exploringNodes.push(top);
    }
  }
  if (right != null && !checkVisited(right)) {
    right.parent = parent;
    const status = exploringNodes.filter((node) => node.name === right.name)
      .length;
    if (status == 0) {
      exploringNodes.push(right);
    }
  }
  if (bottom != null && !checkVisited(bottom)) {
    bottom.parent = parent;
    const status = exploringNodes.filter((node) => node.name === bottom.name)
      .length;
    if (status == 0) {
      exploringNodes.push(bottom);
    }
  }
  if (left != null && !checkVisited(left)) {
    left.parent = parent;
    const status = exploringNodes.filter((node) => node.name === left.name)
      .length;
    if (status == 0) {
      exploringNodes.push(left);
    }
  }
}

function setFnCost(top, right, bottom, left) {
  if (top != undefined) {
    top.fn = calcFCost(top);
  }
  if (right != undefined) {
    right.fn = calcFCost(right);
  }
  if (bottom != undefined) {
    bottom.fn = calcFCost(bottom);
  }
  if (left != undefined) {
    left.fn = calcFCost(left);
  }
}
function setGCost(top, right, bottom, left) {
  if (top != undefined) {
    top.gn = calcGCost(top.name);
  }
  if (right != undefined) {
    right.gn = calcGCost(right.name);
  }
  if (bottom != undefined) {
    bottom.gn = calcGCost(bottom.name);
  }
  if (left != undefined) {
    left.gn = calcGCost(left.name);
  }
}
function setHCost(top, right, bottom, left) {
  if (top != undefined) {
    top.hn = calcHCost(top.name);
  }
  if (right != undefined) {
    right.hn = calcHCost(right.name);
  }
  if (bottom != undefined) {
    bottom.hn = calcHCost(bottom.name);
  }
  if (left != undefined) {
    left.hn = calcHCost(left.name);
  }
}
function isObstacle(node) {
  return document.getElementById(node.name).classList.contains("obstacle")
    ? true
    : false;
}

function findNeighbours(node) {
  let left, right, top, bottom;
  if (parseInt(node.name) == 0) {
    top = null;
    right = parseInt(node.name) + 1;
    left = null;
    bottom = parseInt(node.name) + 16;
  } else if (parseInt(node.name) == 15) {
    top = null;
    right = null;
    left = parseInt(node.name) - 1;
    bottom = parseInt(node.name) + 16;
  } else if (parseInt(node.name) == 240) {
    top = parseInt(node.name) - 16;
    right = parseInt(node.name) + 1;
    left = null;
    bottom = null;
  } else if (parseInt(node.name) == 255) {
    top = parseInt(node.name) - 16;
    right = null;
    left = parseInt(node.name) - 1;
    bottom = null;
  } else if (createBoundry().top.includes(parseInt(node.name))) {
    top = null;
    right = parseInt(node.name) + 1;
    left = parseInt(node.name) - 1;
    bottom = parseInt(node.name) + 16;
  } else if (createBoundry().bottom.includes(parseInt(node.name))) {
    top = parseInt(node.name) - 16;
    right = parseInt(node.name) + 1;
    left = parseInt(node.name) - 1;
    bottom = null;
  } else if (createBoundry().left.includes(parseInt(node.name))) {
    top = parseInt(node.name) - 16;
    right = parseInt(node.name) + 1;
    left = null;
    bottom = parseInt(node.name) + 16;
  } else if (createBoundry().right.includes(parseInt(node.name))) {
    top = parseInt(node.name) - 16;
    right = null;
    left = parseInt(node.name) - 1;
    bottom = parseInt(node.name) + 16;
  } else {
    right = parseInt(node.name) + 1;
    top = parseInt(node.name) - 16;
    left = parseInt(node.name) - 1;
    bottom = parseInt(node.name) + 16;
  }
  return {
    top,
    bottom,
    left,
    right,
  };
}
function createBoundry() {
  let left = [];
  let right = [];
  let top = [];
  let bottom = [];
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      if (i == 0) {
        top.push(j);
      }
      if (i == 15) {
        bottom.push(i * 16 + j);
      }
      if (j == 0) {
        left.push(i * 16);
      }
      if (j == 15) {
        right.push(i * 16 + j);
      }
    }
  }
  return {
    top,
    left,
    right,
    bottom,
  };
}
function calcHCost(node) {
  const x1 = mod(parseInt(node), 16);
  const y1 = Math.floor(parseInt(node) / 16);
  const x2 = mod(parseInt(endNode.name), 16);
  const y2 = Math.floor(parseInt(endNode.name) / 16);
  const xdis = (x2 - x1) * (x2 - x1);
  const ydis = (y2 - y1) * (y2 - y1);

  return Math.sqrt(xdis + ydis);
}

function calcGCost(currentNode) {
  const x1 = mod(parseInt(startNode.name), 16);
  const y1 = Math.floor(parseInt(startNode.name) / 16);
  const x2 = mod(parseInt(currentNode), 16);
  const y2 = Math.floor(parseInt(currentNode) / 16);
  return Math.abs(y2 - y1) + Math.abs(x2 - x1);
}

function calcFCost(currentNode) {
  return currentNode.gn + currentNode.hn;
}

document.querySelector("#start_algo").addEventListener("click", () => {
  let status = false;
  document.querySelectorAll(".grid").forEach((grid) => {
    if (
      grid.classList.contains("traverse") ||
      grid.classList.contains("path")
    ) {
      console.log("true");
      status = true;
    } else {
      status = false;
    }
  });
  if (status) {
    drawGrid();
    // A_Star();
  } else {
    A_Star();
  }
});

function mod(n, m) {
  return ((n % m) + m) % m;
}
