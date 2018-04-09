import {Component,OnInit, Inject, ChangeDetectorRef} from '@angular/core';
import {LeaderService} from '../services/leader.service';
import{Leader} from '../shared//leader';

import {DrawerPage} from '../shared/drawer/drawer.page';
@Component({
    selector:'app-about',
    moduleId:module.id,
    templateUrl:'./about.component.html'
})
export class AboutComponent extends DrawerPage implements OnInit{
    
    leaders:Leader[];
    
    constructor(
        private changeDetectorRef:ChangeDetectorRef,
        private leaderService:LeaderService,
    @Inject('BaseURL') private BaseURL){ 
         super(changeDetectorRef); 
    }
   
    ngOnInit(){
       this.leaderService.getLeaders()
        .subscribe(leaders=>this.leaders=leaders);
    }
}