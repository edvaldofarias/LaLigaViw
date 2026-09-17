import {visitorResponse} from './visitors.mjs';
export default {async fetch(request,env){
  if(new URL(request.url).pathname==='/api/visitors')return visitorResponse(request,env);
  if(new URL(request.url).pathname==='/api/version'){
    const asset=await env.ASSETS.fetch(new Request(new URL('/version.json',request.url)));
    return new Response(asset.body,{status:asset.status,headers:{'Content-Type':'application/json','Cache-Control':'no-store, max-age=0'}});
  }
  return env.ASSETS.fetch(request);
}};
