// Load PhotoSwipe only when an artwork is opened; keep download links unchanged.
let viewer=null;
const selector='.selection-art-preview img,.motm-poster-image,.match-flyer-image';
document.addEventListener('click',async e=>{
 const img=e.target.closest(selector);if(!img)return;
 e.preventDefault();const src=img.currentSrc||img.src;if(!img.complete||!img.naturalWidth)return;
 const {default:PhotoSwipe}=await import('./vendor/photoswipe-5.4.4.esm.js');
 viewer?.close();viewer=new PhotoSwipe({dataSource:[{src,width:img.naturalWidth,height:img.naturalHeight,alt:img.alt}],appendToEl:img.closest('dialog')||document.body,showHideAnimationType:'none',closeTitle:'Fechar',zoomTitle:'Ampliar',arrowPrevTitle:'Anterior',arrowNextTitle:'Próxima',errorMsg:'Não foi possível carregar a imagem.'});viewer.init();
});
document.getElementById('detail')?.addEventListener('close',()=>viewer?.close());
