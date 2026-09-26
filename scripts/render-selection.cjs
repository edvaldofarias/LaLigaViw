// Assemble the selection with untouched original photographs and official crests.
const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const {readFile,writeFile,mkdir}=require('node:fs/promises');
const path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const {championshipSelections}=await import('../dist/selections.mjs');
 const {isGoalkeeper}=await import('../dist/goalkeepers.mjs');
 const {contain}=await import('../dist/poster-assets.mjs');
 const round=championshipSelections.find(r=>r.id===(process.argv[2]||'2026-round-1'));
 if(!round||round.players.length!==7)throw Error('A seven-player selection is required');
 if(round.players.filter(p=>isGoalkeeper(p.playerId,p.teamId)).length>1)throw Error('Only one goalkeeper is allowed');
 const photoRoot=path.join(root,'assets/selections',`round-${round.roundNumber}`);
 const sources=JSON.parse(await readFile(path.join(photoRoot,'sources.json'),'utf8'));
 const data=JSON.parse(await readFile(path.join(root,'dist/data.json'),'utf8'));
 GlobalFonts.registerFromPath('/System/Library/Fonts/Supplemental/Impact.ttf','Poster');
 GlobalFonts.registerFromPath('/System/Library/Fonts/Supplemental/Arial Bold.ttf','LabelBold');
 GlobalFonts.registerFromPath('/System/Library/Fonts/Supplemental/Arial.ttf','Label');
 const canvas=createCanvas(1080,1350),ctx=canvas.getContext('2d');
 ctx.drawImage(await loadImage(path.join(root,'assets/selections/background-gold-blue.png')),0,0,1080,1350);
 const gold=ctx.createLinearGradient(0,0,1080,0);gold.addColorStop(0,'#a86b13');gold.addColorStop(.28,'#fff0a0');gold.addColorStop(.52,'#e8b83c');gold.addColorStop(.75,'#fff0a0');gold.addColorStop(1,'#a86b13');
 function text(value,x,y,size,color='#fff',family='LabelBold',maxWidth=1000){ctx.textAlign='center';ctx.fillStyle=color;do{ctx.font=`${size}px ${family}`;if(ctx.measureText(value).width<=maxWidth)break;size--;}while(size>12);ctx.fillText(value,x,y)}
 const logo=await loadImage(path.join(root,'dist/images/viw-logo-transparent.png'));contain(ctx,logo,56,34,138,138);
 text('SELEÇÃO',599,112,112,gold,'Poster',750);
 text('DA RODADA',599,177,66,'#fff','Poster',740);
 text(`COPA LA LIGA VIW  ${round.season}  •  ${round.roundNumber}ª RODADA`,590,213,22,'#e6c76a');
 ctx.fillStyle='#18bced';ctx.fillRect(256,229,672,3);
 // Pitch lines connect the cards without implying unreported player positions.
 ctx.save();ctx.strokeStyle='rgba(228,200,119,.23)';ctx.lineWidth=2;
 ctx.beginPath();ctx.moveTo(288,275);ctx.lineTo(792,275);ctx.lineTo(1000,1222);ctx.lineTo(80,1222);ctx.closePath();ctx.stroke();
 ctx.beginPath();ctx.moveTo(180,760);ctx.lineTo(900,760);ctx.stroke();ctx.beginPath();ctx.ellipse(540,760,128,65,0,0,Math.PI*2);ctx.stroke();ctx.restore();
 const positions=[[410,258],[410,501],[128,744],[410,744],[692,744],[269,987],[551,987]];
 const colors={'-OuCE3jNN_OU-QexjdHw':'#db7020','-OuCE79e187h1srqNCAK':'#d4a600','-OuCE8ygQVY-3BXzP80H':'#c82b35','-OuCEUdiPg-VFiAmxP-W':'#913abd'};
 for(const [i,p] of round.players.entries()){
  const source=sources.find(s=>s.playerId===p.playerId);if(!source)throw Error('Missing photo: '+p.name);
  const photo=await loadImage(path.join(photoRoot,p.playerId+(source.url.includes('.png?')?'.png':'.jpg')));
  const t=data.teams[p.teamId];const crest=await loadImage(path.join(root,'dist/images/teams',p.teamId+(t.url.includes('.png?')?'.png':'.jpg')));
  const [x,y]=positions[i],w=260,photoH=174;
  const bg=ctx.createLinearGradient(x,y,x+w,y+photoH);bg.addColorStop(0,'#07101d');bg.addColorStop(.5,colors[p.teamId]||'#175d7d');bg.addColorStop(1,'#08111c');
  ctx.fillStyle=bg;ctx.fillRect(x,y,w,photoH);ctx.strokeStyle=gold;ctx.lineWidth=3;ctx.strokeRect(x,y,w,photoH);
  // Full photograph, original pixels and aspect ratio: no AI faces or retouching.
  contain(ctx,photo,x+40,y+3,180,photoH-6);
  ctx.fillStyle='rgba(255,255,255,.95)';ctx.beginPath();ctx.roundRect(x+w-55,y+9,46,52,4);ctx.fill();contain(ctx,crest,x+w-51,y+13,38,44);
  ctx.beginPath();ctx.moveTo(x+8,y+photoH-1);ctx.lineTo(x+w-8,y+photoH-1);ctx.lineTo(x+w+4,y+photoH+33);ctx.lineTo(x-4,y+photoH+33);ctx.closePath();ctx.fillStyle='#050b13';ctx.fill();ctx.strokeStyle=gold;ctx.lineWidth=2;ctx.stroke();
  text(p.name.toUpperCase(),x+w/2,y+photoH+24,26,'#fff','Poster',w-24);
  ctx.fillStyle=gold;ctx.fillRect(x+7,y+photoH+34,w-14,26);
  text(p.teamName.toUpperCase(),x+w/2,y+photoH+53,16,'#07101c','LabelBold',w-28);
 }
 text('COPA LA LIGA VIW 2026',540,1268,27,gold,'LabelBold',800);
 text('SELEÇÃO OFICIAL  •  ORGANIZAÇÃO VIW',540,1303,17,'#d2dae2','Label',800);
 const output=path.join(root,'dist',round.poster.split('?')[0]);await mkdir(path.dirname(output),{recursive:true});await writeFile(output,canvas.toBuffer('image/png'));console.log(output);
})().catch(e=>{console.error(e);process.exitCode=1});
