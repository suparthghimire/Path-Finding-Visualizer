const gridContainer = document.querySelector(".grid-container");
const dim = 16;
let totalVisited = 0;
let pathLength = 0;

drawGrid();

function drawGrid() {
  document.querySelector(".grid-container").innerHTML = "";
  let count = 0;
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      const span = document.createElement("button");
      span.classList.add("grid");
      // span.innerHTML = count;
      span.id = count;
      gridContainer.appendChild(span);
      count++;
    }
  }
  const start = setStartAndEndNode().startNode.toString();
  const end = setStartAndEndNode().endNode.toString();
  // console.log(startNode, endNode);

  document.getElementById(`${start}`).classList.add("start");
  document.getElementById(`${end}`).classList.add("end");

  document.querySelector("#status").innerText = "Idle";
  document.querySelector("#path-length").innerText = 0;
  document.querySelector("#visited-nodes").innerText = 0;
}

function setStartAndEndNode() {
  let startNode = Math.floor(Math.random() * 255);
  let endNode = Math.floor(Math.random() * 255);

  if (startNode == endNode) {
    setStartAndEndNode();
  }
  return { startNode, endNode };
}

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
      if (
        e.target.classList.contains("grid") &&
        !e.target.classList.contains("end")
      ) {
        oldStart.classList.remove("start");
        e.target.classList.add("start");
      }
    },
    { once: true }
  );
}
function setNewEndLocation(oldEnd) {
  gridContainer.addEventListener(
    "click",
    (e) => {
      if (
        e.target.classList.contains("grid") &&
        !e.target.classList.contains("start")
      ) {
        oldEnd.classList.remove("end");
        e.target.classList.add("end");
      }
    },
    { once: true }
  );
}

function h_cost(startNode, endNode) {
  const x1 = mod(startNode, 16);
  const y1 = Math.floor(startNode / 16);
  const x2 = mod(endNode, 16);
  const y2 = Math.floor(endNode / 16);

  const xdis = (x2 - x1) * (x2 - x1);
  const ydis = (y2 - y1) * (y2 - y1);

  return Math.sqrt(xdis + ydis);
}

class Node {
  constructor(name, gn, hn, parent) {
    this.name = name;
    this.gn = gn;
    this.hn = hn;
    this.fn = this.gn + this.hn;
    this.parent = parent;
  }
}

function A_Star() {
  let start = document.querySelector(".start").id;
  let end = document.querySelector(".start").id;

  let startNodeName = start;

  let exploringList = [];
  let visited = [];

  let startNode = new Node(
    start,
    0,
    h_cost(parseInt(start), parseInt(end), null)
  );

  exploringList.push(startNode);

  let animate = setInterval(() => {
    document.querySelector("#status").innerText = "Running";

    if (document.getElementById(start).classList.contains("end")) {
      console.log("found");
      calcPath(exploringList[0], visited);
      clearInterval(animate);
    } else {
      let left_int = calcNeighbour(parseInt(start)).left;
      let right_int = calcNeighbour(parseInt(start)).right;
      let top_int = calcNeighbour(parseInt(start)).top;
      let bottom_int = calcNeighbour(parseInt(start)).bottom;

      let left = left_int == null ? null : left_int.toString();
      let right = right_int == null ? null : right_int.toString();
      let top = top_int == null ? null : top_int.toString();
      let bottom = bottom_int == null ? null : bottom_int.toString();

      if (left != null && !checkVisited(visited, left)) {
        let g_cost = calcGCost(parseInt(start), parseInt(left));
        let leftNode = new Node(
          left,
          g_cost,
          h_cost(parseInt(left), parseInt(end)),
          start
        );
        if (
          exploringList.filter((node) => node.name === leftNode.name).length ===
          0
        ) {
          exploringList.push(leftNode);
        }
      }

      if (right != null && !checkVisited(visited, right)) {
        let g_cost = calcGCost(parseInt(start), parseInt(right));
        let rightNode = new Node(
          right,
          g_cost,
          h_cost(parseInt(right), parseInt(end)),
          start
        );
        if (
          exploringList.filter((node) => node.name === rightNode.name)
            .length === 0
        ) {
          exploringList.push(rightNode);
        }
      }

      if (top != null && !checkVisited(visited, top)) {
        let g_cost = calcGCost(parseInt(start), parseInt(top));
        let topNode = new Node(
          top,
          g_cost,
          h_cost(parseInt(top), parseInt(end)),
          start
        );
        if (
          exploringList.filter((node) => node.name === topNode.name).length ===
          0
        ) {
          exploringList.push(topNode);
        }
      }
      if (bottom != null && !checkVisited(visited, bottom)) {
        let g_cost = calcGCost(parseInt(start), parseInt(bottom));
        let bottomNode = new Node(
          bottom,
          g_cost,
          h_cost(parseInt(bottom), parseInt(end)),
          start
        );
        if (
          exploringList.filter((node) => node.name === bottomNode.name)
            .length === 0
        ) {
          exploringList.push(bottomNode);
        }
      }

      visited.push(exploringList.shift());
      let nextNode = exploringList[0];

      traverse(start);

      startNode = nextNode;
      start = nextNode.name;
    }
  }, 50);
  document.querySelectorAll(".grid").forEach((btn) => {
    btn.disabled = true;
  });

  document.querySelector("#reset_board").disabled = true;
}

