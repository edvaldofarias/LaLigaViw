// Installation is progressive: browsers without a native prompt get instructions.
// No offline cache: scores and the existing version checks keep using the network.
const button=document.querySelector('#install-app');
const dialog=document.querySelector('#install-dialog');
const nativeButton=document.querySelector('#install-native');
const status=document.querySelector('#install-status');
const standalone=window.matchMedia('(display-mode: standalone)');
let deferredPrompt=null,installed=false;
function update(){
  button.hidden=installed||standalone.matches||navigator.standalone===true;
  nativeButton.hidden=!deferredPrompt;
}
function message(text){status.textContent=text;status.hidden=!text;}
function showInstructions(){if(!dialog.open)dialog.showModal();}
async function install(){
  if(!deferredPrompt){showInstructions();return;}
  const prompt=deferredPrompt;
  deferredPrompt=null;
  button.disabled=nativeButton.disabled=true;
  try{
    await prompt.prompt();
    const choice=await prompt.userChoice;
    if(choice.outcome==='accepted'){
      message('Instalação solicitada. Confirme as etapas do navegador e procure o ícone La Liga Viw na tela inicial.');
    }else{
      message('Você pode instalar depois pelo menu do navegador.');
    }
  }catch{message('Use o menu do navegador e siga as instruções abaixo para instalar.');showInstructions();}
  finally{button.disabled=nativeButton.disabled=false;update();}
}
window.addEventListener('beforeinstallprompt',event=>{
  event.preventDefault();deferredPrompt=event;update();
});
window.addEventListener('appinstalled',()=>{
  installed=true;deferredPrompt=null;update();if(dialog.open)dialog.close();
});
standalone.addEventListener('change',update);
window.addEventListener('pageshow',update);
button.addEventListener('click',()=>{message('');showInstructions();});
nativeButton.addEventListener('click',install);
document.querySelector('#close-install').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{
  if(event.target!==dialog)return;
  const r=dialog.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
});
update();
