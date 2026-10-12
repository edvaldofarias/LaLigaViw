const navigation=document.querySelector('#competition-navigation');
const toggle=document.querySelector('#navigation-toggle');
const current=document.querySelector('#navigation-current');
const menu=document.querySelector('#competition-tabs');
const links=[...document.querySelectorAll('#competition-tabs a')];
if(navigation&&toggle&&current&&menu){
 const compact=window.matchMedia('(max-width:1399px)');
 function close(focus=false){globalThis.bootstrap?.Collapse.getOrCreateInstance(menu,{toggle:false}).hide();if(focus&&compact.matches)toggle.focus();}
 function sync(){const active=links.find(a=>a.hash===location.hash)||links[0];current.textContent=active.textContent;for(const a of links){a.classList.toggle('active',a===active);if(a===active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}}
 navigation.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('show')){e.preventDefault();close(true);}});
 links.forEach(a=>a.addEventListener('click',()=>close(true)));window.addEventListener('hashchange',()=>{sync();close();});compact.addEventListener('change',()=>close());sync();
}
