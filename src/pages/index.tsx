import { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paddleX, setPaddleX] = useState((800 - 75) / 2);
  const [ballX, setBallX] = useState(400);
  const [ballY, setBallY] = useState(300);
  const [ballDX, setBallDX] = useState(2);
  const [ballDY, setBallDY] = useState(2);
  const paddleWidth = 75;
  const paddleHeight = 10;
  const canvasHeight = 600;
  const canvasWidth = 800;
  const ballRadius = 10;

  useEffect(() => {
    const handlekeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setPaddleX((c) => Math.max(c - 20, 0));
      } else if (event.key === 'ArrowRight') {
        setPaddleX((c) => Math.min(c + 20, canvasWidth - paddleWidth));
      }
    };

    window.addEventListener('keydown', handlekeyDown);

    return () => {
      window.removeEventListener('keydown', handlekeyDown);
    };
  }, [canvasWidth, paddleWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas?.getContext('2d');
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
                alert('Game Over');
              }
            }
            return newY;
          });

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
  ]);

  return (
    <div className="Home">
      <canvas ref={canvasRef} width={800} height={600} className={styles.canvas} />
    </div>
  );
};

export default Home;
