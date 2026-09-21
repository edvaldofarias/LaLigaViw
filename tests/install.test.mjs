import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../dist/install.mjs',import.meta.url),'utf8');
function setup(installed=false){
  const windowEvents={},elements={};
  for(const id of ['install-app','install-dialog','install-native','install-status','close-install']){
    elements[id]={hidden:true,open:false,listeners:{},addEventListener(e,fn){this.listeners[e]=fn},showModal(){this.open=true},close(){this.open=false}};
  }
  vm.runInNewContext(source,{
    document:{querySelector:s=>elements[s.slice(1)]},
    window:{matchMedia:()=>({matches:installed,addEventListener(){}}),addEventListener:(e,fn)=>windowEvents[e]=fn},navigator:{}
  });
  return {windowEvents,elements};
}
test('unsupported browsers get instructions, standalone windows hide installation',()=>{
  const {elements}=setup();
  assert.equal(elements['install-app'].hidden,false);
  assert.equal(elements['install-native'].hidden,true);
  elements['install-app'].listeners.click();
  assert.equal(elements['install-dialog'].open,true);
  elements['close-install'].listeners.click();
  assert.equal(elements['install-dialog'].open,false);
  assert.equal(setup(true).elements['install-app'].hidden,true);
});
test('native installation is requested only by a click and consumed once; confirmed installation hides controls',async()=>{
  const {windowEvents,elements}=setup();let prompts=0,prevented=false;
  windowEvents.beforeinstallprompt({preventDefault(){prevented=true},async prompt(){prompts++},userChoice:Promise.resolve({outcome:'accepted'})});
  assert.equal(prevented,true);assert.equal(prompts,0);assert.equal(elements['install-native'].hidden,false);
  await elements['install-native'].listeners.click();
  assert.equal(prompts,1);assert.equal(elements['install-native'].hidden,true);
  assert.equal(elements['install-app'].hidden,false); // Acceptance alone is not proof of installation.
  windowEvents.appinstalled();assert.equal(elements['install-app'].hidden,true);
});
test('cancelled and failed prompts leave manual installation available',async()=>{
  for(const reject of [false,true]){
    const {windowEvents,elements}=setup();
    windowEvents.beforeinstallprompt({preventDefault(){},async prompt(){if(reject)throw Error('Unavailable')},userChoice:Promise.resolve({outcome:'dismissed'})});
    await elements['install-native'].listeners.click();
    assert.equal(elements['install-app'].hidden,false);assert.equal(elements['install-app'].disabled,false);
    assert.equal(elements['install-native'].hidden,true);assert.equal(elements['install-status'].hidden,false);
    assert.match(elements['install-status'].textContent,/menu do navegador/);
  }
});
test('manifest installs the root site with correctly sized VIW icons',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../dist/manifest.webmanifest',import.meta.url)));
  assert.equal(manifest.display,'standalone');assert.equal(manifest.id,'/');assert.equal(manifest.scope,'/');
  assert.equal(manifest.start_url,'/#overview');
  for(const size of [192,512]){
    const icon=manifest.icons.find(i=>i.sizes===`${size}x${size}`);
    assert.ok(icon);const png=readFileSync(new URL('../dist'+icon.src,import.meta.url));
    assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);
  }
});
