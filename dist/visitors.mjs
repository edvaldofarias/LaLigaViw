let inFlight=false,lastCount=null;
export async function updateVisitors(){
  const node=document.querySelector('#visitor-count');
  if(!node||inFlight||document.visibilityState==='hidden')return;
  inFlight=true;
  try{
    const response=await fetch('/api/visitors',{method:'POST',credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw Error();
    const data=await response.json();
    if(!Number.isInteger(data.total)||!Number.isInteger(data.today))throw Error();
    lastCount=data;
    node.textContent=`${data.total.toLocaleString('pt-BR')} ${data.total===1?'visitante':'visitantes'} no site · ${data.today.toLocaleString('pt-BR')} hoje`;
    node.title='Visitantes únicos por navegador. Hoje considera o horário de Brasília. '+(data.since?'Contagem desde '+data.since.split('-').reverse().join('/')+'.':'');
  }catch{node.textContent=lastCount?'Contagem temporariamente indisponível':'Contagem de visitantes indisponível';}
  finally{inFlight=false;}
}
