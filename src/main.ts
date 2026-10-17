import {bootstrapApplication} from '@angular/platform-browser';
import {provideZonelessChangeDetection} from '@angular/core';
import {provideRouter,withHashLocation} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {AppComponent} from './app/app.component';
import {SECTIONS} from './app/core/models';
// Preserve all existing shared URLs, e.g. #matches -> #/matches.
if(/^#[a-z]/i.test(location.hash))history.replaceState(null,'',location.pathname+location.search+'#/'+location.hash.slice(1));
bootstrapApplication(AppComponent,{providers:[provideZonelessChangeDetection(),provideHttpClient(),provideRouter([...SECTIONS.map(([view])=>({path:view,loadComponent:()=>import('./app/pages/competition-page.component').then(m=>m.CompetitionPageComponent),data:{view}})),{path:'',pathMatch:'full',redirectTo:'overview'},{path:'**',redirectTo:'overview'}],withHashLocation())]}).catch(error=>{console.error(error);const root=document.querySelector('app-root');if(root)root.textContent='Não foi possível iniciar a aplicação. Recarregue a página.';});
