const instances=new Map();
const language={emptyTable:'Nenhum registro disponível',info:'Mostrando _START_ a _END_ de _TOTAL_',infoEmpty:'Nenhum registro',infoFiltered:'(de _MAX_ registros)',lengthMenu:'Exibir _MENU_',search:'Buscar:',zeroRecords:'Nenhum resultado encontrado',paginate:{first:'Primeira',last:'Última',next:'Próxima',previous:'Anterior'},aria:{orderable:'Ordenar por esta coluna',orderableReverse:'Inverter ordenação'}};
let scheduled=false;
function enhance(){
 scheduled=false;
 for(const [table,api] of instances)if(!table.isConnected){api.destroy();instances.delete(table)}
 document.querySelectorAll('button.button').forEach(b=>b.classList.add('btn','btn-outline-primary'));
 document.querySelectorAll('.filters select,.selection-toolbar select').forEach(e=>e.classList.add('form-select'));
 document.querySelectorAll('.filters input').forEach(e=>e.classList.add('form-control'));
 document.querySelectorAll('.panel').forEach(e=>e.classList.add('card'));
 if(!window.DataTable)return;
 const route=location.hash.slice(1)||'overview';
 for(const table of document.querySelectorAll('#content table,#detail-content table')){
  if(instances.has(table)||!table.tHead||!table.tBodies[0]?.rows.length)continue;
  if([...table.rows].some(r=>[...r.cells].some(c=>c.colSpan>1)))continue;
  const main=table.closest('#content'),full=table.classList.contains('full-table');
  const paged=!!main&&['players','ballon'].includes(route);
  table.classList.add('table','table-hover','align-middle');table.style.width='100%';
  const headers=[...table.tHead.rows[0].cells].map(c=>c.textContent.trim());
  const priorities=headers.map((h,i)=>({targets:i,responsivePriority:['Jogador','Técnico/Professor'].includes(h)?1:['Pontos','G','Aprov.'].includes(h)?2:h==='Equipe'?3:h==='#'?4:10+i}));
  try{
   const api=new window.DataTable(table,{language,order:[],ordering:true,paging:paged,pageLength:20,lengthMenu:[10,20,50,100],searching:!!main&&full,info:paged,autoWidth:false,responsive:{details:{type:'inline',target:'td:first-child'}},columnDefs:priorities,layout:{topStart:paged?'pageLength':null,topEnd:main&&full?'search':null,bottomStart:paged?'info':null,bottomEnd:paged?'paging':null}});
   instances.set(table,api);table.parentElement.classList.add('enhanced-table');
   if(paged){table.closest('.panel')?.querySelector(':scope > .pagination')?.remove();document.querySelector('.filters input[data-filter="query"]')?.remove();}
  }catch(e){console.warn('A tabela permanece disponível no formato simples.',e)}
 }
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(enhance)}}
const observer=new MutationObserver(schedule);for(const id of ['content','detail-content']){const root=document.getElementById(id);if(root)observer.observe(root,{childList:true,subtree:true})}
window.addEventListener('hashchange',schedule);document.getElementById('detail')?.addEventListener('close',schedule);schedule();
