import React, { useCallback, useEffect, useRef, useState } from 'react';

interface CanvasProps {
    width?: number;
    height?: number;
}

type Coordinate = {
    x: number;
    y: number;
};

export const MapView = ({ width, height }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);
    const [newMousePositionX, setNewMousePositionX] = useState<number>(0);
    const [newMousePositionY, setNewMousePositionY] = useState<number>(0);
    const [mousePointCounter, setMousePointCounter] = useState<number>(0);


    const startPaint = useCallback((event: MouseEvent) => {
        const coordinates = getCoordinates(event);
   
        if (coordinates) {
            // setMousePointCounter(mousePointCounter + 1);
            setMousePosition(coordinates);
            setIsPainting(true);
        }
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);
        return () => {
            canvas.removeEventListener('mousedown', startPaint);
        };
    }, [startPaint]);

    const paint = useCallback(
        (event: MouseEvent) => {
            if (isPainting) {
                const newMousePosition = getCoordinates(event);
                if (mousePosition && newMousePosition) {
                    drawLine(mousePosition, newMousePosition);
                    setMousePosition(newMousePosition);
                }
            }
        },
        [isPainting, mousePosition]
    );

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousemove', paint);
        return () => {
            canvas.removeEventListener('mousemove', paint);
        };
    }, [paint]);

    const exitPaint = useCallback(() => {
        setIsPainting(false);
        setMousePosition(undefined);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mouseup', exitPaint);
        canvas.addEventListener('mouseleave', exitPaint);
        return () => {
            canvas.removeEventListener('mouseup', exitPaint);
            canvas.removeEventListener('mouseleave', exitPaint);
        };
    }, [exitPaint]);

    const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
        if (!canvasRef.current) {
            return;
        }

        const canvas: HTMLCanvasElement = canvasRef.current;
        return { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop };
    };

    const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
        if (!canvasRef.current) {
            return;
        }

        console.log(originalMousePosition);

        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.strokeStyle = 'black';
            context.lineJoin = 'round';
            context.lineWidth = 5;

            if(newMousePositionX === 0 && newMousePositionY === 0) {
                setNewMousePositionX(newMousePosition.x);
                setNewMousePositionY(newMousePosition.y);
                return;
            }

            context.beginPath();
            context.moveTo(newMousePositionX, newMousePositionY);
            context.lineTo(newMousePosition.x, newMousePosition.y);
            context.moveTo(newMousePositionX + 100, newMousePositionY);
            context.lineTo(newMousePosition.x + 100, newMousePosition.y);
            
            context.closePath();
            
            context.stroke();
        }
        setNewMousePositionX(newMousePosition.x);
        setNewMousePositionY(newMousePosition.y);
    };

    return <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth} />;
};


