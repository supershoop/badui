'use client'
import Image from "next/image";
import { CSSProperties, useEffect, useRef, useState } from "react";

export default function Home() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [angle, setAngle] = useState(-1);
  const [accepted, setAccepted] = useState(false);
  useEffect(() => {
    const speed = 500;
    let lastTime : DOMHighResTimeStamp | undefined;
    let cancel = false;
    const f = (d: DOMHighResTimeStamp) => {
      if (cancel) return;
      if (lastTime===undefined) lastTime=d;
      const delta = (d-lastTime)/1000;
      lastTime=d;
      if (Math.random() < 0.05) setAngle(a => a + Math.random()-0.5 * 2 *   Math.PI);
      setX(x => {
        let x2 = x + speed * delta * Math.cos(angle);
        x2 = Math.sign(x2) * Math.min(Math.abs(x2), 400);
        return x2;
      });
      setY(y => {
        let y2 = y + speed * delta * Math.sin(angle);
        y2 = Math.sign(y2) * Math.min(Math.abs(y2), 300);
        return y2;
      });
      requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
    return () => {cancel=true};
  }, [angle]);
  const css: CSSProperties = {
    transform: `translate(${x}px, ${y}px)`,
  }
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center overflow-clip">
      <div className="w-[800] p-5 font-sans h-[600] flex flex-col bg-neutral-200 text-black items-start">
        <h2 className="font-bold text-xl">Terms and Conditions</h2>
        <div className="flex-1 bg-white p-4 resize-none">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div className="flex flex-row gap-4 text-lg bg-neutral-200/50" style={css}><input type="checkbox" name="accept" onChange={(e) => setAccepted(e.target.checked)}/><label htmlFor="accept">I accept the terms</label></div>
        <button disabled={!accepted} className="bg-green-500 hover:bg-green-600 font-bold text-white disabled:bg-green-300 p-3 rounded-sm">Submit</button>
      </div>
    </div>
  );
}
