import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const initialBoard = [
  [0, -1, 0, -1, 0, -1, 0, -1],
  [-1, 0, -1, 0, -1, 0, -1, 0],
  [0, -1, 0, -1, 0, -1, 0, -1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
];

//-1 blue, 1 black

const Occupied = ({ rowIndex, colIndex, board }) => {
  const [state, setState] = useState("empty");
  const value = board[rowIndex][colIndex];
  useEffect(() => {
    if (value > 0) {
      setState("whitePiece");
    } else if (value < 0) {
      setState("bluePiece");
    } else {
      setState("empty");
    }
  }, [board]);
  return (
    <>
      {state === "empty" ? (
        <></>
      ) : (
        <div className={state}>
          {(value === 2 || value === -2) && <div className="king">K</div>}
        </div>
      )}
    </>
  );
};

const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [player, setPlayer] = useState(-1);
  const [selectedPiece, setSelectedPiece] = useState([]);
  const [nextMove, setNextMove] = useState([]);
  const [lockPiece, setLockPiece] = useState([]);

  const selectNextRow = (rowIndex, colIndex, tempNextMove) => {
    const nextRow = board[rowIndex + 1];
    //left select
    if (nextRow && nextRow[colIndex - 1] === 0) {
      tempNextMove = [...tempNextMove, [rowIndex + 1, colIndex - 1]];
    }
    //right select
    if (nextRow && nextRow[colIndex + 1] === 0) {
      tempNextMove = [...tempNextMove, [rowIndex + 1, colIndex + 1]];
    }
    return tempNextMove;
  };

  const selectPreviousRow = (rowIndex, colIndex, tempNextMove) => {
    const previousRow = board[rowIndex - 1];
    if (previousRow && previousRow[colIndex - 1] === 0) {
      tempNextMove = [...tempNextMove, [rowIndex - 1, colIndex - 1]];
    }
    if (previousRow && previousRow[colIndex + 1] === 0) {
      tempNextMove = [...tempNextMove, [rowIndex - 1, colIndex + 1]];
    }
    return tempNextMove;
  };

  const selectSecondNextRow = (rowIndex, colIndex, tempNextMove) => {
    const nextRow = board[rowIndex + 1];
    const secondNextRow = board[rowIndex + 2];
    if (player === -1) {
      if (
        nextRow &&
        (nextRow[colIndex - 1] === 1 ||nextRow[colIndex - 1] === 2 )&&
        secondNextRow &&
        secondNextRow[colIndex - 2] === 0
      ) {
        tempNextMove = [...tempNextMove, [rowIndex + 2, colIndex - 2]];
      } else if (
        nextRow &&
        (nextRow[colIndex + 1] === 1 ||nextRow[colIndex + 1] === 2) &&
        secondNextRow &&
        secondNextRow[colIndex + 2] === 0
      ) {
        tempNextMove = [...tempNextMove, [rowIndex + 2, colIndex + 2]];
      }
    }
    if (player === 1) {
      if (
        nextRow &&
        (nextRow[colIndex - 1] === -1 ||nextRow[colIndex - 1] === -2) &&
        secondNextRow &&
        secondNextRow[colIndex - 2] === 0
      ) {
        tempNextMove = [...tempNextMove, [rowIndex + 2, colIndex - 2]];
      } else if (
        nextRow &&
        (nextRow[colIndex + 1] === -1|| nextRow[colIndex + 1] === -2) &&
        secondNextRow &&
        secondNextRow[colIndex + 2] === 0
      ) {
        tempNextMove = [...tempNextMove, [rowIndex + 2, colIndex + 2]];
      }
    }
    return tempNextMove;
  };

  const selectSecondPreviousRow = (rowIndex, colIndex, tempNextMove) => {
    const previousRow = board[rowIndex - 1];
    const secondPrevioustRow = board[rowIndex - 2];
    if (player === -1) {
      if (
        previousRow &&
        (previousRow[colIndex - 1] === 1 ||previousRow[colIndex - 1] === 2) &&
        secondPrevioustRow &&
        secondPrevioustRow[colIndex - 2] === 0
      ) {
        tempNextMove = [...tempNextMove, [rowIndex - 2, colIndex - 2]];
      } else if (
        previousRow &&
        (previousRow[colIndex + 1] === 1 || previousRow[colIndex + 1] === 2) &&
        secondPrevioustRow &&
        secondPrevioustRow[colIndex + 2] === 0
      ) {
        tempNextMove = [...tempNextMove, [rowIndex - 2, colIndex + 2]];
      }
    }
    if (player === 1) {
      if (
        previousRow &&
        (previousRow[colIndex - 1] === -1 || previousRow[colIndex - 1] === -2) &&
        secondPrevioustRow &&
        secondPrevioustRow[colIndex - 2] === 0
      ) {
        tempNextMove = [...tempNextMove, [rowIndex - 2, colIndex - 2]];
      } else if (
        previousRow &&
        (previousRow[colIndex + 1] === -1 || previousRow[colIndex + 1] === -2 )  &&
        secondPrevioustRow &&
        secondPrevioustRow[colIndex + 2] === 0
      ) {
        tempNextMove = [...tempNextMove, [rowIndex - 2, colIndex + 2]];
      }
    }
    return tempNextMove;
  };

  const selectToMove = (i, j) => {
    //-1 blue, 1 black
    let tempNextMove = [];
    const currentValue = board[i][j];
    if (player === -1 && currentValue === -1) {
      tempNextMove = selectSecondNextRow(i, j, tempNextMove);
      if (tempNextMove.length === 0)
        tempNextMove = selectNextRow(i, j, tempNextMove);
    } else if (player === 1 && currentValue === 1) {
      tempNextMove = selectSecondPreviousRow(i, j, tempNextMove);
      if (tempNextMove.length === 0)
        tempNextMove = selectPreviousRow(i, j, tempNextMove);
    } else if (
      (player === -1 && currentValue === -2) ||
      (player === 1 && currentValue === 2)
    ) {
      tempNextMove = selectSecondNextRow(i, j, tempNextMove);
      tempNextMove = selectSecondPreviousRow(i, j, tempNextMove);
      if (tempNextMove.length === 0) {
        tempNextMove = selectNextRow(i, j, tempNextMove);
        tempNextMove = selectPreviousRow(i, j, tempNextMove);
      }
    }

    if (tempNextMove.length > 0) {
      setSelectedPiece([i, j]);
      setNextMove(tempNextMove);
    }
  };

  const isNextMove = (i, j) => {
    const current = JSON.stringify([i, j]);
    const index = JSON.stringify(nextMove).indexOf(current);
    return index !== -1;
  };

  const isKing = () => {
    const itrateCol = (rowIndex) => {
      const tempBoard = [...board];
      let colIndex = 0;
      while (colIndex <= 7) {
        let value = tempBoard[rowIndex][colIndex];
        if (rowIndex === 0 && value === 1) {
          tempBoard[rowIndex][colIndex] = 2;
        } else if (rowIndex === 7 && value === -1) {
          tempBoard[rowIndex][colIndex] = -2;
        }
        colIndex++;
      }
      setBoard(tempBoard);
    };
    itrateCol(0);
    itrateCol(7);
  };

  useEffect(() => {
    isKing();
  }, [player]);

  const isLockPiece = (i, j) => {
    const current = JSON.stringify([i, j]);
    const index = JSON.stringify(lockPiece).indexOf(current);
    return index !== -1;
  };

  const isSelctedPiece = (i, j) => {
    const current = JSON.stringify([i, j]);
    const index = JSON.stringify(selectedPiece).indexOf(current);
    return index !== -1;
  };

  const move = (i, j) => {
    if (selectedPiece.length > 0 && nextMove.length > 0) {
      let tempBoard = [...board];
      let againMove = false;
      if (i - selectedPiece[0] === 2) {
        //blue
        if (j - selectedPiece[1] === 2) {
          tempBoard[selectedPiece[0] + 1][selectedPiece[1] + 1] = 0;
          againMove = true;
        } else {
          tempBoard[selectedPiece[0] + 1][selectedPiece[1] - 1] = 0;
          againMove = true;
        }
      } else if (i - selectedPiece[0] === -2) {
        //white
        if (j - selectedPiece[1] === -2) {
          tempBoard[selectedPiece[0] - 1][selectedPiece[1] - 1] = 0;
          againMove = true;
        } else {
          tempBoard[selectedPiece[0] - 1][selectedPiece[1] + 1] = 0;
          againMove = true;
        }
      }
      const temp = tempBoard[selectedPiece[0]][selectedPiece[1]];
      tempBoard[selectedPiece[0]][selectedPiece[1]] = 0;
      tempBoard[i][j] = temp;
      setBoard(tempBoard);
      setSelectedPiece([]);
      setNextMove([]);
      if (againMove) {
        whenMoveDone(i, j);
      } else {
        setPlayer(player === 1 ? -1 : 1);
      }
      lockedPiece();
    }
  };

  const whenMoveDone = (i, j) => {
    const currentValue = board[i][j];
    if (player === -1) {
      //blue move
      if (
        currentValue === -1 &&
        ((board[i + 1] &&
          (board[i + 1][j - 1] === 1 || board[i + 1][j - 1] === 2) &&
          board[i + 2] &&
          board[i + 2][j - 2] === 0) ||
          (board[i + 1] &&
            (board[i + 1][j + 1] === 1 || board[i + 1][j + 1] === 2) &&
            board[i + 2] &&
            board[i + 2][j + 2] === 0))
      ) {
        selectToMove(i, j);
      } else if (
        currentValue === -2 &&
        ((board[i + 1] &&
          (board[i + 1][j - 1] === 1 || board[i + 1][j - 1] === 2) &&
          board[i + 2] &&
          board[i + 2][j - 2] === 0) ||
          (board[i + 1] &&
            (board[i + 1][j + 1] === 1 || board[i + 1][j + 1] === 2) &&
            board[i + 2] &&
            board[i + 2][j + 2] === 0) ||
          (board[i - 1] &&
            (board[i - 1][j - 1] === 1 || board[i - 1][j - 1] === 2) &&
            board[i - 2] &&
            board[i - 2][j - 2] === 0) ||
          (board[i - 1] &&
            (board[i - 1][j + 1] === 1 || board[i - 1][j + 1] === 2) &&
            board[i + 2] &&
            board[i - 2][j - 2] === 0))
      ) {
        selectToMove(i, j);
      } else {
        setPlayer(1);
      }
    }
    if (player === 1) {
      //white move
      if (
        currentValue === 1 &&
        ((board[i - 1] &&
          (board[i - 1][j + 1] === -1 || board[i - 1][j + 1] === -2) &&
          board[i - 2] &&
          board[i - 2][j + 2] === 0) ||
          (board[i - 1] &&
            (board[i - 1][j - 1] === -1 || board[i - 1][j - 1] === -2) &&
            board[i - 2] &&
            board[i - 2][j - 2] === 0))
      ) {
        selectToMove(i, j);
      } else if (
        currentValue === 2 &&
        ((board[i + 1] &&
          (board[i + 1][j - 1] === -1 || board[i + 1][j - 1] === -2) &&
          board[i + 2] &&
          board[i + 2][j - 2] === 0) ||
          (board[i + 1] &&
            (board[i + 1][j + 1] === -1 || board[i + 1][j + 1] === -2) &&
            board[i + 2] &&
            board[i + 2][j + 2] === 0) ||
          (board[i - 1] &&
            (board[i - 1][j - 1] === -1 || board[i - 1][j - 1] === -2) &&
            board[i - 2] &&
            board[i - 2][j - 2] === 0) ||
          (board[i - 1] &&
            (board[i - 1][j + 1] === -1 || board[i - 1][j + 1] === -2) &&
            board[i + 2] &&
            board[i - 2][j - 2] === 0))
      ) {
        selectToMove(i, j);
      } else {
        setPlayer(-1);
      }
    }
  };

  const lockedPiece = () => {
    let i = 0;
    let tempLock = [];
    while (i <= 7) {
      let j = 0;
      while (j <= 7) {
        const currentValue = board[i][j];
        if (currentValue !== 0) {
          if (player === 1 && currentValue == -1) {
            if (
              board[i + 1] &&
              (board[i + 1][j - 1] === 1 || board[i + 1][j - 1] === 2) &&
              board[i + 2] &&
              board[i + 2][j - 2] === 0
            ) {
              tempLock = [...tempLock, [i, j]];
            } else if (
              board[i + 1] &&
              (board[i + 1][j + 1] === 1 || board[i + 1][j + 1] === 2) &&
              board[i + 2] &&
              board[i + 2][j + 2] === 0
            ) {
              tempLock = [...tempLock, [i, j]];
            }
          }
          if (player === -1 && currentValue === 1) {
            if (
              board[i - 1] &&
              (board[i - 1][j + 1] === -1 || board[i - 1][j + 1] === -2) &&
              board[i - 2] &&
              board[i - 2][j + 2] === 0
            ) {
              tempLock = [...tempLock, [i, j]];
            } else if (
              board[i - 1] &&
              (board[i - 1][j - 1] === -1 || board[i - 1][j - 1] === -2) &&
              board[i - 2] &&
              board[i - 2][j - 2] === 0
            ) {
              tempLock = [...tempLock, [i, j]];
            }
          }
          if (player === 1 && currentValue === -2) {
            if (
              (board[i + 1] &&
                (board[i + 1][j - 1] === 1 || board[i + 1][j - 1] === 2) &&
                board[i + 2] &&
                board[i + 2][j - 2] === 0) ||
              (board[i + 1] &&
                (board[i + 1][j + 1] === 1 || board[i + 1][j + 1] === 2) &&
                board[i + 2] &&
                board[i + 2][j + 2] === 0) ||
              (board[i - 1] &&
                (board[i - 1][j - 1] === 1 || board[i - 1][j - 1] === 2) &&
                board[i - 2] &&
                board[i - 2][j - 2] === 0) ||
              (board[i - 1] &&
                (board[i - 1][j + 1] === 1 || board[i - 1][j + 1] === 2) &&
                board[i - 2] &&
                board[i - 2][j + 2] === 0)
            ) {
              tempLock = [...tempLock, [i, j]];
            }
          }
          if (player === -1 && currentValue === 2) {
            if (
              (board[i + 1] &&
                (board[i + 1][j - 1] === -1 || board[i + 1][j - 1] === -2) &&
                board[i + 2] &&
                board[i + 2][j - 2] === 0) ||
              (board[i + 1] &&
                (board[i + 1][j + 1] === -1 || board[i + 1][j + 1] === -2) &&
                board[i + 2] &&
                board[i + 2][j + 2] === 0) ||
              (board[i - 1] &&
                (board[i - 1][j - 1] === -1 || board[i - 1][j - 1] === -2) &&
                board[i - 2] &&
                board[i - 2][j - 2] === 0) ||
              (board[i - 1] &&
                (board[i - 1][j + 1] === -1 || board[i - 1][j + 1] === -2) &&
                board[i - 2] &&
                board[i - 2][j + 2] === 0)
            ) {
              tempLock = [...tempLock, [i, j]];
            }
          }
        }
        j++;
      }

      i++;
    }
    setLockPiece(tempLock);
  };

  const handleColClick = (rowIndex, colIndex) => {
    if (isNextMove(rowIndex, colIndex)) {
      move(rowIndex, colIndex);
    } else {
      const tempLock = [...lockPiece];
      if (tempLock.toString().includes([rowIndex, colIndex].toString())) {
        selectToMove(rowIndex, colIndex);
      } else {
        if (lockPiece.length === 0) selectToMove(rowIndex, colIndex);
      }
    }
  };

  return (
    <div className="main">
      <h1>{player === -1 ? "Blue Turn" : "White Turn"}</h1>
      <div className="box">
        {board.map((row, rowIndex) => (
          <div className="row">
            {row.map((col, colIndex) => {
              return (
                <>
                  {rowIndex % 2 === 0 ? (
                    <>
                      {colIndex % 2 === 0 ? (
                        <div
                          className={`whiteCol ${
                            isNextMove(rowIndex, colIndex) ? "nextMove" : ""
                          } ${
                            isLockPiece(rowIndex, colIndex) ? "lockPiece" : ""
                          } ${
                            isSelctedPiece(rowIndex, colIndex)
                              ? "selectedPiece"
                              : ""
                          }`}
                          onClick={() => handleColClick(rowIndex, colIndex)}
                        >
                          <Occupied
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            board={board}
                          />
                        </div>
                      ) : (
                        <div
                          className={`greyCol ${
                            isNextMove(rowIndex, colIndex) ? "nextMove" : ""
                          }  ${
                            isLockPiece(rowIndex, colIndex) ? "lockPiece" : ""
                          } ${
                            isSelctedPiece(rowIndex, colIndex)
                              ? "selectedPiece"
                              : ""
                          }`}
                          onClick={() => handleColClick(rowIndex, colIndex)}
                        >
                          <Occupied
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            board={board}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {colIndex % 2 === 1 ? (
                        <div
                          className={`whiteCol ${
                            isNextMove(rowIndex, colIndex) ? "nextMove" : ""
                          }  ${
                            isLockPiece(rowIndex, colIndex) ? "lockPiece" : ""
                          } ${
                            isSelctedPiece(rowIndex, colIndex)
                              ? "selectedPiece"
                              : ""
                          }`}
                          onClick={() => handleColClick(rowIndex, colIndex)}
                        >
                          <Occupied
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            board={board}
                          />
                        </div>
                      ) : (
                        <div
                          className={`greyCol ${
                            isNextMove(rowIndex, colIndex) ? "nextMove" : ""
                          } ${
                            isLockPiece(rowIndex, colIndex) ? "lockPiece" : ""
                          } ${
                            isSelctedPiece(rowIndex, colIndex)
                              ? "selectedPiece"
                              : ""
                          }`}
                          onClick={() => handleColClick(rowIndex, colIndex)}
                        >
                          <Occupied
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            board={board}
                          />
                        </div>
                      )}
                    </>
                  )}
                </>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
