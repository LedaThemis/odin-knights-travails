type BoardCoordinate = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type PositionType = [BoardCoordinate, BoardCoordinate];

const equalPositions = (a: PositionType, b: PositionType) => a[0] === b[0] && a[1] === b[1];

const hasDuplicates = (arr: PositionType[]) => {
  for (let i = 0; i < arr.length; i++) {
    const newArr = arr.slice(0, i).concat(arr.slice(i + 1));

    for (let j = 0; j < newArr.length; j++) {
      if (equalPositions(arr[i], newArr[j])) {
        return true;
      }
    }
  }

  return false;
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

  const outOfRange = (num: number) => num < 0 || num > 9;

  const getLegalMoves = (moves: number[][]) => {
    return moves.filter(([x, y]) => !(outOfRange(x) || outOfRange(y))) as PositionType[];
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

export const GameBoard = (knightPosition: PositionType, finalPosition: PositionType) => {
  const knight = Knight(knightPosition);

  const findMoves = (currentPosition: PositionType, endPosition: PositionType): PositionType[] => {
    // Initialize moves list
    const movesList: PositionType[][] = [];

    const inner = (currentPosition: PositionType, endPosition: PositionType, movesSoFar: PositionType[]) => {
      // Break if there are duplicate moves or if maximum depth is reached
      if (hasDuplicates(movesSoFar) || movesSoFar.length >= 8) {
        return [];
      }

      if (equalPositions(currentPosition, endPosition)) {
        return movesSoFar.concat([currentPosition]);
      } else {
        knight.position = currentPosition;
        const legalMoves = knight.legalMoves;

        for (let i = 0; i < legalMoves.length; i++) {
          const moves = inner(legalMoves[i], endPosition, movesSoFar.concat([currentPosition]));

          if (Array.isArray(moves) && moves.length > 0 && equalPositions(moves[moves.length - 1], endPosition)) {
            movesList.push(moves);
          }
        }
      }
    };

    inner(currentPosition, endPosition, []);

    console.log(movesList);

    return movesList.reduce((a, b) => (a.length < b.length ? a : b));
  };

  console.log(findMoves(knight.position, finalPosition));
};

const knightMoves = (start: PositionType, end: PositionType) => {
  const gameBoard = GameBoard(start, end);
};

knightMoves([0, 0], [6, 7]);
