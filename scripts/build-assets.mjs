import {readdir,mkdir,cp,rm,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../dist/',import.meta.url),client=new URL('client/',root);
await rm(client,{recursive:true,force:true});
await mkdir(client,{recursive:true});
for(const entry of await readdir(root)){if(['server','client','.openai'].includes(entry))continue;await cp(new URL(entry,root),new URL(entry,client),{recursive:true});}
// Angular owns the production entrypoint and compiled UI; domain data remain in dist.
await cp(new URL('../.angular-output/browser/',import.meta.url),client,{recursive:true});
await cp(new URL('../.angular-output/3rdpartylicenses.txt',import.meta.url),new URL('3rdpartylicenses.txt',client));
async function filesAt(dir){const paths=[];for(const entry of await readdir(dir,{withFileTypes:true})){const path=new URL(entry.name+(entry.isDirectory()?'/':''),dir);if(entry.isDirectory())paths.push(...await filesAt(path));else paths.push(path)}return paths.sort((a,b)=>a.href.localeCompare(b.href));}
const files=await filesAt(client),hash=createHash('sha256');
for(const file of files){hash.update(file.href.slice(client.href.length));hash.update(await readFile(file));}
hash.update(await readFile(new URL('server/index.js',root)));
const forceReload=process.env.SITE_FORCE_RELOAD==='1';hash.update(String(forceReload));
const version=hash.digest('hex').slice(0,16);
for(const file of files){
  if(/\.(mjs|js)$/.test(file.pathname)){
    const content=(await readFile(file,'utf8')).replace(/from (['"])(\.\/[^'"]+\.(?:mjs|js))\1/g,(_m,q,path)=>`from ${q}${path}?v=${version}${q}`);
    await writeFile(file,content);
  }
}
const htmlFile=new URL('index.html',client);
const html=(await readFile(htmlFile,'utf8')).replace('__BUILD_VERSION__',version);
await writeFile(htmlFile,html);
await writeFile(new URL('version.json',client),JSON.stringify({version,forceReload}));
console.log('Static site assets copied to dist/client.');
