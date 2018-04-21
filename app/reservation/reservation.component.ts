import { Component, OnInit, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import {ModalDialogService, ModalDialogOptions} from 'nativescript-angular/modal-dialog';
import { ReservationModalComponent } from '../reservationmodal/reservationmodal.component';
import { Page } from "ui/page";
import { View } from "ui/core/view";
import * as enums from "ui/enums";
import { CouchbaseService } from '../services/couchbase.service';
@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {

    reservation: FormGroup;
    showForm:boolean=true;
    showResults:boolean=false;
    reservationValue:null;
    formView:View;
    resultView:View;
    reservations:any[];
    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder, 
        private modalService:ModalDialogService,
        private vcRef:ViewContainerRef,
        private page: Page,
        private couchbaseService:CouchbaseService) {
            super(changeDetectorRef);

            this.reservation = this.formBuilder.group({
                guests: 3,
                smoking: false,
                dateTime: ['', Validators.required]
            });
    }

    ngOnInit() {

    }

    onSmokingChecked(args) {
        let smokingSwitch = <Switch>args.object;
        if (smokingSwitch.checked) {
            this.reservation.patchValue({ smoking: true });
        }
        else {
            this.reservation.patchValue({ smoking: false });
        }
    }

    onGuestChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ guests: textField.text});
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ dateTime: textField.text});
    }

     
    createModalView(args) {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({guests: result});
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result});
                }
            });

    }

    submitInfo(){
        let doc=this.couchbaseService.getDocument('reservations');
        if(doc===null){
            this.couchbaseService.createDocument({"reservations":[]},'reservations');
            console.log('first reservation');
            doc=this.couchbaseService.getDocument('reservations');
            this.reservations=doc.reservations;
            this.reservations.push(this.reservationValue);
            this.couchbaseService.updateDocument('reservations',{'reservations':this.reservations})
            console.log(JSON.stringify(this.couchbaseService.getDocument('reservations')));
        }
        else{
            doc=this.couchbaseService.getDocument('reservations');
            console.log(JSON.stringify(doc))
            this.reservations=doc.reservations;
            this.reservations.push(this.reservationValue);
            this.couchbaseService.updateDocument('reservations',{'reservations':this.reservations});
            console.log(JSON.stringify(this.couchbaseService.getDocument('reservations')))
        }
    }
    onSubmit() {
        this.reservationValue=this.reservation.value;
        this.submitInfo();
        this.animation();
    }
    animation(){
        if(this.reservationValue){
            this.formView=this.page.getViewById<View>('formView');
            this.resultView=this.page.getViewById<View>('results');
            
            
            this.formView.animate({
                scale:{x:0,y:0},
                opacity:0,
                duration:5000,
                curve:enums.AnimationCurve.easeInOut
            })
            .then(()=>{
                this.showForm=false;
                this.showResults=true;
                this.resultView.scaleX=0;
                this.resultView.scaleY=0;
                this.resultView.opacity=0; 
            }).then(()=>{
                console.log(this.resultView);
                this.resultView.animate({
                    scale:{x:1,y:1},
                    opacity:1,
                    duration:5000,
                    curve:enums.AnimationCurve.easeIn
                })
            })
        }
    }
}