import {Component,computed,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MATERIAL} from '../shared/material';
import {CompetitionService} from '../core/competition.service';
import {GridComponent,GridColumn} from '../shared/grid.component';
import {EntityComponent} from '../shared/entity.component';
import {simulateRoundSeven} from '../../../dist/round-simulation.mjs';

@Component({selector:'app-simulation-page',standalone:true,imports:[...MATERIAL,FormsModule,GridComponent,EntityComponent],templateUrl:'./simulation-page.component.html'})
export class SimulationPageComponent {
 readonly s=inject(CompetitionService);
 readonly inputs=signal<Record<string,{home:number|null;away:number|null}>>({});
 readonly simulation=computed<any>(()=>simulateRoundSeven(this.s.data(),this.inputs()));
 readonly columns:GridColumn[]=[{key:'rank',label:'#'},{key:'team',label:'Equipe',kind:'team'},{key:'pts',label:'PTS',kind:'points'},{key:'change',label:'Variação'},{key:'j',label:'J'},{key:'v',label:'V'},{key:'e',label:'E'},{key:'d',label:'D'},{key:'gp',label:'GP'},{key:'gc',label:'GC'},{key:'sg',label:'SG'}];
 setScore(id:string,side:'home'|'away',value:number|null){
   const fixture=this.simulation().fixtures.find((m:any)=>m.id===id);
   this.inputs.update(rows=>({...rows,[id]:{home:fixture.home,away:fixture.away,[side]:value}}));
 }
 reset(){this.inputs.set({});}
 clear(){this.inputs.set(Object.fromEntries(this.simulation().fixtures.map((m:any)=>[m.id,{home:null,away:null}])));}
 entity(id:string){return {id,...this.s.team(id)};}
}
