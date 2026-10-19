import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('manifest installs the root site with correctly sized VIW icons',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../dist/manifest.webmanifest',import.meta.url)));
  assert.equal(manifest.display,'standalone');
  assert.equal(manifest.id,'/');
  assert.equal(manifest.scope,'/');
  assert.equal(manifest.start_url,'/#overview');
  for(const size of [192,512]){
    const icon=manifest.icons.find(i=>i.sizes===`${size}x${size}`);
    assert.ok(icon);
    const png=readFileSync(new URL('../dist'+icon.src,import.meta.url));
    assert.equal(png.readUInt32BE(16),size);
    assert.equal(png.readUInt32BE(20),size);
  }
});
