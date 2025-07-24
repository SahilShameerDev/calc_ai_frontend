import { useEffect, useRef, useState } from "react";
import { SWATCHES } from "../../../constants";
import { ColorSwatch, Group } from "@mantine/core";
import { Button } from "../../components/ui/button";
import axios from "axios";

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
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [dictOfVars, setDictOfVars] = useState({});

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setReset(false);
    }
  }, [reset]);

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
    console.log(resp);
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
    </>
  );
};

export default Home;
