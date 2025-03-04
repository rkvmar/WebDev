import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const boardSize = 20;
  const totalTiles = boardSize * boardSize;
  const redTilesCount = 10
  const [game, setGame] = useState([]);
  const [snake, setSnake] = useState([[0, 4]]);
  const [direction, setDirection] = useState('down');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowUp' && direction !== 'down') {
        setDirection('up');
      } else if (event.key === 'ArrowDown' && direction !== 'up') {
        setDirection('down');
      } else if (event.key === 'ArrowLeft' && direction !== 'right') {
        setDirection('left');
      } else if (event.key === 'ArrowRight' && direction !== 'left') {
        setDirection('right');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [direction]);

  useEffect(() => {
    const initializeGame = () => {
      const newGame = Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => 'green')
      );

      let redTilesPlaced = 0;
      while (redTilesPlaced < redTilesCount) {
        const x = Math.floor(Math.random() * boardSize);
        const y = Math.floor(Math.random() * boardSize);
        if (newGame[x][y] === 'green') {
          newGame[x][y] = 'red';
          redTilesPlaced++;
        }
      }

      setGame(newGame);
    };

    initializeGame();
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const updateGame = () => {
      let newSnake = [...snake];
      let head = [...newSnake[0]];

      if (direction === 'down') {
        head[0] += 1;
      } else if (direction === 'up') {
        head[0] -= 1;
      } else if (direction === 'left') {
        head[1] -= 1;
      } else if (direction === 'right') {
        head[1] += 1;
      }

      if (head[0] < 0 || head[0] >= boardSize || head[1] < 0 || head[1] >= boardSize) {
        setGameOver(true);
        return;
      }

      if (game[head[0]][head[1]] === 'red') {
        setScore(score + 1);
        newSnake = [head, ...newSnake];
        let newRedTilePlaced = false;
        while (!newRedTilePlaced) {
          const x = Math.floor(Math.random() * boardSize);
          const y = Math.floor(Math.random() * boardSize);
          if (game[x][y] === 'green') {
            game[x][y] = 'red';
            newRedTilePlaced = true;
          }
        }
      } else if (game[head[0]][head[1]] === 'blue') {
        setGameOver(true);
        return;
      } else {
        newSnake = [head, ...newSnake.slice(0, -1)];
      }

      setSnake(newSnake);

      const newGame = game.map(row => row.slice());
      newGame.forEach(row => row.forEach((cell, index, row) => row[index] = cell === 'blue' ? 'green' : cell));

      newSnake.forEach(([x, y]) => {
        newGame[x][y] = 'blue';
      });

      setGame(newGame);
    };

    const interval = setInterval(updateGame, 350);
    return () => clearInterval(interval);
  }, [snake, direction, game, score, gameOver]);

  return (
    <div>
      {gameOver ? (
        <p>Game Over! Your score: {score}</p>
      ) : (
        <>
          <p>Score: {score}</p>
          <div className="game">
            {game.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((item, colIndex) => (
                  <span className={`cell ${item}`} key={colIndex}></span>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
