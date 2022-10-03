type BoardCoordinate = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type PositionType = readonly [BoardCoordinate, BoardCoordinate];

const equalPositions = (a: PositionType, b: PositionType) => a[0] === b[0] && a[1] === b[1];

const hasPosition = (arr: PositionType[], position: PositionType) =>
  arr.some((arrPos) => equalPositions(arrPos, position));

const MovesGraph = () => {
  const adjList = new Map<string, PositionType[]>();

  return {
    get edges() {
      return adjList;
    },
    get(position: PositionType) {
      return adjList.get(String(position));
    },
    addVertex: (position: PositionType) => {
      // Add vertex only if it does not already exist
      if (adjList.get(String(position)) === undefined) {
        adjList.set(String(position), []);
      }
    },
    addEdge: (src: PositionType, dest: PositionType) => {
      const srcList = adjList.get(String(src));
      const destList = adjList.get(String(dest));

      // Only push if src and dest are defined vertices and they're not already connected
      if (srcList && destList && !hasPosition(srcList, dest)) {
        srcList.push(dest);
        destList.push(src);
      }
    },
  };
};

const Knight = (position: PositionType) => {
  const relativeMoves = [
    [+2, +1],
    [+2, -1],
    [-2, +1],
    [-2, -1],
    [+1, +2],
    [-1, +2],
    [+1, -2],
    [-1, -2],
  ] as const;

  // An 8x8 board goes from 0 to 7
  const inRange = (num: number) => num >= 0 && num <= 7;

  const getLegalMoves = (moves: number[][]) => {
    return moves.filter(([x, y]) => inRange(x) && inRange(y)) as unknown as PositionType[];
  };

  return {
    get position() {
      return position;
    },
    set position(value: PositionType) {
      position = value;
    },
    get legalMoves() {
      return getLegalMoves(relativeMoves.map(([x, y]) => [x + position[0], y + position[1]]) as [number, number][]);
    },
  };
};

export const GameBoard = (knightPosition: PositionType) => {
  const knight = Knight(knightPosition);

  return {
    knight,
  };
};

export const knightMoves = (start: PositionType, end: PositionType) => {
  const knight = GameBoard(start).knight;

  const constructMovesGraph = (currentPosition: PositionType, endPosition: PositionType) => {
    // Initialize moves list
    const movesGraph = MovesGraph();

    // Initialize queue
    const queue: PositionType[] = [];

    // Initialize evaluated positions array
    const evaluated: PositionType[] = [];

    queue.push(currentPosition);

    while (queue.length !== 0) {
      let current = queue[0];

      movesGraph.addVertex(current);

      knight.position = current;

      const filteredLegalPositions = knight.legalMoves.filter(
        (legalPos) =>
          !queue.some((qPos) => equalPositions(qPos, legalPos)) &&
          !evaluated.some((ePos) => equalPositions(ePos, legalPos))
      );

      queue.push(...filteredLegalPositions);

      filteredLegalPositions.forEach((legalPos) => {
        movesGraph.addVertex(legalPos);
        movesGraph.addEdge(current, legalPos);
      });

      evaluated.push(current);
      queue.shift();

      // Break if the final position is evaluated
      if (hasPosition(evaluated, endPosition)) {
        break;
      }
    }

    return movesGraph;
  };

  const findShortestPathWithGraph = (startPosition: PositionType, endPosition: PositionType) => {
    const positionsGraph = constructMovesGraph(startPosition, endPosition);
    const paths: { [key: string]: PositionType[] } = {};

    paths[String(startPosition)] = [startPosition];
    const queue = [startPosition];

    while (queue.length > 0) {
      const position = queue.shift()!;

      const edges = positionsGraph.get(position)!;

      for (let i = 0; i < edges.length; i++) {
        const edgeKey = String(edges[i]);

        if (!paths[edgeKey]) {
          paths[edgeKey] = paths[String(position)].concat([edges[i]]);

          queue.push(edges[i]);
        }
      }

      if (paths[String(endPosition)]) {
        break;
      }
    }

    return paths[String(endPosition)];
  };

  const findShortestPathWithoutGraph = (startPosition: PositionType, endPosition: PositionType) => {
    const paths: { [key: string]: PositionType[] } = {};
    const queue = [startPosition];

    paths[String(startPosition)] = [startPosition];

    while (queue.length > 0 || !paths[String(endPosition)]) {
      const position = queue.shift()!;

      const legalMoves = Knight(position).legalMoves;

      for (let i = 0; i < legalMoves.length; i++) {
        const move = legalMoves[i];
        const moveKey = String(move);

        if (!paths[moveKey]) {
          paths[moveKey] = paths[String(position)].concat([move]);
          queue.push(move);
        }
      }
    }

    return paths[String(endPosition)];
  };

  return findShortestPathWithoutGraph(start, end);
};
