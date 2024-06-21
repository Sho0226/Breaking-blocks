import { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paddleX, setPaddleX] = useState((800 - 75) / 2);
  const paddleWidth = 75;
  const paddleHeight = 10;
  const canvasHeight = 600;
  const canvasWidth = 800;

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
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.fillRect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
      }
    }
  }, [paddleX]);
  return (
    <div className="Home">
      <canvas ref={canvasRef} width={800} height={600} className={styles.canvas} />
    </div>
  );
};

export default Home;
