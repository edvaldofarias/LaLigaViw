const zone='America/Sao_Paulo';
const day=globalThis.dayjs;
if(day){day.extend(globalThis.dayjs_plugin_utc);day.extend(globalThis.dayjs_plugin_timezone);day.locale('pt-br');}
export function brasiliaDate(value,opts={day:'2-digit',month:'short'}){
 if(!value)return 'Data a definir';
 if(!day)return new Intl.DateTimeFormat('pt-BR',{...opts,timeZone:zone}).format(new Date(value));
 const date=day(value).tz(zone);
 const parts=[];if(opts.weekday)parts.push(date.format(opts.weekday==='long'?'dddd':'ddd')+',');if(opts.day)parts.push(date.format(opts.day==='2-digit'?'DD':'D'));if(opts.month)parts.push('de',date.format(opts.month==='long'?'MMMM':opts.month==='numeric'?'M':'MMM'));if(opts.year)parts.push('de',date.format('YYYY'));return parts.join(' ');
}
export function brasiliaTime(value){return !value?'Horário a definir':day?day(value).tz(zone).format('HH:mm'):new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:zone}).format(new Date(value));}
