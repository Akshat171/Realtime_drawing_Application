import { useEffect, useRef, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MENU_ITEMS } from "../constents";
import { actionItemClick } from "@/slice/menuSlice";
import { socket } from "@/socket";

//Main
const Board = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const drawHistory = useRef([]);
  const historyPointer = useRef(0);
  const shouldDraw = useRef(false);
  const { activeMenuItem, actionMenuItem } = useSelector((state) => state.menu);
  const { color, size } = useSelector((state) => state.toolbox[activeMenuItem]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const URL = canvas.toDataURL();
      const anchor = document.createElement("a");
      anchor.href = URL;
      anchor.download = "sketch.jpg";
      anchor.click();
    } else if (
      actionMenuItem === MENU_ITEMS.UNDO ||
      actionMenuItem === MENU_ITEMS.REDO
    ) {
      if (historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) {
        historyPointer.current -= 1;
      }
      if (
        historyPointer.current < drawHistory.current.length - 1 &&
        actionMenuItem === MENU_ITEMS.REDO
      ) {
        historyPointer.current += 1;
      }
      const imageData = drawHistory.current[historyPointer.current];
      context.putImageData(imageData, 0, 0);
    }
    dispatch(actionItemClick(null));
    // console.log("actionMenuItem", actionMenuItem);
  }, [actionMenuItem, dispatch]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const changeConfig = (color, size) => {
      context.strokeStyle = color;
      context.lineWidth = size;
    };

    const handleChange = (config) => {
      changeConfig(config.color, config.size);
    };

    changeConfig(color, size);
    socket.on("changeConfig", handleChange);

    return () => {
      socket.off("changeConfig", handleChange);
    };
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

    const drawLine = (x, y) => {
      context.lineTo(x, y);
      context.stroke();
    };

    const handleMouseDown = (e) => {
      shouldDraw.current = true;
      beginPath(
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY
      );
      socket.emit("beginPath", {
        x: e.clientX || e.touches[0].clientX,
        y: e.clientY || e.touches[0].clientY,
      });
    };

    const handleMouseMove = (e) => {
      if (!shouldDraw.current) return;
      drawLine(
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY
      );
      socket.emit("drawLine", {
        x: e.clientX || e.touches[0].clientX,
        y: e.clientY || e.touches[0].clientY,
      });
    };

    const handleMouseUp = (e) => {
      shouldDraw.current = false;
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      drawHistory.current.push(imageData);
      historyPointer.current = drawHistory.current.length - 1;
    };

    const handleBeginPath = (path) => {
      beginPath(path.x, path.y);
    };

    const handleDrawLine = (path) => {
      drawLine(path.x, path.y);
    };

    //For example
    // context.beginPath();
    // context.moveTo(0, 0);
    // context.lineTo(100, 100);
    // context.stroke();

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    canvas.addEventListener("touchstart", handleMouseDown);
    canvas.addEventListener("touchmove", handleMouseMove);
    canvas.addEventListener("touchend", handleMouseUp);

    socket.on("beginPath", handleBeginPath);
    socket.on("drawLine", handleDrawLine);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);

      canvas.removeEventListener("touchstart", handleMouseDown);
      canvas.removeEventListener("touchmove", handleMouseMove);
      canvas.removeEventListener("touchend", handleMouseUp);

      socket.off("beginPath", handleBeginPath);
      socket.off("drawLine", handleDrawLine);
    };
  }, []);

  console.log(color, size);
  return <canvas ref={canvasRef}></canvas>;
};
export default Board;
