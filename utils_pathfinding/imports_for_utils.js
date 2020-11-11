export function mod(n, m) {
  return ((n % m) + m) % m;
}
export function traversePath(node, key, finalPath) {
  if (node[key] == null) {
    return;
  } else {
    traversePath(node[key], key, finalPath);
    let keyName = node[key].name.toString();
    finalPath.push(keyName);
  }
}
export function fillPath(startNode, endNode, data, finalPath) {
  document.getElementById(startNode.name).classList.add("path");
  document.getElementById(endNode.name).classList.add("path");

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById(finalPath[data]).classList.add("path");
      document.querySelector("#path-length").innerText = parseInt(data) + 1;
      resolve();
    }, 200 * data);
  });
  return promise;
}

export function createBoundry(dimX, dimY) {
  let left = [];
  let right = [];
  let top = [];
  let bottom = [];
  for (let i = 0; i < dimY; i++) {
    for (let j = 0; j < dimX; j++) {
      if (i == 0) top.push(j);
      if (j == 0) left.push(i * dimX);
      if (i == dimY - 1) bottom.push(i * dimX + j);
      if (j == dimX - 1) right.push(i * dimX + j);
    }
  }
  return {
    top,
    left,
    right,
    bottom,
  };
}
