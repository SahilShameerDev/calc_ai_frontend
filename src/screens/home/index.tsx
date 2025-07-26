import React, { useEffect, useRef, useState } from "react";
import { SWATCHES } from "../../../constants";
import { ColorSwatch, Group } from "@mantine/core";
import { Button } from "../../components/ui/button";
import axios from "axios";
import Draggable from "react-draggable";

interface Response {
  expr: string;
  result: string;
  assign: boolean;
}

interface GenerateResult {
  expression: string;
  answer: string;
}

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("rgba(255, 255, 255, 1)");
  const [reset, setReset] = useState(false);
  const [result, setResult] = useState<GenerateResult>();
  const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
  const [latexPosition, setLatexPosition] = useState({ x: 10, y: 20 });
  const [dictOfVars, setDictOfVars] = useState({});
  const [mathJaxReady, setMathJaxReady] = useState(false);
  const draggableRefs = useRef<React.RefObject<HTMLDivElement | null>[]>([]);

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setLatexExpression([]);
      setResult(undefined);
      setDictOfVars({});

      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    if (!result) return;
    renderLatexToCanvas(result.expression, result.answer);
  }, [result]);

  useEffect(() => {
    if (latexExpression.length > 0 && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      }, 100);
    }
  }, [latexExpression]);

  const sendData = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const response = await axios({
      method: "POST",
      url: `${import.meta.env.VITE_API_URL}/calculate`,
      data: {
        image: canvas.toDataURL("image/png"),
        dict_of_vars: dictOfVars,
      },
    });
    const resp = await response.data;
    resp.data.forEach((item: Response) => {
      if (item.assign) {
        setDictOfVars({ ...dictOfVars, [item.expr]: item.result });
      }
    });
    const ctx = canvas.getContext("2d");
    const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
    let minX = canvas.width,
      minY = canvas.height,
      maxX = 0,
      maxY = 0;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        if (imageData.data[index + 3] > 0) {
          // Check if pixel is not transparent
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    setLatexPosition({ x: centerX, y: centerY });

    resp.data.forEach((item: Response) => {
      setTimeout(() => {
        setResult({
          expression: item.expr,
          answer: item.result,
        });
      }, 2000);
    });
  };

  const renderLatexToCanvas = (expression: string, answer: string) => {
    // Format the LaTeX properly for MathJax rendering
    const latex = `${expression} = ${answer}`;
    setLatexExpression([...latexExpression, latex]);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.lineCap = "round";
      ctx.lineWidth = 3;
    }

    if (window.MathJax && window.MathJax.Hub) {
      setMathJaxReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/config/TeX-MML-AM_CHTML.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Wait for MathJax to be fully initialized
      const checkMathJax = () => {
        if (window.MathJax && window.MathJax.Hub) {
          window.MathJax.Hub.Config({
            tex2jax: {
              inlineMath: [
                ["$", "$"],
                ["\\(", "\\)"],
              ],
              displayMath: [
                ["$$", "$$"],
                ["\\[", "\\]"]
              ],
              processEscapes: true,
              processEnvironments: true,
  
            },
            "HTML-CSS": {
              styles: {
                ".MathJax_Display": {
                  "color": "white !important"
                },
                ".MathJax": {
                  "color": "white !important"
                }
              }
            }
          });
          setMathJaxReady(true);
        } else {
          // If MathJax isn't ready yet, check again after a short delay
          setTimeout(checkMathJax, 100);
        }
      };
      checkMathJax();
    };

    return () => {
      // Only remove if we added it
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.cursor = "crosshair";
    canvas.style.backgroundColor = "black";
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2 p-4">
        <Button
          onClick={() => setReset(true)}
          className="z-20 bg-black text-white hover:bg-gray-800"
          variant="default"
          color="black"
        >
          Reset
        </Button>
        <Group className="z-20">
          {SWATCHES.map((swatch: string) => (
            <ColorSwatch
              key={swatch}
              color={swatch}
              onClick={() => setColor(swatch)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </Group>
        <Button
          onClick={sendData}
          className="z-20 bg-black text-white hover:bg-gray-800"
          variant="default"
          color="black"
        >
          Calculate
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 w-full h-full"
        onMouseDown={startDrawing}
        onMouseOut={stopDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
      />
      {latexExpression &&
        latexExpression.map((latex, index) => {
          // Create ref for this index if it doesn't exist
          if (!draggableRefs.current[index]) {
            draggableRefs.current[index] = React.createRef();
          }

          return (
            <Draggable
              key={index}
              defaultPosition={{
                x: latexPosition.x + (index * 20), // Offset each expression
                y: latexPosition.y + (index * 40)  // Stack them vertically
              }}
              nodeRef={draggableRefs.current[index]}
            >
              <div
                ref={draggableRefs.current[index]}
                className="absolute text-white bg-black bg-opacity-70 p-2 rounded cursor-move select-none"
                style={{
                  fontSize: '18px',
                  fontFamily: 'monospace',
                  minWidth: '100px',
                  zIndex: 10 + index
                }}
              >
                <div 
                  className={`latex-content-${index}`}
                >
                  {latex}
                </div>
              </div>
            </Draggable>
          );
        })}
    </>
  );
};

export default Home;
