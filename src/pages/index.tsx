import { useEffect, useState } from 'react';
import boards from './board.module.scss';
import styles from './index.module.scss';

const Home = () => {
  // -1は初回検知用
  const [userInputs, setUserInputs] = useState<(0 | 1 | 2 | 3)[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const bombCount = 10;
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const board: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const directions: number[][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ];

  bombMap.forEach((row, y) => {
    row.forEach((bomb, x) => {
      if (bomb === 1) {
        //ボードに爆弾設置
        board[y][x] = 11;

        for (const oneDir of directions) {
          try {
            if (board[y + oneDir[0]][x + oneDir[1]] < 8) {
              board[y + oneDir[0]][x + oneDir[1]]++;
            }
          } catch (error) {
            error;
          }
        }
      }
    });
  });

  //ユーザが白をひっくり返した時、0になっている隣接行列を再起的にひっくり返す
  //意図的に参照渡しにすることで末尾再帰で実現する
  const turnZero = (x: number, y: number) => {
    const visited = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const userInputData = JSON.parse(JSON.stringify(userInputs));

    const turnZeroInner = (x: number, y: number) => {
      if (y >= 0 && y < board.length) {
        if (x >= 0 && x < board[y].length) {
          if (visited[y][x] === 0) {
            visited[y][x] = 1;
            userInputData[y][x] = 1;

            if (board[y][x] === 0) {
              for (const oneCoord of directions) {
                turnZeroInner(x + oneCoord[0], y + oneCoord[1]);
              }
            }
          }
        }
      }
    };

    turnZeroInner(x, y);

    return userInputData;
  };

  // const [timer, setTimer] = useState(0);

  // const intervalRef = useRef(null);
  // const start = useCallback(() => {
  //   if(intervalRef.current !== null){
  //     return;
  //   }
  //   intervalRef.current = setInterval(() => {
  //     setTimer(c => c + 1)
  //   }, 1000)
  // }, [])

  let isGameOver = false;

  //ボムを踏んだ瞬間にゲームオーバーする処理
  userInputs.forEach((row, y) => {
    row.forEach((data, x) => {
      if (data === 1 && bombMap[y][x] === 1) {
        isGameOver = true;
      }
    });
  });

  let isGameClear = false;

  let gameClearCnt = 0;
  //ボムマス以外全て剥がしたらクリア判定を出す
  userInputs.forEach((row, y) => {
    row.forEach((data, x) => {
      if (data === 0 || data === 3) {
        gameClearCnt++;
      }
    });
  });
  if (gameClearCnt === bombCount) {
    isGameClear = true;
  }

  let flagCnt = bombCount;
  //7セグに表示するための旗をカウントする
  userInputs.forEach((row, y) => {
    row.forEach((data, x) => {
      if (data === 3) flagCnt--;
    });
  });

  /**
   * 盤面をリセットする関数
   */
  const resetBoard = () => {
    setUserInputs([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);

    setBombMap([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);

    setCount(0);
  };

  /**
   * クリックした時の処理
   * @param y y座標
   * @param x x座標
   */
  const clickStone = (y: number, x: number) => {
    const newUserInputBoard = JSON.parse(JSON.stringify(userInputs));

    //旗の場合は裏返せない
    if (newUserInputBoard[y][x] === 3) {
      return;
    }

    //ゲームオーバーとゲームクリア済みの場合は裏返せない
    if (isGameOver || isGameClear) {
      return;
    }

    //初回であればボムを配置
    const isPlaying = userInputs.some((row) => row.some((input) => input !== 0));
    if (!isPlaying) {
      const newBombMap = JSON.parse(JSON.stringify(bombMap));

      //衝突した時に増やすようにコピー
      let nowBombCount = bombCount;

      const willSetBombCoord: number[][] = [];

      for (let i = 0; i < nowBombCount; i++) {
        const newY = Math.floor(Math.random() * 9);
        const newX = Math.floor(Math.random() * 9);

        let isSetOk = true;
        for (const oneCoord of willSetBombCoord) {
          //衝突したら
          if ((oneCoord[0] === newY && oneCoord[1] === newX) || (newY === y && newX === x)) {
            isSetOk = false;
            nowBombCount++;
            break;
          }
        }

        if (isSetOk) willSetBombCoord.push([newY, newX]);
      }

      for (const oneNewBomb of willSetBombCoord) {
        newBombMap[oneNewBomb[0]][oneNewBomb[1]] = 1;
      }

      // setTimer(1);

      setBombMap(newBombMap);
      setCount(1);

      newBombMap.forEach((row: any[], y: number) => {
        row.forEach((bomb, x) => {
          if (bomb === 1) {
            //ボードに爆弾設置
            board[y][x] = 11;

            for (const oneDir of directions) {
              try {
                if (board[y + oneDir[0]][x + oneDir[1]] < 8) {
                  board[y + oneDir[0]][x + oneDir[1]]++;
                }
              } catch (error) {
                error;
              }
            }
          }
        });
      });

      if (board[y][x] === 0) {
        const autoTurnInputBoard: number[][] = turnZero(x, y);

        autoTurnInputBoard.forEach((row, y) => {
          row.forEach((t, x) => {
            if (t === 1) {
              newUserInputBoard[y][x] = 1;
            }
          });
        });
      }
    }

    newUserInputBoard[y][x] = 1;

    if (board[y][x] === 0 && isPlaying) {
      const autoTurnInputBoard: number[][] = turnZero(x, y);

      autoTurnInputBoard.forEach((row, y) => {
        row.forEach((t, x) => {
          if (t === 1) {
            newUserInputBoard[y][x] = 1;
          }
        });
      });
    }

    setUserInputs(newUserInputBoard);
  };

  /**
   * 旗を設置、削除する関数
   * @param y y座標
   * @param x x座標
   */
  const setFlag = (y: number, x: number) => {
    const newUserInputs = JSON.parse(JSON.stringify(userInputs));
    if (newUserInputs[y][x] === 0) {
      newUserInputs[y][x] = 3;
    } else if (newUserInputs[y][x] === 3) {
      newUserInputs[y][x] = 0;
    }

    setUserInputs(newUserInputs);
    return false;
  };

  const [count, setCount] = useState(0);

  useEffect(() => {
    const isPlaying = userInputs.some((row) => row.some((input) => input !== 0));
    if (isPlaying && !isGameOver) {
      const timer = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div className={styles.container}>
      <div className={boards.board}>
        <div className={boards.scoreboard}>
          <div className={`${boards.score} ${boards.flagNum}`} style={{ color: 'red' }}>
            {`00${flagCnt}`.slice(-3)}
          </div>
          <div
            className={boards.resetBtn}
            style={{
              backgroundPositionX: isGameOver ? '-547px' : isGameClear ? '-505px' : '-462px',
            }}
            onClick={() => resetBoard()}
          />
          <div className={`${boards.score} ${boards.flagNum}`} style={{ color: 'red' }}>
            {count}
          </div>
        </div>

        <div className={boards.cells}>
          {board.map((y, i) => {
            return y.map((x, j) => {
              return (
                <div
                  className={
                    userInputs[i][j] === 1 ? `${boards.cell} ${boards.clicked}` : `${boards.cell}`
                  }
                  key={`${i}-${j}`}
                  onClick={() => clickStone(i, j)}
                  onContextMenu={() => setFlag(i, j)}
                >
                  <div
                    className={boards.cellImg}
                    style={
                      userInputs[i][j] === 3
                        ? { backgroundPositionX: '-270px' }
                        : userInputs[i][j] === 1
                        ? bombMap[i][j] === 1
                          ? { backgroundPositionX: `${-(x * 30) + 30}px`, backgroundColor: 'red' }
                          : { backgroundPositionX: `${-(x * 30) + 30}px` }
                        : isGameOver
                        ? bombMap[i][j] === 1
                          ? { backgroundPositionX: '-300px' }
                          : { backgroundPositionX: `30px` }
                        : isGameClear
                        ? bombMap[i][j] === 1
                          ? { backgroundPositionX: '-270px' }
                          : { backgroundPositionX: `30px` }
                        : { backgroundPositionX: `30px` }
                    }
                  />
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
