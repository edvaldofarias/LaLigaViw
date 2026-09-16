import {visitorResponse} from './visitors.mjs';
export default {async fetch(request,env){
  if(new URL(request.url).pathname==='/api/visitors')return visitorResponse(request,env);
  return env.ASSETS.fetch(request);
}};
