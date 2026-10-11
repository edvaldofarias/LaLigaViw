const navigation=document.querySelector('#competition-navigation');
const toggle=document.querySelector('#navigation-toggle');
const current=document.querySelector('#navigation-current');
const links=[...document.querySelectorAll('#competition-tabs a')];
if(navigation&&toggle&&current){
 const compact=window.matchMedia('(max-width: 1399px)');
 function close(restoreFocus=false){navigation.classList.remove('is-open');document.querySelector('#competition-tabs')?.classList.remove('show');toggle.setAttribute('aria-expanded','false');if(restoreFocus&&compact.matches)toggle.focus();}
 function sync(){const link=links.find(a=>a.hash===location.hash)||links[0];current.textContent=link.textContent;for(const a of links){const active=a===link;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}}
 toggle.addEventListener('click',()=>{const open=!navigation.classList.contains('is-open');navigation.classList.toggle('is-open',open);document.querySelector('#competition-tabs')?.classList.toggle('show',open);toggle.setAttribute('aria-expanded',String(open));});
 navigation.addEventListener('keydown',e=>{if(e.key==='Escape'&&navigation.classList.contains('is-open')){e.preventDefault();close(true);}});
 for(const a of links)a.addEventListener('click',()=>close(true));
 window.addEventListener('hashchange',()=>{sync();close(navigation.contains(document.activeElement));});
 compact.addEventListener('change',()=>{const wasInside=navigation.contains(document.activeElement);close(compact.matches&&wasInside);if(!compact.matches&&document.activeElement===toggle)(links.find(a=>a.hash===location.hash)||links[0]).focus();});
 sync();navigation.classList.add('navigation-ready');
}
