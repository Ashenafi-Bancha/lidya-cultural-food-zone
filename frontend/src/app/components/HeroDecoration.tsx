import React from "react";
import { motion } from "motion/react";

const EL = [
  // coffee beans
  { t:"bean",   top:"8%",  left:"4%",   s:16, dur:5.2, delay:0,   type:"bob"     },
  { t:"bean",   top:"62%", left:"12%",  s:14, dur:6.8, delay:1.5, type:"drift"   },
  { t:"bean",   top:"28%", left:"58%",  s:18, dur:4.9, delay:0.8, type:"bob"     },
  { t:"bean",   top:"78%", left:"82%",  s:14, dur:7.2, delay:2.3, type:"drift"   },
  { t:"bean",   top:"50%", left:"92%",  s:16, dur:5.8, delay:1.1, type:"bob"     },
  // injera circles
  { t:"injera", top:"18%", left:"22%",  s:20, dur:8.0, delay:0.5, type:"spin"    },
  { t:"injera", top:"52%", left:"48%",  s:18, dur:9.5, delay:1.8, type:"spin"    },
  { t:"injera", top:"82%", left:"28%",  s:16, dur:7.5, delay:3.0, type:"bob"     },
  { t:"injera", top:"35%", left:"75%",  s:18, dur:8.8, delay:0.3, type:"spin"    },
  // 4-pointed stars (twinkle)
  { t:"star",   top:"11%", left:"38%",  s:14, dur:3.5, delay:0,   type:"twinkle" },
  { t:"star",   top:"38%", left:"88%",  s:12, dur:2.8, delay:1.2, type:"twinkle" },
  { t:"star",   top:"68%", left:"52%",  s:16, dur:4.2, delay:0.6, type:"twinkle" },
  { t:"star",   top:"86%", left:"70%",  s:12, dur:3.0, delay:2.4, type:"twinkle" },
  { t:"star",   top:"48%", left:"2%",   s:14, dur:3.8, delay:1.8, type:"twinkle" },
  { t:"star",   top:"22%", left:"94%",  s:12, dur:2.6, delay:0.9, type:"twinkle" },
  { t:"star",   top:"72%", left:"6%",   s:14, dur:4.0, delay:3.5, type:"twinkle" },
  // drink teardrops
  { t:"drink",  top:"32%", left:"18%",  s:15, dur:5.5, delay:1.0, type:"bob"     },
  { t:"drink",  top:"58%", left:"72%",  s:14, dur:6.5, delay:2.5, type:"drift"   },
  { t:"drink",  top:"14%", left:"66%",  s:16, dur:5.0, delay:0.3, type:"bob"     },
  { t:"drink",  top:"88%", left:"45%",  s:14, dur:6.0, delay:1.7, type:"drift"   },
  // diamonds
  { t:"gem",    top:"44%", left:"34%",  s:11, dur:4.0, delay:0.8, type:"spin"    },
  { t:"gem",    top:"24%", left:"46%",  s:13, dur:5.5, delay:1.5, type:"twinkle" },
  { t:"gem",    top:"76%", left:"18%",  s:11, dur:4.8, delay:2.8, type:"spin"    },
  { t:"gem",    top:"55%", left:"63%",  s:10, dur:3.8, delay:0.4, type:"twinkle" },
  { t:"gem",    top:"6%",  left:"80%",  s:12, dur:4.5, delay:2.0, type:"spin"    },
  // dots
  { t:"dot",    top:"16%", left:"32%",  s:4,  dur:4.5, delay:0.2, type:"twinkle" },
  { t:"dot",    top:"54%", left:"22%",  s:3,  dur:3.2, delay:1.8, type:"twinkle" },
  { t:"dot",    top:"40%", left:"56%",  s:5,  dur:5.8, delay:0.9, type:"twinkle" },
  { t:"dot",    top:"90%", left:"60%",  s:4,  dur:4.0, delay:2.2, type:"twinkle" },
  { t:"dot",    top:"30%", left:"84%",  s:3,  dur:3.5, delay:3.5, type:"twinkle" },
  { t:"dot",    top:"70%", left:"40%",  s:4,  dur:5.0, delay:1.4, type:"twinkle" },
];

