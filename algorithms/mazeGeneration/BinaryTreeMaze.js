import { findNeighbours } from "../../utils_pathfinding/imports_for_algorithm.js";
export default function BinaryTreeMaze(dimX, dimY, allNodes) {
  let count = 0;
  document.querySelector("#start_algo").disabled = true;
  document.querySelector("#reset_board").disabled = true;
  document.querySelector("#generate_maze").disabled = true;
  let mazeAnimate = setInterval(() => {
    console.log(count);
    if (count >= allNodes.length - 1) {
      clearInterval(mazeAnimate);
    } else {
      let currentNode = allNodes[count];
      let top = setNeighbours(currentNode, dimX, dimY).top;
      let right = setNeighbours(currentNode, dimX, dimY).right;
      let bottom = setNeighbours(currentNode, dimX, dimY).bottom;
      let left = setNeighbours(currentNode, dimX, dimY).left;

      let choosenNeighbour = randomNeighbour(top, right, bottom, left);
      let choosenNode = allNodes.find(
        (node) => node.name === parseInt(choosenNeighbour)
      );

      fillWall(choosenNode).then((data) => {
        document.querySelector("#start_algo").disabled = false;
        document.querySelector("#reset_board").disabled = false;
        document.querySelector("#generate_maze").disabled = false;
      });
    }
    count += 2;
  }, 10);
}

function fillWall(choosenNode) {
  let promise = new Promise((resolve, reject) => {
    if (!choosenNode.start && !choosenNode.end) {
      choosenNode.obstacle = true;
      document.getElementById(choosenNode.name).classList.add("obstacle");
    }
    resolve();
  });
  return promise;
}

function setNeighbours(node, dimX, dimY) {
  console.log("current node", node.name);
  return findNeighbours(node, dimX, dimY);
}

function randomNeighbour(top, right, bottom, left) {
  let choiceArray = [];
  if (top != null) choiceArray.push(top);
  if (right != null) choiceArray.push(right);
  if (bottom != null) choiceArray.push(bottom);
  if (left != null) choiceArray.push(left);
  console.log(choiceArray);
  let randomNum = Math.floor(Math.random() * choiceArray.length);
  return choiceArray[randomNum];
}
