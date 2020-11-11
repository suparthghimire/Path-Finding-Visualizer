export default class Node {
  constructor(
    name,
    gn,
    hn,
    fn,
    parent,
    isEnd,
    isStart,
    isObstacle,
    neighbours,
    isVisited
  ) {
    this.name = name;
    this.gn = gn;
    this.hn = hn;
    this.fn = fn;
    this.parent = parent;
    this.end = isEnd;
    this.start = isStart;
    this.obstacle = isObstacle;
    this.neighbours = neighbours;
    this.isVisited = isVisited;
  }
}