function renderEl(type: string, s: number) {
  if (type === "bean") return (
    <svg viewBox="0 0 24 24" width={s} height={s} fill="none">
      <ellipse cx="12" cy="12" rx="9" ry="5.5" fill="rgba(61,26,8,0.7)" stroke="#d4a843" strokeWidth="1.2"/>
      <path d="M12 6.5 Q8.5 12 12 17.5" stroke="#d4a843" strokeWidth="1" fill="none" strokeLinecap="round"/>
    </svg>
  );
  if (type === "injera") return (
    <svg viewBox="0 0 24 24" width={s} height={s} fill="none">
      <circle cx="12" cy="12" r="10" fill="rgba(245,239,230,0.05)" stroke="#d4a843" strokeWidth="1.1"/>
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="#d4a843" strokeWidth="0.7" opacity="0.5"/>
      <circle cx="12" cy="12" r="3"   fill="none" stroke="#d4a843" strokeWidth="0.5" opacity="0.3"/>
      <circle cx="12" cy="12" r="1.2" fill="#d4a843" opacity="0.6"/>
    </svg>
  );
  if (type === "star") return (
    <svg viewBox="0 0 18 18" width={s} height={s} fill="none">
      <path d="M9 1 L10.5 6.5 L16 9 L10.5 11.5 L9 17 L7.5 11.5 L2 9 L7.5 6.5 Z" fill="#d4a843" opacity="0.88"/>
    </svg>
  );
  if (type === "drink") return (
    <svg viewBox="0 0 16 20" width={s * 0.8} height={s} fill="none">
      <path d="M8 2 Q15 9 15 13 A7 7 0 0 1 1 13 Q1 9 8 2Z" fill="rgba(194,94,42,0.38)" stroke="#d4a843" strokeWidth="1"/>
    </svg>
  );
  if (type === "gem") return (
    <svg viewBox="0 0 16 16" width={s} height={s} fill="none">
      <path d="M8 1 L15 8 L8 15 L1 8 Z" fill="#c25e2a" stroke="#d4a843" strokeWidth="0.8" opacity="0.78"/>
    </svg>
  );
  return <div style={{ width:s, height:s, borderRadius:"50%", background:"#d4a843", opacity:0.65 }}/>;
}

function getMotionProps(type: string, dur: number, delay: number) {
  if (type === "twinkle") {
    return {
      initial: { opacity: 0, scale: 0.35 },
      animate: { opacity: [0, 0.85, 0], scale: [0.35, 1, 0.35] },
      transition: { duration: dur, delay, repeat: Infinity, ease: "easeInOut" as const },
    };
  }
  if (type === "spin") {
    return {
      initial: { opacity: 0.38 },
      animate: { rotate: 360, opacity: 0.38 },
      transition: { duration: dur, delay, repeat: Infinity, ease: "linear" as const },
    };
  }
  if (type === "drift") {
    return {
      initial: { opacity: 0.38, x: 0, y: 0 },
      animate: { opacity: 0.38, x: [0, 7, 0], y: [0, -13, 0] },
      transition: { duration: dur, delay, repeat: Infinity, ease: "easeInOut" as const },
    };
  }
  // bob (default)
  return {
    initial: { opacity: 0.38, y: 0 },
    animate: { opacity: 0.38, y: [0, -11, 0] },
    transition: { duration: dur, delay, repeat: Infinity, ease: "easeInOut" as const },
  };
}

export function HeroDecoration() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
      {EL.map((el, i) => {
        const motionProps = getMotionProps(el.type, el.dur, el.delay);
        return (
          <motion.div
            key={i}
            style={{ position: "absolute", top: el.top, left: el.left }}
            {...motionProps}
          >
            {renderEl(el.t, el.s)}
          </motion.div>
        );
      })}
    </div>
  );
}
