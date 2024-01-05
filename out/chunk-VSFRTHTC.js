import{c as t}from"./chunk-HEEDEGUW.js";var i="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",r={type:"object",required:["pgn","fen"],properties:{pgn:{description:"Game in PGN format.",type:["string","null"]},fen:{description:"Game in FEN format.",type:["string","null"]}}};Zilch.configSchema=r;Zilch.configPresets=[{name:"Standard",value:`{
  "pgn": null,
  "fen": "${i}"
}
`}];Zilch.parseConfig=e=>{let n=new t;if(e.pgn&&e.fen)throw new Error("Specify either PGN or FEN but not both.");return e.pgn?n.loadPgn(e.pgn):e.fen&&n.load(e.fen),{fen:n.fen()}};Zilch.serializeConfig=e=>e.fen;Zilch.summarizeConfig=e=>e.fen==="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"?"standard starting position":"custom starting position";export{i as a};
//# sourceMappingURL=chunk-VSFRTHTC.js.map
