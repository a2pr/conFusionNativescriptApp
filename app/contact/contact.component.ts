import {Component,OnInit, Inject, ChangeDetectorRef} from '@angular/core';
import {DrawerPage} from '../shared/drawer/drawer.page';
import {TNSFontIconService} from 'nativescript-ngx-fonticon'
import * as Email from 'nativescript-email';
import * as TNSPhone from 'nativescript-phone';
 
@Component({
    selector:'app-contact',
    moduleId:module.id,
    templateUrl:'./contact.component.html'
})
export class ContactComponent extends DrawerPage {
    constructor(
        private fonticon:TNSFontIconService,
        private changeDetectorRef:ChangeDetectorRef,
    @Inject('BaseURL') private BaseURL){ 
         super(changeDetectorRef); 
    }
    ngOnInit(){

    }
    sendEmail(){
        Email.available()
            .then((avail:boolean)=>{
                if(avail){
                    Email.compose({
                        to:['confusion@food.net'],
                        subject:'[Confusion]:Query',
                        body:'Dear Sir/Madam:'
                    });
                }
                else{
                    console.log('No email configured')
                }
            })
    }
    callRestaurant(){
        console.log('calling');
        TNSPhone.dial('92-93546-8999', true);
    }
}