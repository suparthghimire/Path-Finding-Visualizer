import {
  mod,
  traversePath,
  fillPath,
  createBoundry,
} from "./imports_for_utils.js";

export function drawPath(exploringNodes, startNode, endNode, finalPath) {
  let finalNode = exploringNodes.find((node) => node.name == endNode.name);

  traversePath(finalNode, "parent", finalPath);

  for (let i = 0; i < finalPath.length; i++) {
    fillPath(startNode, endNode, i, finalPath).then((response) => {
      if (i == finalPath.length - 1) {
        document.querySelector("#reset_board").disabled = false;
        document.querySelector("#start_a_star").disabled = false;
        document.querySelector("#start_dijkstra").disabled = false;
        document.querySelector("#generate_maze").disabled = false;
        document.querySelectorAll(".grid").forEach((grid) => {
          grid.disabled = false;
        });
      }
    });
  }
}

function checkVisited(node) {
  return node.isVisited ? true : false;
}
export function setParent(top, right, bottom, left, parent) {
  if (top != null && !checkVisited(top)) {
    top.parent = parent;
  }
  if (right != null && !checkVisited(right)) {
    right.parent = parent;
  }
  if (bottom != null && !checkVisited(bottom)) {
    bottom.parent = parent;
  }
  if (left != null && !checkVisited(left)) {
    left.parent = parent;
  }
}

export function updateExploringList(top, right, left, bottom, exploringNodes) {
  if (top != null && !checkVisited(top)) {
    const status = exploringNodes.filter((node) => node.name === top.name)
      .length;
    if (status == 0) {
      exploringNodes.push(top);
    }
  }
  if (right != null && !checkVisited(right)) {
    const status = exploringNodes.filter((node) => node.name === right.name)
      .length;
    if (status == 0) {
      exploringNodes.push(right);
    }
  }
  if (bottom != null && !checkVisited(bottom)) {
    const status = exploringNodes.filter((node) => node.name === bottom.name)
      .length;
    if (status == 0) {
      exploringNodes.push(bottom);
    }
  }
  if (left != null && !checkVisited(left)) {
    const status = exploringNodes.filter((node) => node.name === left.name)
      .length;
    if (status == 0) {
      exploringNodes.push(left);
    }
  }
}

export function setFnCost(top, right, bottom, left) {
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

export function setGCost(top, right, bottom, left) {
  if (top != undefined) {
    top.gn = calcGCost(top);
  }
  if (right != undefined) {
    right.gn = calcGCost(right);
  }
  if (bottom != undefined) {
    bottom.gn = calcGCost(bottom);
  }
  if (left != undefined) {
    left.gn = calcGCost(left);
  }
}

export function setHCost(top, right, bottom, left, endNode, dimX, dimY) {
  if (top != undefined) {
    top.hn = calcHCost(top.name, endNode, dimX, dimY);
  }
  if (right != undefined) {
    right.hn = calcHCost(right.name, endNode, dimX, dimY);
  }
  if (bottom != undefined) {
    bottom.hn = calcHCost(bottom.name, endNode, dimX, dimY);
  }
  if (left != undefined) {
    left.hn = calcHCost(left.name, endNode, dimX, dimY);
  }
}

export function findNeighbours(node, dimX, dimY) {
  //
  let left, right, top, bottom;
  if (parseInt(node.name) == 0) {
    top = null;
    right = parseInt(node.name) + 1;
    left = null;
    bottom = parseInt(node.name) + dimX;
  } else if (parseInt(node.name) == dimX - 1) {
    top = null;
    right = null;
    left = parseInt(node.name) - 1;
    bottom = parseInt(node.name) + dimX;
  } else if (parseInt(node.name) == dimX * (dimY - 1)) {
    top = parseInt(node.name) - dimX;
    right = parseInt(node.name) + 1;
    left = null;
    bottom = null;
  } else if (parseInt(node.name) == dimX * dimY - 1) {
    top = parseInt(node.name) - dimX;
    right = null;
    left = parseInt(node.name) - 1;
    bottom = null;
  } else if (createBoundry(dimX, dimY).top.includes(parseInt(node.name))) {
    top = null;
    right = parseInt(node.name) + 1;
    left = parseInt(node.name) - 1;
    bottom = parseInt(node.name) + dimX;
  } else if (createBoundry(dimX, dimY).bottom.includes(parseInt(node.name))) {
    top = parseInt(node.name) - dimX;
    right = parseInt(node.name) + 1;
    left = parseInt(node.name) - 1;
    bottom = null;
  } else if (createBoundry(dimX, dimY).left.includes(parseInt(node.name))) {
    top = parseInt(node.name) - dimX;
    right = parseInt(node.name) + 1;
    left = null;
    bottom = parseInt(node.name) + dimX;
  } else if (createBoundry(dimX, dimY).right.includes(parseInt(node.name))) {
    top = parseInt(node.name) - dimX;
    right = null;
    left = parseInt(node.name) - 1;
    bottom = parseInt(node.name) + dimX;
  } else {
    right = parseInt(node.name) + 1;
    top = parseInt(node.name) - dimX;
    left = parseInt(node.name) - 1;
    bottom = parseInt(node.name) + dimX;
  }

  return {
    top,
    bottom,
    left,
    right,
  };
}

export function calcHCost(node, endNode, dimX, dimY) {
  const x1 = mod(parseInt(node), dimX);
  const y1 = Math.floor(parseInt(node) / dimY);
  const x2 = mod(parseInt(endNode.name), dimX);
  const y2 = Math.floor(parseInt(endNode.name) / dimY);
  const xdis = (x2 - x1) * (x2 - x1);
  const ydis = (y2 - y1) * (y2 - y1);

  return Math.sqrt(xdis + ydis);
}

export function calcGCost(currentNode) {
  if (currentNode.parent == null) return 0;
  return currentNode.parent.gn + 1;
}

export function calcFCost(currentNode) {
  return currentNode.gn + currentNode.hn;
}

export function traverse(node) {
  node = node.toString();
  document.getElementById(`${node}`).classList.add("traverse");
}
