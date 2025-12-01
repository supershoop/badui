'use client'
import Image from "next/image";
import { CSSProperties, UIEventHandler, useEffect, useRef, useState } from "react";
import Confetti from 'react-confetti'

function clamp(x:number, min: number, max: number) {
  return Math.min(Math.max(x, min), max);
};


export default function Home() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [read, setRead] = useState(false);
  const [page, setPage] = useState(0);
  const [pageAngle, setPageAngle] = useState(0);
  const [moving, setMoving] = useState(false);
  const [angle, setAngle] = useState<number>(-999);
  const [accepted, setAccepted] = useState(false);
  const [loadText, setLoadText] = useState(true);
  const [text, setText] = useState("Loading...");
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [confetti, setConfetti] = useState(false);
  const [rotate, setRotate] = useState(true);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);


  const pages = 3;
  const ready = read && page === pages-1;
  const fetchText = () => {
    fetch("https://api.quotable.io/quotes/random?limit=100").then(r => {
      return r.json();
    }).then(j => {
      let s = "";
      for (const q of j) {
        s += `${q.content} `;
      }
      setText(s);
      setLoadText(false);
      (document.getElementById("tnc") as HTMLDivElement).scrollTo({top: 0});
    })
  }
  useEffect(() => {
    if (loadText) fetchText();
    const speed = 300;
    let lastTime : DOMHighResTimeStamp | undefined;
    let lastRotation = 0;
    let frame = -1;
    const f = (d: DOMHighResTimeStamp) => {
      if (lastTime===undefined) lastTime=d;
      const delta = (d-lastTime)/1000;
      lastTime=d;
      const box = document.getElementById("box")?.getBoundingClientRect() ?? new DOMRect();
      if (moving && (angle===-999 || Math.random()<0.01)) setAngle(Math.random() * 2 *   Math.PI);
      if (rotate && (d - lastRotation > 750)) {
        lastRotation=d;
        setPageAngle(pageAngle+(30+Math.random() * 120) * Math.sign(Math.random()-0.5));
      }
      if (moving) setX(x => {
        const left = box.x - x;
        const right = box.right - x;
        let x2 = x + speed * delta * Math.cos(angle);
        if (x2 < -left) {
          x2 = -left + speed * delta * Math.cos(Math.PI-angle);
          setAngle(Math.PI-angle);
        }
        if (x2 > window.innerWidth-right) {
          x2 = window.innerWidth-right + speed * delta * Math.cos(Math.PI-angle);
          setAngle(Math.PI-angle);
        }
        return x2;
      });
      if (moving) setY(y => {
        const top = box.y - y;
        const bottom = box.bottom - y;
        let y2 = y + speed * delta * Math.sin(angle);
        if (y2 < -top) {
          y2 = -top + speed * delta * Math.sin(-angle);
          setAngle(-angle);
        }
        if (y2 > window.innerHeight-bottom) {
          y2 = window.innerHeight-bottom + speed * delta * Math.sin(-angle);
          setAngle(-angle);
        }
        return y2;
      });

      frame = requestAnimationFrame(f);
    } 
    frame = requestAnimationFrame(f);
    let interval: NodeJS.Timeout;
    if (read && page == pages-1) interval = setInterval(() => setMoving(true), 1000);
    return () => {cancelAnimationFrame(frame); clearInterval(interval); };
  }, [angle, read, moving, page, loadText]);

  const scrollHandler: UIEventHandler<HTMLDivElement> = e => {
      const tolerance = 1; 
      const element = e.target as HTMLDivElement;
      if ((element.scrollTop + element.clientHeight + tolerance) >= element.scrollHeight) {
        setRead(!loadText);
      }
  }

  const triggerConfetti = () => {
    setConfetti(true);
    setTimeout(() => { 
      setConfetti(false);
    }, 3000);
    setTimeout(() => { 
      window.location.reload();
    }, 4000);
    setAccepted(false);
    setMoving(false);
    setRead(false);
  };

  const nextHandler = () => {
        setRead(false);
        setPage( page+1);
        setLoadText(true);
  }

  const scale = ready ? 2 : 1;
  const css: CSSProperties = {
    transform: `translate(${x}px,${y}px)`,
    scale: scale,
  }
  const css2: CSSProperties = {
    transform: `rotate(${pageAngle}deg)`,
    transformOrigin: "center",
    clipPath:  "circle(50%)"
  }
  return (
    <div className=" h-screen flex flex-col justify-center items-center overflow-clip">
      {
        confetti && <Confetti          
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
          wind={0.02} 
          />
      }
      <div className=" p-5 font-sans h-[600px] flex flex-col bg-neutral-200 text-black items-center w-auto main">
        <h2 className="font-bold text-xl">Terms and Conditions</h2>
        <div className=" bg-white p-4 resize-none overflow-scroll transition-all duration-1000 aspect-square h-3/4" style={css2} id="tnc" onScroll={scrollHandler}>
          <p className="m-[12%] whitespace-pre-wrap">
            Difficulties are things that show a person what they are. All great achievements require time. No man can succeed in a line of endeavor which he does not like. It is in your moments of decision that your destiny is shaped. The only journey is the one within. All know the way; few actually walk it. Once you choose hope, anything's possible. You cannot step twice into the same river, for other waters are continually flowing in. Remember that a gesture of friendship, no matter how small, is always appreciated. Give me six hours to chop down a tree and I will spend the first four sharpening the axe. Bad times have a scientific value. These are occasions a good learner would not miss. One who gains strength by overcoming obstacles possesses the only strength which can overcome adversity. Friendship is the marriage of the soul, and this marriage is liable to divorce. One fails forward toward success. To be beautiful means to be yourself. You don't need to be accepted by others. You need to accept yourself. If opportunity doesn't knock, build a door. How is it possible to find meaning in a finite world, given my waist and shirt size? Every person, all the events of your life are there because you have drawn them there. What you choose to do with them is up to you. By going beyond your own problems and taking care of others, you gain inner strength, self-confidence, courage, and a greater sense of calm. Consult not your fears but your hopes and your dreams. Think not about your frustrations, but about your unfulfilled potential. Concern yourself not with what you tried and failed in, but with what it is still possible for you to do. All human wisdom is summed up in two words; wait and hope. Men are disturbed not by things, but by the view which they take of them. Nature gave us one tongue and two ears so we could hear twice as much as we speak. Only put off until tomorrow what you are willing to die having left undone. Hell, there are no rules here-- we're trying to accomplish something. Whoever is happy will make others happy, too. The person who lives life fully, glowing with life's energy, is the person who lives a successful life. Winners never quit and quitters never win. The world is afflicted by death and decay. But the wise do not grieve, having realized the nature of the world. A single lamp may light hundreds of thousands of lamps without itself being diminished. A real friend is one who walks in when the rest of the world walks out. Formula for success: under promise and over deliver. The ballot is stronger than the bullet. I have learned that friendship isn't about who you've known the longest, it's about who came and never left your side. Those who cannot learn from history are doomed to repeat it. You don't choose your family. They are God's gift to you, as you are to them. Three things in human life are important. The first is to be kind. The second is to be kind. The third is to be kind. It is impossible to experience one's death objectively and still carry a tune. It is not the possession of truth, but the success which attends the seeking after it, that enriches the seeker and brings happiness to him. You are the only person on earth who can use your ability. Logic will get you from A to B. Imagination will take you everywhere. We come to love not by finding a perfect person, but by learning to see an imperfect person perfectly. Imagination rules the world. Technology made large populations possible; large populations now make technology indispensable. Difficulties are meant to rouse, not discourage. The human spirit is to grow strong by conflict. It's only when the tide goes out that you discover who's been swimming naked. When you are content to be simply yourself and don't compare or compete, everybody will respect you. A fine quotation is a diamond on the finger of a man of wit, and a pebble in the hand of a fool. Good people are good because they've come to wisdom through failure. We get very little wisdom from success, you know. Always do your best. What you plant now, you will harvest later. 
          </p>
        </div>
        {page < pages-1 && <div className={"flex gap-4 items-center z-10 bg-neutral-200 p-3 rounded-2xl " + (page%2==0 ? "flex-row" : "flex-row-reverse")}>
          <button disabled={!read} onClick={nextHandler} className="bg-neutral-500 hover:bg-neutral-600 font-bold text-white disabled:bg-neutral-300 p-2 rounded-sm">Next</button>
          <span>Page {page+1} of {pages}</span>
        </div>}
          
        <div className="flex flex-row gap-4 text-lg bg-neutral-200/50 transition-[scale] duration-2000" id="box" style={css}>
          <input type="checkbox" name="accept" onChange={(e) => setAccepted(e.target.checked)} disabled={!moving}/>
          <div className="grid">
            <label htmlFor="accept" className={"col-1 row-1 transition-all duration-2000 " + (ready ? "opacity-100" : "opacity-0")}>I accept the terms</label>
            <label htmlFor="accept" className={"col-1 row-1 transition-all duration-2000 " + (ready ? "opacity-0" : "opacity-100")}><span className="text-foreground-500 italic">Please read the terms in their entirety</span></label>
          </div>
        </div>
        <button disabled={!accepted} onClick={triggerConfetti} className="bg-green-500 hover:bg-green-600 font-bold text-white disabled:bg-green-300 p-3 rounded-sm">Submit</button>
      </div>
    </div>
  );
}
