// Verify the same renderer used by the browser with untouched local photographs.
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const fs=require('node:fs/promises'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..'),out=process.argv[2]||'/tmp/viw-motm';await fs.mkdir(out,{recursive:true});
 const data=JSON.parse(await fs.readFile(path.join(root,'dist/data.json'),'utf8'));
 const {matchAwards}=await import('../dist/awards.mjs'),{makeMotmPoster}=await import('../dist/motm-poster.mjs');
 for(const award of matchAwards){
 const m={id:award.matchId,...data.matchs[award.matchId]};
 const canvas=await makeMotmPoster(m,data,award,{canvas:createCanvas(1080,1350),loadImage:u=>loadImage(path.join(root,'dist',u))});
 await fs.writeFile(path.join(out,`${award.matchId}.png`),canvas.toBuffer('image/png'));
 }
 const {makeMatchFlyer}=await import('../dist/match-flyer.mjs'),{nextRoundMatches}=await import('../dist/match-preview.mjs');
 const m=nextRoundMatches(data)[0];if(m){const canvas=await makeMatchFlyer(m,data,'Rodada 2',{canvas:createCanvas(1080,1350),loadImage:u=>loadImage(path.join(root,'dist',u))});await fs.writeFile(path.join(out,'next-round.png'),canvas.toBuffer('image/png'))}
 console.log('Rendered all five award posters and upcoming flyer in '+out);
})().catch(e=>{console.error(e);process.exitCode=1});
