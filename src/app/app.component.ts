import {Component,inject,afterNextRender,signal,computed} from '@angular/core';
import {RouterOutlet,RouterLink,RouterLinkActive,Router,NavigationEnd} from '@angular/router';
import {CompetitionService} from './core/competition.service';
import {DetailComponent} from './shared/detail.component';
import {SECTIONS} from './core/models';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive,DetailComponent],templateUrl:'./app.component.html'})
export class AppComponent{
 s=inject(CompetitionService);sections=SECTIONS;private router=inject(Router);url=signal(this.router.url);current=computed(()=>this.sections.find(x=>this.url().includes('/'+x[0]))?.[1]||'Visão geral');
 constructor(){this.router.events.subscribe(e=>{if(e instanceof NavigationEnd){this.url.set(e.urlAfterRedirects);this.s.close();this.closeNav();}});afterNextRender(async()=>{await import('../../dist/live-court.mjs');await import('../../dist/gallery-ui.mjs');await import('../../dist/install.mjs');const {startVersionChecks}=await import('../../dist/version-check.mjs');startVersionChecks();void this.s.start();});}
 closeNav(){const el=document.getElementById('competition-tabs');if(el)window.bootstrap?.Collapse.getOrCreateInstance(el,{toggle:false}).hide();}
}
