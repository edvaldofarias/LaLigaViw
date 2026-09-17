export function createVersionCheck(currentVersion,fetchVersion,onUpdate){
  let pending=false,announced='';
  return async()=>{
    if(pending)return;
    pending=true;
    try{
      const data=await fetchVersion();
      if(typeof data?.version==='string'&&/^[a-f0-9]{16}$/.test(data.version)&&data.version!==currentVersion&&data.version!==announced){
        announced=data.version;onUpdate(data);
      }
    }catch{/* Offline or failed checks must not interrupt the page. */}
    finally{pending=false;}
  };
}
export function reloadURL(currentURL,version){const url=new URL(currentURL);url.searchParams.set('v',version);return url.href}
export function startVersionChecks(){
  const current=document.querySelector('meta[name="app-version"]')?.content;
  if(!/^[a-f0-9]{16}$/.test(current||''))return;
  const dialog=document.querySelector('#version-dialog'),reload=document.querySelector('#reload-version');
  const check=createVersionCheck(current,async()=>{
    const response=await fetch('/api/version',{cache:'no-store',signal:AbortSignal.timeout(8000)});
    if(!response.ok)throw Error();return response.json();
  },data=>{
    const apply=()=>location.assign(reloadURL(location.href,data.version));
    if(data.forceReload===true){
      try{if(sessionStorage.getItem('laliga-version-reload')!==data.version){sessionStorage.setItem('laliga-version-reload',data.version);apply();return}}catch{}
    }
    reload.onclick=apply;
    if(!dialog.open)dialog.showModal();
  });
  const visibleCheck=()=>{if(document.visibilityState==='visible')check()};
  document.querySelector('#later-version').addEventListener('click',()=>dialog.close());
  document.addEventListener('visibilitychange',visibleCheck);
  window.addEventListener('pageshow',visibleCheck);
  window.addEventListener('online',visibleCheck);
  setInterval(visibleCheck,60000);
  visibleCheck();
}
