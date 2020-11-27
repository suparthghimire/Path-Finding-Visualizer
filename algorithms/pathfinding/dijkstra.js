import {
  drawPath,
  setParent,
  updateExploringList,
  setGCost,
  findNeighbours,
  traverse,
} from "../../utils_pathfinding/imports_for_algorithm.js";

export default function Dijkstra(startNode, endNode, allNodes, dimX, dimY) {
  let exploringNodes = [];
  let finalPath = [];
  let totalVisited = 1;
  let startNodePtr = startNode;

  let animate = setInterval(() => {
    document
      .querySelectorAll(".grid")
      .forEach((grid) => (grid.disabled = true));
    document.querySelector("#reset_board").disabled = true;
    document.querySelector("#start_a_star").disabled = true;
    document.querySelector("#start_dijkstra").disabled = true;
    document.querySelector("#generate_maze").disabled = true;
    if (startNodePtr.end == true) {
      clearInterval(animate);
      drawPath(exploringNodes, startNode, endNode, finalPath);
    } else {
      let top = allNodes.find(
        (node) => node.name == findNeighbours(startNodePtr, dimX, dimY).top
      );
      let right = allNodes.find(
        (node) => node.name == findNeighbours(startNodePtr, dimX, dimY).right
      );
      let bottom = allNodes.find(
        (node) => node.name == findNeighbours(startNodePtr, dimX, dimY).bottom
      );
      let left = allNodes.find(
        (node) => node.name == findNeighbours(startNodePtr, dimX, dimY).left
      );
      startNodePtr.neighbours = [top, right, bottom, left];
      setParent(top, right, bottom, left, startNodePtr);
      setGCost(top, right, bottom, left);
      updateExploringList(top, right, left, bottom, exploringNodes);
      startNodePtr.isVisited = true;
      exploringNodes.shift();
      exploringNodes.sort((a, b) => a.gn - b.gn);

      for (let j = exploringNodes.length - 1; j--; ) {
        if (exploringNodes[j].obstacle == true) {
          exploringNodes.splice(j, 1);
        }
      }
      traverse(startNodePtr.name);

      startNodePtr = exploringNodes[0];
      document.querySelector("#visited-nodes").innerText = totalVisited;
      totalVisited++;
    }
  }, 50);
}
