import{a as Y,b as U,c as x}from"./chunk-HEEDEGUW.js";var T=Y((le,S)=>{"use strict";var y=Object.defineProperty,K=Object.getOwnPropertyDescriptor,W=Object.getOwnPropertyNames,J=Object.prototype.hasOwnProperty,Z=(t,e)=>{for(var o in e)y(t,o,{get:e[o],enumerable:!0})},q=(t,e,o,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of W(e))!J.call(t,n)&&n!==o&&y(t,n,{get:()=>e[n],enumerable:!(r=K(e,n))||r.enumerable});return t},z=t=>q(y({},"__esModule",{value:!0}),t),N={};Z(N,{BotOutcome:()=>H});S.exports=z(N);var H={Victory:"victory",Defeat:"defeat",Draw:"draw",Error:"error",None:"none"}});var u=U(T());var j=(t=0)=>e=>`\x1B[${e+t}m`,E=(t=0)=>e=>`\x1B[${38+t};5;${e}m`,M=(t=0)=>(e,o,r)=>`\x1B[${38+t};2;${e};${o};${r}m`,l={modifier:{reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],overline:[53,55],inverse:[7,27],hidden:[8,28],strikethrough:[9,29]},color:{black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],blackBright:[90,39],gray:[90,39],grey:[90,39],redBright:[91,39],greenBright:[92,39],yellowBright:[93,39],blueBright:[94,39],magentaBright:[95,39],cyanBright:[96,39],whiteBright:[97,39]},bgColor:{bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49],bgBlackBright:[100,49],bgGray:[100,49],bgGrey:[100,49],bgRedBright:[101,49],bgGreenBright:[102,49],bgYellowBright:[103,49],bgBlueBright:[104,49],bgMagentaBright:[105,49],bgCyanBright:[106,49],bgWhiteBright:[107,49]}},P=Object.keys(l.modifier),O=Object.keys(l.color),w=Object.keys(l.bgColor),R=[...O,...w];function Q(){let t=new Map;for(let[e,o]of Object.entries(l)){for(let[r,n]of Object.entries(o))l[r]={open:`\x1B[${n[0]}m`,close:`\x1B[${n[1]}m`},o[r]=l[r],t.set(n[0],n[1]);Object.defineProperty(l,e,{value:o,enumerable:!1})}return Object.defineProperty(l,"codes",{value:t,enumerable:!1}),l.color.close="\x1B[39m",l.bgColor.close="\x1B[49m",l.color.ansi=j(),l.color.ansi256=E(),l.color.ansi16m=M(),l.bgColor.ansi=j(10),l.bgColor.ansi256=E(10),l.bgColor.ansi16m=M(10),Object.defineProperties(l,{rgbToAnsi256:{value(e,o,r){return e===o&&o===r?e<8?16:e>248?231:Math.round((e-8)/247*24)+232:16+36*Math.round(e/255*5)+6*Math.round(o/255*5)+Math.round(r/255*5)},enumerable:!1},hexToRgb:{value(e){let o=/[a-f\d]{6}|[a-f\d]{3}/i.exec(e.toString(16));if(!o)return[0,0,0];let[r]=o;r.length===3&&(r=[...r].map(s=>s+s).join(""));let n=Number.parseInt(r,16);return[n>>16&255,n>>8&255,n&255]},enumerable:!1},hexToAnsi256:{value:e=>l.rgbToAnsi256(...l.hexToRgb(e)),enumerable:!1},ansi256ToAnsi:{value(e){if(e<8)return 30+e;if(e<16)return 90+(e-8);let o,r,n;if(e>=232)o=((e-232)*10+8)/255,r=o,n=o;else{e-=16;let i=e%36;o=Math.floor(e/36)/5,r=Math.floor(i/6)/5,n=i%6/5}let s=Math.max(o,r,n)*2;if(s===0)return 30;let a=30+(Math.round(n)<<2|Math.round(r)<<1|Math.round(o));return s===2&&(a+=60),a},enumerable:!1},rgbToAnsi:{value:(e,o,r)=>l.ansi256ToAnsi(l.rgbToAnsi256(e,o,r)),enumerable:!1},hexToAnsi:{value:e=>l.ansi256ToAnsi(l.hexToAnsi256(e)),enumerable:!1}}),l}var X=Q(),c=X;var p=(()=>{if(navigator.userAgentData){let t=navigator.userAgentData.brands.find(({brand:e})=>e==="Chromium");if(t&&t.version>93)return 3}return/\b(Chrome|Chromium)\//.test(navigator.userAgent)?1:0})(),k=p!==0&&{level:p,hasBasic:!0,has256:p>=2,has16m:p>=3},ee={stdout:k,stderr:k},F=ee;function _(t,e,o){let r=t.indexOf(e);if(r===-1)return t;let n=e.length,s=0,a="";do a+=t.slice(s,r)+e+o,s=r+n,r=t.indexOf(e,s);while(r!==-1);return a+=t.slice(s),a}function I(t,e,o,r){let n=0,s="";do{let a=t[r-1]==="\r";s+=t.slice(n,a?r-1:r)+e+(a?`\r
`:`
`)+o,n=r+1,r=t.indexOf(`
`,n)}while(r!==-1);return s+=t.slice(n),s}var{stdout:G,stderr:D}=F,C=Symbol("GENERATOR"),f=Symbol("STYLER"),h=Symbol("IS_EMPTY"),$=["ansi","ansi","ansi256","ansi16m"],b=Object.create(null),te=(t,e={})=>{if(e.level&&!(Number.isInteger(e.level)&&e.level>=0&&e.level<=3))throw new Error("The `level` option should be an integer from 0 to 3");let o=G?G.level:0;t.level=e.level===void 0?o:e.level},g=class{constructor(e){return L(e)}},L=t=>{let e=(...o)=>o.join(" ");return te(e,t),Object.setPrototypeOf(e,d.prototype),e};function d(t){return L(t)}Object.setPrototypeOf(d.prototype,Function.prototype);for(let[t,e]of Object.entries(c))b[t]={get(){let o=v(this,A(e.open,e.close,this[f]),this[h]);return Object.defineProperty(this,t,{value:o}),o}};b.visible={get(){let t=v(this,this[f],!0);return Object.defineProperty(this,"visible",{value:t}),t}};var B=(t,e,o,...r)=>t==="rgb"?e==="ansi16m"?c[o].ansi16m(...r):e==="ansi256"?c[o].ansi256(c.rgbToAnsi256(...r)):c[o].ansi(c.rgbToAnsi(...r)):t==="hex"?B("rgb",e,o,...c.hexToRgb(...r)):c[o][t](...r),re=["rgb","hex","ansi256"];for(let t of re){b[t]={get(){let{level:o}=this;return function(...r){let n=A(B(t,$[o],"color",...r),c.color.close,this[f]);return v(this,n,this[h])}}};let e="bg"+t[0].toUpperCase()+t.slice(1);b[e]={get(){let{level:o}=this;return function(...r){let n=A(B(t,$[o],"bgColor",...r),c.bgColor.close,this[f]);return v(this,n,this[h])}}}}var oe=Object.defineProperties(()=>{},{...b,level:{enumerable:!0,get(){return this[C].level},set(t){this[C].level=t}}}),A=(t,e,o)=>{let r,n;return o===void 0?(r=t,n=e):(r=o.openAll+t,n=e+o.closeAll),{open:t,close:e,openAll:r,closeAll:n,parent:o}},v=(t,e,o)=>{let r=(...n)=>ne(r,n.length===1?""+n[0]:n.join(" "));return Object.setPrototypeOf(r,oe),r[C]=t,r[f]=e,r[h]=o,r},ne=(t,e)=>{if(t.level<=0||!e)return t[h]?"":e;let o=t[f];if(o===void 0)return e;let{openAll:r,closeAll:n}=o;if(e.includes("\x1B"))for(;o!==void 0;)e=_(e,o.close,o.open),o=o.parent;let s=e.indexOf(`
`);return s!==-1&&(e=I(e,n,r,s)),r+e+n};Object.defineProperties(d.prototype,b);var be=d(),he=d({level:D?D.level:0});var m=new g({level:3});Zilch.play=async function*(t){let e=new x(t.config.fen),o=()=>{t.bots.forEach(r=>{r.writeln(`
`+m.underline("PGN:")),r.writeln(m.whiteBright.bold(e.pgn()))})};for(e.isGameOver()&&(o(),yield{state:e.fen(),outcome:V(e)});;){let r=e.turn()==="w"?0:1,n=t.bots[r];n.writeln(m.dim("Start turn"));let s=await n.move(e.fen()),a;try{a=e.move(s,{strict:!1})}catch(i){throw i instanceof Error&&i.message.toLowerCase().includes("invalid move")&&(n.writeln(m.bold.redBright(`
Invalid move: ${s}`)),yield{state:e.fen(),outcome:r===0?[u.BotOutcome.Error,u.BotOutcome.None]:[u.BotOutcome.None,u.BotOutcome.Error]}),i}n.writeln(m.dim(`\u2937 ${a.san}`)),e.isGameOver()&&(await Promise.all(t.bots.map(i=>i.end(e.fen()))),o()),e.isGameOver()&&!e.isCheckmate()&&(e.isStalemate()?t.bots.forEach(i=>i.writeln(`
Stalemate`)):e.isThreefoldRepetition()?t.bots.forEach(i=>i.writeln(`
Threefold Repetition`)):e.isInsufficientMaterial()?t.bots.forEach(i=>i.writeln(`
Insufficient Material`)):t.bots.forEach(i=>i.writeln(`
Fifty-Move Rule Violation`))),yield{state:e.fen(),outcome:V(e)}}};function V(t){return t.isGameOver()?t.isCheckmate()?[t.turn()==="w"?u.BotOutcome.Defeat:u.BotOutcome.Victory,t.turn()==="b"?u.BotOutcome.Defeat:u.BotOutcome.Victory]:[u.BotOutcome.Draw,u.BotOutcome.Draw]:null}
//# sourceMappingURL=play.js.map