function calcPath(finalNode, visited) {
  console.log("Visited");
  visited.sort((a, b) => parseInt(a.name) - parseInt(b.name));

  let parent = visited.find((node) => node.name === finalNode.parent);
  // console.log(parent);
  let allParents = [];

  visited.forEach((node) => {
    if (finalNode == undefined) return;
    let selected = visited.find((node) => node.name === finalNode.parent); ///222
    finalNode = selected;
    allParents.push(selected);
  });

  visited.forEach((node, i) => {
    let selected = visited.find((element) => element.name === parent.parent);
    allParents.push(selected.name);
  });

  for (let i = 0; i < allParents.length; i++) drawPath(allParents, i);
}

function drawPath(allParents, data) {
  setTimeout(function () {
    document.getElementById(allParents[data].name).classList.add("path");
    pathLength++;
    document.querySelector("#path-length").innerText = pathLength;
    document.querySelector("#status").innerText = "Idle";
    document.querySelector(".start").classList.add("path");
    document.querySelector(".end").classList.add("path");
  }, 200 * data);

  setTimeout(() => {
    document.querySelector("#reset_board").disabled = false;
  }, 500);
}

function calcGCost(startNode, currentNode) {
  const x1 = mod(startNode, 16);
  const y1 = Math.floor(startNode / 16);
  const x2 = mod(currentNode, 16);
  const y2 = Math.floor(currentNode / 16);
  return Math.abs(y2 - y1) + Math.abs(x2 - x1);
}

function checkVisited(visited, nodeName) {
  if (visited.filter((node) => node.name === nodeName).length === 0) {
    return false;
  }
  return true;
}

function calcNeighbour(startNode) {
  // check for boundry conditions
  let left, right, top, bottom;
  if (startNode == 0) {
    // top-left
    right = startNode + 1;
    bottom = startNode + 16;
    top = null;
    left = null;
  } else if (startNode == 15) {
    // top-right
    left = startNode - 1;
    bottom = startNode + 16;
    top = null;
    right = null;
  } else if (startNode == 240) {
    // bottom-left
    top = startNode - 16;
    right = startNode + 1;
    left = null;
    bottom = null;
  } else if (startNode == 255) {
    // bottom-right
    top = startNode - 16;
    left = startNode - 1;
    right = null;
    left = null;
  } else if (createBoundry().top.includes(startNode)) {
    // top boundry
    top = null;
    left = startNode - 1;
    bottom = startNode + 16;
    right = startNode + 1;
  } else if (createBoundry().bottom.includes(startNode)) {
    // bottom boundry
    bottom = null;
    top = startNode - 16;
    left = startNode - 1;
    right = startNode + 1;
  } else if (createBoundry().left.includes(startNode)) {
    // left boundry
    left = null;
    bottom = startNode + 16;
    top = startNode - 16;
    right = startNode + 1;
  } else if (createBoundry().right.includes(startNode)) {
    // right boundry
    right = null;
    top = startNode - 16;
    left = startNode - 1;
    bottom = startNode + 16;
  } else {
    right = startNode + 1;
    top = startNode - 16;
    left = startNode - 1;
    bottom = startNode + 16;
  }
  return {
    top,
    bottom,
    left,
    right,
  };
}

document.querySelector("#start_algo").addEventListener("click", A_Star);

function mod(n, m) {
  return ((n % m) + m) % m;
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
function traverse(startNode) {
  totalVisited++;
  document.getElementById(`${startNode}`).classList.add("traverse");
  document.querySelector("#visited-nodes").innerText = totalVisited;
}

document.querySelector("#reset_board").addEventListener("click", drawGrid);
