export const VIW_LOGO='images/viw-logo.png';
export function browserImage(url){return new Promise((resolve,reject)=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Não foi possível carregar uma imagem da arte. Tente novamente.'));img.src=url})}
export function contain(ctx,img,x,y,w,h){const scale=Math.min(w/img.width,h/img.height);ctx.drawImage(img,x+(w-img.width*scale)/2,y+(h-img.height*scale)/2,img.width*scale,img.height*scale)}
export function fitText(ctx,text,x,y,maxWidth,fontSize,color='#fff',weight='bold'){
  ctx.fillStyle=color;let size=fontSize;do{ctx.font=`${weight} ${size}px Arial`;if(ctx.measureText(text).width<=maxWidth)break;size--}while(size>12);ctx.fillText(text,x,y);
}
