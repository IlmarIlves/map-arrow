import React, { useCallback, useEffect, useRef, useState } from 'react';


export const Arrow = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [previousX, setPreviousX] = useState<number>(0);
    const [previousY, setPreviousY] = useState<number>(0);


    useEffect(() => {
        drawLine();
    }, []);

    const drawLine = () => {
        if (!canvasRef.current) {
            return;
        }

        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            context.strokeStyle = 'black';
            context.lineJoin = 'round';
            context.lineWidth = 5;

            const randomPointsCount = Math.floor(Math.random() * (5 - 3) + 3);

            let previousX = 0;
            let previousY = 0;

            for (let i= 0; i<=randomPointsCount; i++) {
              const x = Math.floor(Math.random() * (window.innerWidth / randomPointsCount));
              const y = Math.floor(Math.random() * (window.innerHeight / randomPointsCount));
              
              context.beginPath();
              context.moveTo(previousX, previousY);
              context.lineTo(x , y);
              context.moveTo(previousX + 100, previousY);
              context.lineTo(x + 100, y);
              
              context.stroke();

              previousX = x;
              previousY = y;
  
            }
            context.beginPath();

            context.moveTo(previousX, previousY);
            context.lineTo(previousX - 20, previousY + 20);

            context.stroke();

        }
    };

    return <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth} />;
};


