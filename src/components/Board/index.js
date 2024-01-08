import { useEffect, useRef, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
const Board = () => {
  const canvasRef = useRef(null);
  const shouldDrow = useRef(false);
  const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);

  const { color, size } = useSelector((state) => state.toolbox[activeMenuItem]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const changeConfig = () => {
      context.strokeStyle = color;
      context.lineWidth = size;
    };

    changeConfig();
  }, [color, size]);

  //because both useEffect are overlapping so whenever
  //canvas width and height changes it looses their strokeStyle and lineWidth
  //so we have to run mounting useEffect before above useEffect
  //so for that we are using here useLayoutEffect.
  //useLayoutEffect runs before the actual paint happens on the screen
  //use full in the cases where we have to calculate particular
  //height and width of element.
  //Mount before browser paint
  //After select paint useEffect will run.

  //mount side
  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    //when mounting just make sure that
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const beginPath = (x, y) => {
      context.beginPath();
      context.moveTo(x, y);
    };

    const handleMouseDown = (e) => {
      shouldDrow.current = true;
      beginPath(e.clientX, e.clientY);
    };
    const drawLine = (x, y) => {
      context.lineTo(x, y);
      context.stroke();
    };
    const handleMouseMove = (e) => {
      if (!shouldDrow.current) return;
      drawLine(e.clientX, e.clientY);
    };
    const handleMouseUp = (e) => {
      shouldDrow.current = false;
    };

    //For example
    // context.beginPath();
    // context.moveTo(0, 0);
    // context.lineTo(100, 100);
    // context.stroke();

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  console.log(color, size);
  return <canvas ref={canvasRef}></canvas>;
};
export default Board;
