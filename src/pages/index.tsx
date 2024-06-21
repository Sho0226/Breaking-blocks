import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './index.module.css';

type Block = {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
};

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paddleX, setPaddleX] = useState((1200 - 75) / 2);
  const [ballX, setBallX] = useState(400);
  const [ballY, setBallY] = useState(300);
  const [ballDX, setBallDX] = useState(2);
  const [ballDY, setBallDY] = useState(2);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // 一時停止状態を管理するステート
  const paddleWidth = 75;
  const paddleHeight = 10;
  const canvasHeight = 600;
  const canvasWidth = 1280;
  const ballRadius = 10;

  const initializeGame = useCallback(() => {
    setPaddleX((canvasWidth - paddleWidth) / 2);
    setBallX(400);
    setBallY(300);
    setBallDX(2);
    setBallDY(2);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);

    const rows = 5;
    const cols = 13;
    const blockWidth = 84;
    const blockHeight = 20;
    const padding = 10;
    const offsetTop = 30;
    const offsetLeft = 35;

    const initialBlocks: Block[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * (blockWidth + padding) + offsetLeft;
        const y = row * (blockHeight + padding) + offsetTop;
        initialBlocks.push({ x, y, width: blockWidth, height: blockHeight, visible: true });
      }
    }
    setBlocks(initialBlocks);
  }, [canvasWidth, paddleWidth]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setPaddleX((c) => Math.max(c - 20, 0));
      } else if (event.key === 'ArrowRight') {
        setPaddleX((c) => Math.min(c + 20, canvasWidth - paddleWidth));
      } else if (event.key === ' ') {
        setIsPaused((prev) => !prev); // スペースキーで一時停止/再開を切り替え
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvasWidth, paddleWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && !gameOver && !gameWon && !isPaused) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const interval = setInterval(() => {
          setBallX((c) => {
            let newX = c + ballDX;
            if (newX > canvasWidth - ballRadius || newX < ballRadius) {
              setBallDX(-ballDX);
              newX = c + ballDX;
            }
            return newX;
          });

          setBallY((c) => {
            let newY = c + ballDY;
            if (newY < ballRadius) {
              setBallDY(-ballDY);
              newY = c + ballDY;
            } else if (newY > canvasHeight - ballRadius) {
              if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                setBallDY(-ballDY);
                newY = c + ballDY;
              } else {
                clearInterval(interval);
                setGameOver(true);
                alert('Game Over');
                initializeGame(); // ゲームオーバー時にリセット
              }
            }
            return newY;
          });

          // ブロックとの衝突判定
          setBlocks((prevBlocks) =>
            prevBlocks.map((block) => {
              if (block.visible) {
                if (
                  ballX > block.x &&
                  ballX < block.x + block.width &&
                  ballY > block.y &&
                  ballY < block.y + block.height
                ) {
                  setBallDY(-ballDY);
                  setScore((prevScore) => prevScore + 10);
                  return { ...block, visible: false };
                }
              }
              return block;
            }),
          );

          // 勝利条件のチェック
          if (blocks.every((block) => !block.visible)) {
            clearInterval(interval);
            setGameWon(true);
            alert('You Win!');
            initializeGame(); // ゲームクリア時にもリセット
          }

          ctx.clearRect(0, 0, canvasWidth, canvasHeight);

          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = 'white';
          ctx.fillRect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);

          ctx.beginPath();
          ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
          ctx.closePath();

          // スコアを表示
          ctx.fillStyle = 'white';
          ctx.font = '16px Arial';
          ctx.fillText(`Score: ${score}`, 8, 20);

          // ブロックを描画
          blocks.forEach((block) => {
            if (block.visible) {
              ctx.fillStyle = 'blue';
              ctx.fillRect(block.x, block.y, block.width, block.height);
            }
          });
        }, 10);

        return () => clearInterval(interval);
      }
    }
  }, [
    ballX,
    ballY,
    ballDX,
    ballDY,
    paddleX,
    canvasWidth,
    canvasHeight,
    paddleWidth,
    paddleHeight,
    ballRadius,
    blocks,
    gameOver,
    gameWon,
    score,
    initializeGame,
    isPaused, // isPaused を依存配列に追加
  ]);

  return (
    <div className="Home">
      <canvas ref={canvasRef} width={1280} height={600} className={styles.canvas} />
      {isPaused && <div className={styles.overlay}>Paused</div>} {/* 一時停止中に表示 */}
    </div>
  );
};

export default Home;
