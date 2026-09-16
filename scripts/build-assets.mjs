import {readdir,mkdir,cp,rm} from 'node:fs/promises';
const root=new URL('../dist/',import.meta.url),client=new URL('client/',root);
await rm(client,{recursive:true,force:true});
await mkdir(client,{recursive:true});
for(const entry of await readdir(root)){if(['server','client','.openai'].includes(entry))continue;await cp(new URL(entry,root),new URL(entry,client),{recursive:true});}
console.log('Static site assets copied to dist/client.');
