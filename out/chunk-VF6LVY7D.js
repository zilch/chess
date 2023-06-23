var V=Object.create;var H=Object.defineProperty;var X=Object.getOwnPropertyDescriptor;var ee=Object.getOwnPropertyNames;var te=Object.getPrototypeOf,se=Object.prototype.hasOwnProperty;var me=(_,e)=>()=>(e||_((e={exports:{}}).exports,e),e.exports);var ie=(_,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of ee(e))!se.call(_,i)&&i!==t&&H(_,i,{get:()=>e[i],enumerable:!(s=X(e,i))||s.enumerable});return _};var be=(_,e,t)=>(t=_!=null?V(te(_)):{},ie(e||!_||!_.__esModule?H(t,"default",{value:_,enumerable:!0}):t,_));var k="w",v="b",E="p",j="n",D="b",w="r",R="q",S="k",Q="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";var ne={NORMAL:"n",CAPTURE:"c",BIG_PAWN:"b",EP_CAPTURE:"e",PROMOTION:"p",KSIDE_CASTLE:"k",QSIDE_CASTLE:"q"};var f={NORMAL:1,CAPTURE:2,BIG_PAWN:4,EP_CAPTURE:8,PROMOTION:16,KSIDE_CASTLE:32,QSIDE_CASTLE:64},u={a8:0,b8:1,c8:2,d8:3,e8:4,f8:5,g8:6,h8:7,a7:16,b7:17,c7:18,d7:19,e7:20,f7:21,g7:22,h7:23,a6:32,b6:33,c6:34,d6:35,e6:36,f6:37,g6:38,h6:39,a5:48,b5:49,c5:50,d5:51,e5:52,f5:53,g5:54,h5:55,a4:64,b4:65,c4:66,d4:67,e4:68,f4:69,g4:70,h4:71,a3:80,b3:81,c3:82,d3:83,e3:84,f3:85,g3:86,h3:87,a2:96,b2:97,c2:98,d2:99,e2:100,f2:101,g2:102,h2:103,a1:112,b1:113,c1:114,d1:115,e1:116,f1:117,g1:118,h1:119},U={b:[16,32,17,15],w:[-16,-32,-17,-15]},G={n:[-18,-33,-31,-14,18,33,31,14],b:[-17,-15,17,15],r:[-16,1,16,-1],q:[-17,-16,-15,1,17,16,15,-1],k:[-17,-16,-15,1,17,16,15,-1]},re=[20,0,0,0,0,0,0,24,0,0,0,0,0,0,20,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,24,24,24,24,24,24,56,0,56,24,24,24,24,24,24,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,20,0,0,0,0,0,0,24,0,0,0,0,0,0,20],oe=[17,0,0,0,0,0,0,16,0,0,0,0,0,0,15,0,0,17,0,0,0,0,0,16,0,0,0,0,0,15,0,0,0,0,17,0,0,0,0,16,0,0,0,0,15,0,0,0,0,0,0,17,0,0,0,16,0,0,0,15,0,0,0,0,0,0,0,0,17,0,0,16,0,0,15,0,0,0,0,0,0,0,0,0,0,17,0,16,0,15,0,0,0,0,0,0,0,0,0,0,0,0,17,16,15,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,-15,-16,-17,0,0,0,0,0,0,0,0,0,0,0,0,-15,0,-16,0,-17,0,0,0,0,0,0,0,0,0,0,-15,0,0,-16,0,0,-17,0,0,0,0,0,0,0,0,-15,0,0,0,-16,0,0,0,-17,0,0,0,0,0,0,-15,0,0,0,0,-16,0,0,0,0,-17,0,0,0,0,-15,0,0,0,0,0,-16,0,0,0,0,0,-17,0,0,-15,0,0,0,0,0,0,-16,0,0,0,0,0,0,-17],ae={p:1,n:2,b:4,r:8,q:16,k:32},he="pnbrqkPNBRQK",W=[j,D,w,R],le=7,fe=6,ce=1,ue=0,O={[S]:f.KSIDE_CASTLE,[R]:f.QSIDE_CASTLE},y={w:[{square:u.a1,flag:f.QSIDE_CASTLE},{square:u.h1,flag:f.KSIDE_CASTLE}],b:[{square:u.a8,flag:f.QSIDE_CASTLE},{square:u.h8,flag:f.KSIDE_CASTLE}]},_e={b:ce,w:fe},de=["1-0","0-1","1/2-1/2","*"];function M(_){return _>>4}function L(_){return _&15}function Z(_){return"0123456789".indexOf(_)!==-1}function C(_){let e=L(_),t=M(_);return"abcdefgh".substring(e,e+1)+"87654321".substring(t,t+1)}function q(_){return _===k?v:k}function pe(_){let e=_.split(/\s+/);if(e.length!==6)return{ok:!1,error:"Invalid FEN: must contain six space-delimited fields"};let t=parseInt(e[5],10);if(isNaN(t)||t<=0)return{ok:!1,error:"Invalid FEN: move number must be a positive integer"};let s=parseInt(e[4],10);if(isNaN(s)||s<0)return{ok:!1,error:"Invalid FEN: half move counter number must be a non-negative integer"};if(!/^(-|[abcdefgh][36])$/.test(e[3]))return{ok:!1,error:"Invalid FEN: en-passant square is invalid"};if(/[^kKqQ-]/.test(e[2]))return{ok:!1,error:"Invalid FEN: castling availability is invalid"};if(!/^(w|b)$/.test(e[1]))return{ok:!1,error:"Invalid FEN: side-to-move is invalid"};let i=e[0].split("/");if(i.length!==8)return{ok:!1,error:"Invalid FEN: piece data does not contain 8 '/'-delimited rows"};for(let o=0;o<i.length;o++){let r=0,a=!1;for(let c=0;c<i[o].length;c++)if(Z(i[o][c])){if(a)return{ok:!1,error:"Invalid FEN: piece data is invalid (consecutive number)"};r+=parseInt(i[o][c],10),a=!0}else{if(!/^[prnbqkPRNBQK]$/.test(i[o][c]))return{ok:!1,error:"Invalid FEN: piece data is invalid (invalid piece)"};r+=1,a=!1}if(r!==8)return{ok:!1,error:"Invalid FEN: piece data is invalid (too many squares in rank)"}}if(e[3][1]=="3"&&e[1]=="w"||e[3][1]=="6"&&e[1]=="b")return{ok:!1,error:"Invalid FEN: illegal en-passant square"};let n=[{color:"white",regex:/K/g},{color:"black",regex:/k/g}];for(let{color:o,regex:r}of n){if(!r.test(e[0]))return{ok:!1,error:`Invalid FEN: missing ${o} king`};if((e[0].match(r)||[]).length>1)return{ok:!1,error:`Invalid FEN: too many ${o} kings`}}return{ok:!0}}function ge(_,e){let t=_.from,s=_.to,i=_.piece,n=0,o=0,r=0;for(let a=0,c=e.length;a<c;a++){let m=e[a].from,b=e[a].to,h=e[a].piece;i===h&&t!==m&&s===b&&(n++,M(t)===M(m)&&o++,L(t)===L(m)&&r++)}return n>0?o>0&&r>0?C(t):r>0?C(t).charAt(1):C(t).charAt(0):""}function N(_,e,t,s,i,n=void 0,o=f.NORMAL){let r=M(s);if(i===E&&(r===le||r===ue))for(let a=0;a<W.length;a++){let c=W[a];_.push({color:e,from:t,to:s,piece:i,captured:n,promotion:c,flags:o|f.PROMOTION})}else _.push({color:e,from:t,to:s,piece:i,captured:n,flags:o})}function z(_){let e=_.charAt(0);return e>="a"&&e<="h"?_.match(/[a-h]\d.*[a-h]\d/)?void 0:E:(e=e.toLowerCase(),e==="o"?S:e)}function $(_){return _.replace(/=/,"").replace(/[+#]?[?!]*$/,"")}var J=class{_board=new Array(128);_turn=k;_header={};_kings={w:-1,b:-1};_epSquare=-1;_halfMoves=0;_moveNumber=0;_history=[];_comments={};_castling={w:0,b:0};constructor(e=Q){this.load(e)}clear(e=!1){this._board=new Array(128),this._kings={w:-1,b:-1},this._turn=k,this._castling={w:0,b:0},this._epSquare=-1,this._halfMoves=0,this._moveNumber=1,this._history=[],this._comments={},this._header=e?this._header:{},this._updateSetup(this.fen())}removeHeader(e){e in this._header&&delete this._header[e]}load(e,t=!1){let s=e.split(/\s+/);if(s.length>=2&&s.length<6){let a=["-","-","0","1"];e=s.concat(a.slice(-(6-s.length))).join(" ")}s=e.split(/\s+/);let{ok:i,error:n}=pe(e);if(!i)throw new Error(n);let o=s[0],r=0;this.clear(t);for(let a=0;a<o.length;a++){let c=o.charAt(a);if(c==="/")r+=8;else if(Z(c))r+=parseInt(c,10);else{let m=c<"a"?k:v;this.put({type:c.toLowerCase(),color:m},C(r)),r++}}this._turn=s[1],s[2].indexOf("K")>-1&&(this._castling.w|=f.KSIDE_CASTLE),s[2].indexOf("Q")>-1&&(this._castling.w|=f.QSIDE_CASTLE),s[2].indexOf("k")>-1&&(this._castling.b|=f.KSIDE_CASTLE),s[2].indexOf("q")>-1&&(this._castling.b|=f.QSIDE_CASTLE),this._epSquare=s[3]==="-"?-1:u[s[3]],this._halfMoves=parseInt(s[4],10),this._moveNumber=parseInt(s[5],10),this._updateSetup(this.fen())}fen(){let e=0,t="";for(let n=u.a8;n<=u.h1;n++){if(this._board[n]){e>0&&(t+=e,e=0);let{color:o,type:r}=this._board[n];t+=o===k?r.toUpperCase():r.toLowerCase()}else e++;n+1&136&&(e>0&&(t+=e),n!==u.h1&&(t+="/"),e=0,n+=8)}let s="";this._castling[k]&f.KSIDE_CASTLE&&(s+="K"),this._castling[k]&f.QSIDE_CASTLE&&(s+="Q"),this._castling[v]&f.KSIDE_CASTLE&&(s+="k"),this._castling[v]&f.QSIDE_CASTLE&&(s+="q"),s=s||"-";let i="-";if(this._epSquare!==-1){let n=this._epSquare+(this._turn===k?16:-16),o=[n+1,n-1];for(let r of o){if(r&136)continue;let a=this._turn;if(this._board[r]?.color===a&&this._board[r]?.type===E){this._makeMove({color:a,from:r,to:this._epSquare,piece:E,captured:E,flags:f.EP_CAPTURE});let c=!this._isKingAttacked(a);if(this._undoMove(),c){i=C(this._epSquare);break}}}}return[t,this._turn,s,i,this._halfMoves,this._moveNumber].join(" ")}_updateSetup(e){this._history.length>0||(e!==Q?(this._header.SetUp="1",this._header.FEN=e):(delete this._header.SetUp,delete this._header.FEN))}reset(){this.load(Q)}get(e){return this._board[u[e]]||!1}put({type:e,color:t},s){if(he.indexOf(e.toLowerCase())===-1||!(s in u))return!1;let i=u[s];return e==S&&!(this._kings[t]==-1||this._kings[t]==i)?!1:(this._board[i]={type:e,color:t},e===S&&(this._kings[t]=i),this._updateCastlingRights(),this._updateEnPassantSquare(),this._updateSetup(this.fen()),!0)}remove(e){let t=this.get(e);return delete this._board[u[e]],t&&t.type===S&&(this._kings[t.color]=-1),this._updateCastlingRights(),this._updateEnPassantSquare(),this._updateSetup(this.fen()),t}_updateCastlingRights(){let e=this._board[u.e1]?.type===S&&this._board[u.e1]?.color===k,t=this._board[u.e8]?.type===S&&this._board[u.e8]?.color===v;(!e||this._board[u.a1]?.type!==w||this._board[u.a1]?.color!==k)&&(this._castling.w&=~f.QSIDE_CASTLE),(!e||this._board[u.h1]?.type!==w||this._board[u.h1]?.color!==k)&&(this._castling.w&=~f.KSIDE_CASTLE),(!t||this._board[u.a8]?.type!==w||this._board[u.a8]?.color!==v)&&(this._castling.b&=~f.QSIDE_CASTLE),(!t||this._board[u.h8]?.type!==w||this._board[u.h8]?.color!==v)&&(this._castling.b&=~f.KSIDE_CASTLE)}_updateEnPassantSquare(){if(this._epSquare===-1)return;let e=this._epSquare+(this._turn===k?-16:16),t=this._epSquare+(this._turn===k?16:-16),s=[t+1,t-1];if(this._board[e]!==null||this._board[this._epSquare]!==null||this._board[t]?.color!==q(this._turn)||this._board[t]?.type!==E){this._epSquare=-1;return}let i=n=>!(n&136)&&this._board[n]?.color===this._turn&&this._board[n]?.type===E;s.some(i)||(this._epSquare=-1)}_attacked(e,t){for(let s=u.a8;s<=u.h1;s++){if(s&136){s+=7;continue}if(this._board[s]===void 0||this._board[s].color!==e)continue;let i=this._board[s],n=s-t;if(n===0)continue;let o=n+119;if(re[o]&ae[i.type]){if(i.type===E){if(n>0){if(i.color===k)return!0}else if(i.color===v)return!0;continue}if(i.type==="n"||i.type==="k")return!0;let r=oe[o],a=s+r,c=!1;for(;a!==t;){if(this._board[a]!=null){c=!0;break}a+=r}if(!c)return!0}}return!1}_isKingAttacked(e){let t=this._kings[e];return t===-1?!1:this._attacked(q(e),t)}isAttacked(e,t){return this._attacked(t,u[e])}isCheck(){return this._isKingAttacked(this._turn)}inCheck(){return this.isCheck()}isCheckmate(){return this.isCheck()&&this._moves().length===0}isStalemate(){return!this.isCheck()&&this._moves().length===0}isInsufficientMaterial(){let e={b:0,n:0,r:0,q:0,k:0,p:0},t=[],s=0,i=0;for(let n=u.a8;n<=u.h1;n++){if(i=(i+1)%2,n&136){n+=7;continue}let o=this._board[n];o&&(e[o.type]=o.type in e?e[o.type]+1:1,o.type===D&&t.push(i),s++)}if(s===2)return!0;if(s===3&&(e[D]===1||e[j]===1))return!0;if(s===e[D]+2){let n=0,o=t.length;for(let r=0;r<o;r++)n+=t[r];if(n===0||n===o)return!0}return!1}isThreefoldRepetition(){let e=[],t={},s=!1;for(;;){let i=this._undoMove();if(!i)break;e.push(i)}for(;;){let i=this.fen().split(" ").slice(0,4).join(" ");t[i]=i in t?t[i]+1:1,t[i]>=3&&(s=!0);let n=e.pop();if(n)this._makeMove(n);else break}return s}isDraw(){return this._halfMoves>=100||this.isStalemate()||this.isInsufficientMaterial()||this.isThreefoldRepetition()}isGameOver(){return this.isCheckmate()||this.isStalemate()||this.isDraw()}moves({verbose:e=!1,square:t=void 0,piece:s=void 0}={}){let i=this._moves({square:t,piece:s});return e?i.map(n=>this._makePretty(n)):i.map(n=>this._moveToSan(n,i))}_moves({legal:e=!0,piece:t=void 0,square:s=void 0}={}){let i=s?s.toLowerCase():void 0,n=t?.toLowerCase(),o=[],r=this._turn,a=q(r),c=u.a8,m=u.h1,b=!1;if(i)if(i in u)c=m=u[i],b=!0;else return[];for(let l=c;l<=m;l++){if(l&136){l+=7;continue}if(!this._board[l]||this._board[l].color===a)continue;let{type:g}=this._board[l],p;if(g===E){if(n&&n!==g)continue;p=l+U[r][0],this._board[p]||(N(o,r,l,p,E),p=l+U[r][1],_e[r]===M(l)&&!this._board[p]&&N(o,r,l,p,E,void 0,f.BIG_PAWN));for(let A=2;A<4;A++)p=l+U[r][A],!(p&136)&&(this._board[p]?.color===a?N(o,r,l,p,E,this._board[p].type,f.CAPTURE):p===this._epSquare&&N(o,r,l,p,E,E,f.EP_CAPTURE))}else{if(n&&n!==g)continue;for(let A=0,I=G[g].length;A<I;A++){let x=G[g][A];for(p=l;p+=x,!(p&136);){if(!this._board[p])N(o,r,l,p,g);else{if(this._board[p].color===r)break;N(o,r,l,p,g,this._board[p].type,f.CAPTURE);break}if(g===j||g===S)break}}}}if((n===void 0||n===S)&&(!b||m===this._kings[r])){if(this._castling[r]&f.KSIDE_CASTLE){let l=this._kings[r],g=l+2;!this._board[l+1]&&!this._board[g]&&!this._attacked(a,this._kings[r])&&!this._attacked(a,l+1)&&!this._attacked(a,g)&&N(o,r,this._kings[r],g,S,void 0,f.KSIDE_CASTLE)}if(this._castling[r]&f.QSIDE_CASTLE){let l=this._kings[r],g=l-2;!this._board[l-1]&&!this._board[l-2]&&!this._board[l-3]&&!this._attacked(a,this._kings[r])&&!this._attacked(a,l-1)&&!this._attacked(a,g)&&N(o,r,this._kings[r],g,S,void 0,f.QSIDE_CASTLE)}}if(!e||this._kings[r]===-1)return o;let h=[];for(let l=0,g=o.length;l<g;l++)this._makeMove(o[l]),this._isKingAttacked(r)||h.push(o[l]),this._undoMove();return h}move(e,{strict:t=!1}={}){let s=null;if(typeof e=="string")s=this._moveFromSan(e,t);else if(typeof e=="object"){let n=this._moves();for(let o=0,r=n.length;o<r;o++)if(e.from===C(n[o].from)&&e.to===C(n[o].to)&&(!("promotion"in n[o])||e.promotion===n[o].promotion)){s=n[o];break}}if(!s)throw typeof e=="string"?new Error(`Invalid move: ${e}`):new Error(`Invalid move: ${JSON.stringify(e)}`);let i=this._makePretty(s);return this._makeMove(s),i}_push(e){this._history.push({move:e,kings:{b:this._kings.b,w:this._kings.w},turn:this._turn,castling:{b:this._castling.b,w:this._castling.w},epSquare:this._epSquare,halfMoves:this._halfMoves,moveNumber:this._moveNumber})}_makeMove(e){let t=this._turn,s=q(t);if(this._push(e),this._board[e.to]=this._board[e.from],delete this._board[e.from],e.flags&f.EP_CAPTURE&&(this._turn===v?delete this._board[e.to-16]:delete this._board[e.to+16]),e.promotion&&(this._board[e.to]={type:e.promotion,color:t}),this._board[e.to].type===S){if(this._kings[t]=e.to,e.flags&f.KSIDE_CASTLE){let i=e.to-1,n=e.to+1;this._board[i]=this._board[n],delete this._board[n]}else if(e.flags&f.QSIDE_CASTLE){let i=e.to+1,n=e.to-2;this._board[i]=this._board[n],delete this._board[n]}this._castling[t]=0}if(this._castling[t]){for(let i=0,n=y[t].length;i<n;i++)if(e.from===y[t][i].square&&this._castling[t]&y[t][i].flag){this._castling[t]^=y[t][i].flag;break}}if(this._castling[s]){for(let i=0,n=y[s].length;i<n;i++)if(e.to===y[s][i].square&&this._castling[s]&y[s][i].flag){this._castling[s]^=y[s][i].flag;break}}e.flags&f.BIG_PAWN?t===v?this._epSquare=e.to-16:this._epSquare=e.to+16:this._epSquare=-1,e.piece===E?this._halfMoves=0:e.flags&(f.CAPTURE|f.EP_CAPTURE)?this._halfMoves=0:this._halfMoves++,t===v&&this._moveNumber++,this._turn=s}undo(){let e=this._undoMove();return e?this._makePretty(e):null}_undoMove(){let e=this._history.pop();if(e===void 0)return null;let t=e.move;this._kings=e.kings,this._turn=e.turn,this._castling=e.castling,this._epSquare=e.epSquare,this._halfMoves=e.halfMoves,this._moveNumber=e.moveNumber;let s=this._turn,i=q(s);if(this._board[t.from]=this._board[t.to],this._board[t.from].type=t.piece,delete this._board[t.to],t.captured)if(t.flags&f.EP_CAPTURE){let n;s===v?n=t.to-16:n=t.to+16,this._board[n]={type:E,color:i}}else this._board[t.to]={type:t.captured,color:i};if(t.flags&(f.KSIDE_CASTLE|f.QSIDE_CASTLE)){let n,o;t.flags&f.KSIDE_CASTLE?(n=t.to+1,o=t.to-1):(n=t.to-2,o=t.to+1),this._board[n]=this._board[o],delete this._board[o]}return t}pgn({newline:e=`
`,maxWidth:t=0}={}){let s=[],i=!1;for(let h in this._header)s.push("["+h+' "'+this._header[h]+'"]'+e),i=!0;i&&this._history.length&&s.push(e);let n=h=>{let l=this._comments[this.fen()];if(typeof l<"u"){let g=h.length>0?" ":"";h=`${h}${g}{${l}}`}return h},o=[];for(;this._history.length>0;)o.push(this._undoMove());let r=[],a="";for(o.length===0&&r.push(n(""));o.length>0;){a=n(a);let h=o.pop();if(!h)break;if(!this._history.length&&h.color==="b"){let l=`${this._moveNumber}. ...`;a=a?`${a} ${l}`:l}else h.color==="w"&&(a.length&&r.push(a),a=this._moveNumber+".");a=a+" "+this._moveToSan(h,this._moves({legal:!0})),this._makeMove(h)}if(a.length&&r.push(n(a)),typeof this._header.Result<"u"&&r.push(this._header.Result),t===0)return s.join("")+r.join(" ");let c=function(){return s.length>0&&s[s.length-1]===" "?(s.pop(),!0):!1},m=function(h,l){for(let g of l.split(" "))if(g){if(h+g.length>t){for(;c();)h--;s.push(e),h=0}s.push(g),h+=g.length,s.push(" "),h++}return c()&&h--,h},b=0;for(let h=0;h<r.length;h++){if(b+r[h].length>t&&r[h].includes("{")){b=m(b,r[h]);continue}b+r[h].length>t&&h!==0?(s[s.length-1]===" "&&s.pop(),s.push(e),b=0):h!==0&&(s.push(" "),b++),s.push(r[h]),b+=r[h].length}return s.join("")}header(...e){for(let t=0;t<e.length;t+=2)typeof e[t]=="string"&&typeof e[t+1]=="string"&&(this._header[e[t]]=e[t+1]);return this._header}loadPgn(e,{strict:t=!1,newlineChar:s=`\r?
`}={}){function i(d){return d.replace(/\\/g,"\\")}function n(d){let T={},P=d.split(new RegExp(i(s))),F="",B="";for(let K=0;K<P.length;K++){let Y=/^\s*\[\s*([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;F=P[K].replace(Y,"$1"),B=P[K].replace(Y,"$2"),F.trim().length>0&&(T[F]=B)}return T}e=e.trim();let r=new RegExp("^(\\[((?:"+i(s)+")|.)*\\])((?:\\s*"+i(s)+"){2}|(?:\\s*"+i(s)+")*$)").exec(e),a=r&&r.length>=2?r[1]:"";this.reset();let c=n(a),m="";for(let d in c)d.toLowerCase()==="fen"&&(m=c[d]),this.header(d,c[d]);if(!t)m&&this.load(m,!0);else if(c.SetUp==="1"){if(!("FEN"in c))throw new Error("Invalid PGN: FEN tag must be supplied with SetUp tag");this.load(c.FEN,!0)}function b(d){return Array.from(d).map(function(T){return T.charCodeAt(0)<128?T.charCodeAt(0).toString(16):encodeURIComponent(T).replace(/%/g,"").toLowerCase()}).join("")}function h(d){return d.length==0?"":decodeURIComponent("%"+(d.match(/.{1,2}/g)||[]).join("%"))}let l=function(d){return d=d.replace(new RegExp(i(s),"g")," "),`{${b(d.slice(1,d.length-1))}}`},g=function(d){if(d.startsWith("{")&&d.endsWith("}"))return h(d.slice(1,d.length-1))},p=e.replace(a,"").replace(new RegExp(`({[^}]*})+?|;([^${i(s)}]*)`,"g"),function(d,T,P){return T!==void 0?l(T):" "+l(`{${P.slice(1)}}`)}).replace(new RegExp(i(s),"g")," "),A=/(\([^()]+\))+?/g;for(;A.test(p);)p=p.replace(A,"");p=p.replace(/\d+\.(\.\.)?/g,""),p=p.replace(/\.\.\./g,""),p=p.replace(/\$\d+/g,"");let I=p.trim().split(new RegExp(/\s+/));I=I.filter(d=>d!=="");let x="";for(let d=0;d<I.length;d++){let T=g(I[d]);if(T!==void 0){this._comments[this.fen()]=T;continue}let P=this._moveFromSan(I[d],t);if(P==null)if(de.indexOf(I[d])>-1)x=I[d];else throw new Error(`Invalid move in PGN: ${I[d]}`);else x="",this._makeMove(P)}x&&Object.keys(this._header).length&&!this._header.Result&&this.header("Result",x)}_moveToSan(e,t){let s="";if(e.flags&f.KSIDE_CASTLE)s="O-O";else if(e.flags&f.QSIDE_CASTLE)s="O-O-O";else{if(e.piece!==E){let i=ge(e,t);s+=e.piece.toUpperCase()+i}e.flags&(f.CAPTURE|f.EP_CAPTURE)&&(e.piece===E&&(s+=C(e.from)[0]),s+="x"),s+=C(e.to),e.promotion&&(s+="="+e.promotion.toUpperCase())}return this._makeMove(e),this.isCheck()&&(this.isCheckmate()?s+="#":s+="+"),this._undoMove(),s}_moveFromSan(e,t=!1){let s=$(e),i=z(s),n=this._moves({legal:!0,piece:i});for(let h=0,l=n.length;h<l;h++)if(s===$(this._moveToSan(n[h],n)))return n[h];if(t)return null;let o,r,a,c,m,b=!1;if(r=s.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/),r?(o=r[1],a=r[2],c=r[3],m=r[4],a.length==1&&(b=!0)):(r=s.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/),r&&(o=r[1],a=r[2],c=r[3],m=r[4],a.length==1&&(b=!0))),i=z(s),n=this._moves({legal:!0,piece:o||i}),!c)return null;for(let h=0,l=n.length;h<l;h++)if(a){if((!o||o.toLowerCase()==n[h].piece)&&u[a]==n[h].from&&u[c]==n[h].to&&(!m||m.toLowerCase()==n[h].promotion))return n[h];if(b){let g=C(n[h].from);if((!o||o.toLowerCase()==n[h].piece)&&u[c]==n[h].to&&(a==g[0]||a==g[1])&&(!m||m.toLowerCase()==n[h].promotion))return n[h]}}else if(s===$(this._moveToSan(n[h],n)).replace("x",""))return n[h];return null}ascii(){let e=`   +------------------------+
`;for(let t=u.a8;t<=u.h1;t++){if(L(t)===0&&(e+=" "+"87654321"[M(t)]+" |"),this._board[t]){let s=this._board[t].type,n=this._board[t].color===k?s.toUpperCase():s.toLowerCase();e+=" "+n+" "}else e+=" . ";t+1&136&&(e+=`|
`,t+=8)}return e+=`   +------------------------+
`,e+="     a  b  c  d  e  f  g  h",e}perft(e){let t=this._moves({legal:!1}),s=0,i=this._turn;for(let n=0,o=t.length;n<o;n++)this._makeMove(t[n]),this._isKingAttacked(i)||(e-1>0?s+=this.perft(e-1):s++),this._undoMove();return s}_makePretty(e){let{color:t,piece:s,from:i,to:n,flags:o,captured:r,promotion:a}=e,c="";for(let l in f)f[l]&o&&(c+=ne[l]);let m=C(i),b=C(n),h={color:t,piece:s,from:m,to:b,san:this._moveToSan(e,this._moves({legal:!0})),flags:c,lan:m+b,before:this.fen(),after:""};return this._makeMove(e),h.after=this.fen(),this._undoMove(),r&&(h.captured=r),a&&(h.promotion=a,h.lan+=a),h}turn(){return this._turn}board(){let e=[],t=[];for(let s=u.a8;s<=u.h1;s++)this._board[s]==null?t.push(null):t.push({square:C(s),type:this._board[s].type,color:this._board[s].color}),s+1&136&&(e.push(t),t=[],s+=8);return e}squareColor(e){if(e in u){let t=u[e];return(M(t)+L(t))%2===0?"light":"dark"}return null}history({verbose:e=!1}={}){let t=[],s=[];for(;this._history.length>0;)t.push(this._undoMove());for(;;){let i=t.pop();if(!i)break;e?s.push(this._makePretty(i)):s.push(this._moveToSan(i,this._moves())),this._makeMove(i)}return s}_pruneComments(){let e=[],t={},s=i=>{i in this._comments&&(t[i]=this._comments[i])};for(;this._history.length>0;)e.push(this._undoMove());for(s(this.fen());;){let i=e.pop();if(!i)break;this._makeMove(i),s(this.fen())}this._comments=t}getComment(){return this._comments[this.fen()]}setComment(e){this._comments[this.fen()]=e.replace("{","[").replace("}","]")}deleteComment(){let e=this._comments[this.fen()];return delete this._comments[this.fen()],e}getComments(){return this._pruneComments(),Object.keys(this._comments).map(e=>({fen:e,comment:this._comments[e]}))}deleteComments(){return this._pruneComments(),Object.keys(this._comments).map(e=>{let t=this._comments[e];return delete this._comments[e],{fen:e,comment:t}})}setCastlingRights(e,t){for(let i of[S,R])t[i]!==void 0&&(t[i]?this._castling[e]|=O[i]:this._castling[e]&=~O[i]);this._updateCastlingRights();let s=this.getCastlingRights(e);return(t[S]===void 0||t[S]===s[S])&&(t[R]===void 0||t[R]===s[R])}getCastlingRights(e){return{[S]:(this._castling[e]&O[S])!==0,[R]:(this._castling[e]&O[R])!==0}}moveNumber(){return this._moveNumber}};export{me as a,be as b,J as c};
/*! Bundled license information:

chess.js/dist/esm/chess.js:
  (**
   * @license
   * Copyright (c) 2023, Jeff Hlywa (jhlywa@gmail.com)
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   *    this list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the documentation
   *    and/or other materials provided with the distribution.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)
*/
//# sourceMappingURL=chunk-VF6LVY7D.js.map