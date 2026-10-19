import {visitorResponse} from './visitors.mjs';
import {votesResponse} from './votes.mjs';
import {poolResponse} from './pool.mjs';
import {userResponse} from './users.mjs';
export default {async fetch(request,env){
  const path=new URL(request.url).pathname;
  if(path==='/api/visitors')return visitorResponse(request,env);
  if(path==='/api/votes/config'||path.startsWith('/api/votes/'))return votesResponse(request,env);
  if(path.startsWith('/api/pool/'))return poolResponse(request,env);
  if(path.startsWith('/api/user/'))return userResponse(request,env);
  if(path==='/api/version'){
    const asset=await env.ASSETS.fetch(new Request(new URL('/version.json',request.url)));
    return new Response(asset.body,{status:asset.status,headers:{'Content-Type':'application/json','Cache-Control':'no-store, max-age=0'}});
  }
  return env.ASSETS.fetch(request);
}};
