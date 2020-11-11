import Node from "./models/Node.js";
import A_Star from "./algorithms/pathfinding/A_Star.js";

const gridContainer = document.querySelector(".grid-container");
const dimX = 40;
const dimY = 10;
let allNodes = [];
let startNode = null;
let endNode = null;

drawGrid();

function drawGrid() {
  allNodes = [];

  document.querySelector("#path-length").innerText = 0;
  document.querySelector("#visited-nodes").innerText = 0;

  document.querySelector("#reset_board").disabled = false;
  document.querySelector("#start_algo").disabled = false;
  //
  document.querySelector(".grid-container").innerHTML = "";
  let count = 0;
  for (let i = 0; i < dimX; i++) {
    for (let j = 0; j < dimY; j++) {
      const button = document.createElement("button");
      button.classList.add("grid");
      button.id = count;
      button.draggable = false;
      gridContainer.appendChild(button);
      allNodes.push(
        new Node(count, 0, 0, 0, null, false, false, false, null, false)
      );
      0;
      count++;
    }
  }
  let start = setStartAndEndNode().start;
  let end = setStartAndEndNode().end;

  let startDiv = document.getElementById(start);
  startDiv.classList.add("start");
  startDiv.draggable = true;

  let endDiv = document.getElementById(end);
  endDiv.classList.add("end");
  endDiv.draggable = true;

  startNode = allNodes.find((node) => node.name === start);
  startNode.start = true;

  document.getElementById(end).classList.add("end");
  endNode = allNodes.find((node) => node.name === end);
  endNode.end = true;
}

function setStartAndEndNode() {
  let start = Math.floor(Math.random() * (dimX * dimY));
  let end = Math.floor(Math.random() * (dimX * dimY));

  if (start == end) setStartAndEndNode();

  return { start, end };
}

dragAndDrop();

gridContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("grid")) {
    if (
      !e.target.classList.contains("start") &&
      !e.target.classList.contains("end")
    ) {
      e.target.classList.toggle("obstacle");
      let obstacleNode = allNodes.find((node) => node.name == e.target.id);
      obstacleNode.obstacle = !obstacleNode.obstacle;
    }
  }
});

//

document.querySelector("#start_algo").addEventListener("click", () => {
  let status = false;
  document.querySelectorAll(".grid").forEach((grid) => {
    if (
      grid.classList.contains("traverse") ||
      grid.classList.contains("path")
    ) {
      status = true;
    }
  });
  if (status) {
    drawGrid();
  } else {
    A_Star(startNode, endNode, allNodes, dimX, dimY);
  }
});

document.querySelector("#reset_board").addEventListener("click", drawGrid);
document.querySelector(".overlay").style.visibility = "visible";

document.querySelector(".help").addEventListener("click", () => {
  document.querySelector(".overlay").style.visibility = "visible";
});

document.querySelector("#overlay-close").addEventListener("click", () => {
  document.querySelector(".overlay").style.visibility = "hidden";
});

function dragAndDrop() {
  var dragged;
  document.addEventListener(
    "dragstart",
    function (event) {
      // store a ref. on the dragged elem
      dragged = event.target;
      // make it half transparent
      event.target.style.opacity = 0.5;
    },
    false
  );

  document.addEventListener(
    "dragend",
    function (event) {
      // reset the transparency
      event.target.style.opacity = "";
    },
    false
  );

  /* events fired on the drop targets */
  document.addEventListener(
    "dragover",
    function (event) {
      // prevent default to allow drop
      event.preventDefault();
    },
    false
  );

  document.addEventListener(
    "dragenter",
    function (event) {
      // highlight potential drop target when the draggable element enters it

      if (event.target.className == "grid") {
        event.target.style.background = "purple";
      }
    },
    false
  );

  document.addEventListener(
    "dragleave",
    function (event) {
      // reset background of potential drop target when the draggable element leaves it

      if (event.target.className == "grid") {
        event.target.style.background = "";
      }
    },
    false
  );

  document.addEventListener(
    "drop",
    function (event) {
      event.preventDefault();

      if (event.target.className == "grid") {
        event.target.style.background = "";

        console.log(dragged);
        let draggedNode = allNodes.find(
          (node) => node.name === parseInt(dragged.id)
        );
        let droppedNode = allNodes.find(
          (node) => node.name === parseInt(event.target.id)
        );
        console.log("Node Being Dragged:", draggedNode);
        console.log("Node being Dropped:", droppedNode);

        if (draggedNode.start && !draggedNode.end) {
          console.log(
            `Start Node: ${draggedNode.name} is being dropped at ${droppedNode.name}`
          );
          let newStartNode = droppedNode;

          draggedNode.start = false;
          draggedNode.end = false;

          newStartNode.start = true;
          newStartNode.end = false;
          startNode = newStartNode;

          document.getElementById(draggedNode.name).classList.remove("start");
          document.getElementById(draggedNode.name).draggable = false;

          document.getElementById(newStartNode.name).classList.add("start");
          document.getElementById(newStartNode.name).draggable = true;
        }
        if (draggedNode.end && !draggedNode.start) {
          console.log(
            `End Node ${draggedNode.name} is being dropped at ${droppedNode.name}`
          );
          let newEndNode = droppedNode;

          draggedNode.start = false;
          draggedNode.end = false;

          newEndNode.start = false;
          newEndNode.end = true;
          endNode = newEndNode;

          document.getElementById(draggedNode.name).classList.remove("end");
          document.getElementById(draggedNode.name).draggable = false;

          document.getElementById(newEndNode.name).classList.add("end");
          document.getElementById(newEndNode.name).draggable = true;
        }
      }
    },
    false
  );
}
