import {
  drawPath,
  setParent,
  updateExploringList,
  setFnCost,
  setGCost,
  setHCost,
  findNeighbours,
  calcHCost,
  calcGCost,
  calcFCost,
  traverse,
} from "../../utils_pathfinding/imports_for_algorithm.js";

export default function A_Star(startNode, endNode, allNodes, dimX, dimY) {
  let exploringNodes = [];
  let finalPath = [];
  let totalVisited = 1;
  let startNodePtr = startNode;

  startNode.gn = calcGCost(startNode.name);
  startNode.hn = calcHCost(startNode.name, endNode, dimX, dimY);
  startNode.fn = calcFCost(startNode);

  exploringNodes.push(startNodePtr);
  let count = 0;

  let animate = setInterval(() => {
    document
      .querySelectorAll(".grid")
      .forEach((grid) => (grid.disabled = true));
    document.querySelector("#reset_board").disabled = true;
    document.querySelector("#start_algo").disabled = true;

    if (startNodePtr.end == true) {
      clearInterval(animate);
      drawPath(exploringNodes, startNode, endNode, finalPath);
    } else if (count == allNodes.length) {
      clearInterval(animate);
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
      setHCost(top, right, bottom, left, endNode, dimX, dimY);
      setFnCost(top, right, bottom, left);

      updateExploringList(top, right, left, bottom, exploringNodes);

      startNodePtr.isVisited = true;

      exploringNodes.shift();
      exploringNodes.sort((a, b) => a.fn - b.fn);

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
