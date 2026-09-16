// Compose a poster using the original photos. No generative player edits,
// retouching, filters, background replacement, or photo cropping are applied.
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const { readFile, writeFile, mkdir } = require('node:fs/promises');
const path = require('node:path');

(async()=>{
  const root=path.resolve(__dirname,'..');
  const {championshipSelections}=await import('../dist/selections.mjs');
  const round=championshipSelections.find(r=>r.id===(process.argv[2]||'2026-round-1'));
  if(!round)throw new Error('Unknown selection round');
  if(round.players.length!==7)throw new Error('This composition expects seven selected players');
  const photoRoot=path.join(root,'assets/selections',`round-${round.roundNumber}`);
  const sources=JSON.parse(await readFile(path.join(photoRoot,'sources.json'),'utf8'));
  GlobalFonts.registerFromPath('/System/Library/Fonts/Supplemental/Impact.ttf','Poster');
  GlobalFonts.registerFromPath('/System/Library/Fonts/Supplemental/Arial Bold.ttf','LabelBold');
  GlobalFonts.registerFromPath('/System/Library/Fonts/Supplemental/Arial.ttf','Label');
  const canvas=createCanvas(1080,1350),ctx=canvas.getContext('2d');
  ctx.drawImage(await loadImage(path.join(root,'assets/selections/background.png')),0,0,1080,1350);
  const ink='#111a2b',lime='#c7ef60';
  const text=(value,x,y,font,color,align='center')=>{
    ctx.font=font;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(value,x,y);
  };
  ctx.fillStyle=lime;ctx.fillRect(52,52,54,4);ctx.fillRect(974,52,54,4);
  text('LA LIGA VIW  /  '+round.season,540,65,'bold 26px LabelBold','#ffffff');
  text('SELEÇÃO',540,196,'110px Poster','#ffffff');
  text(`DA ${round.roundNumber}ª RODADA`,540,261,'60px Poster',lime);
  const w=227,h=350,gap=22;
  for(const [i,p] of round.players.entries()){
    const source=sources.find(s=>s.playerId===p.playerId);
    if(!source)throw new Error('Missing original photo: '+p.name);
    const photo=await loadImage(path.join(photoRoot,p.playerId+(source.url.includes('.png?')?'.png':'.jpg')));
    const row=i<3?0:1,index=i<3?i:i-3,count=row===0?3:4;
    const x=Math.round((1080-count*w-(count-1)*gap)/2+index*(w+gap)),y=row===0?308:704;
    ctx.fillStyle='#ffffff';ctx.fillRect(x,y,w,h);
    // Preserve the full original frame and aspect ratio.
    const photoHeight=w*photo.height/photo.width;
    ctx.drawImage(photo,x,y,w,photoHeight);
    ctx.fillStyle=lime;ctx.fillRect(x,y+photoHeight,w,4);
    text(p.name,x+w/2,y+photoHeight+34,'bold 25px LabelBold',ink);
    text(p.teamName,x+w/2,y+photoHeight+61,'18px Label','#5e6777');
  }
  ctx.fillStyle=lime;ctx.fillRect(460,1110,160,3);
  text('OS DESTAQUES DA RODADA',540,1160,'bold 26px LabelBold','#ffffff');
  text('Sete jogadores. Uma seleção.',540,1200,'23px Label','#c4cedc');
  text('FOTOS ORIGINAIS DOS JOGADORES',540,1290,'16px Label','#b7c3d2');
  const output=path.join(root,'dist',round.poster);
  await mkdir(path.dirname(output),{recursive:true});
  await writeFile(output,canvas.toBuffer('image/png'));
  console.log(output);
})();
