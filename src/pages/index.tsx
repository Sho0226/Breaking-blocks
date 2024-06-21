import { useEffect, useRef } from 'react';
import styles from './index.module.css';

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);
  return (
    <div className="Home">
      <canvas ref={canvasRef} width={800} height={600} className={styles.canvas} />
    </div>
  );
};

export default Home;
