import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ModalDialogParams} from 'nativescript-angular/modal-dialog';
import {DatePicker} from 'ui/date-picker';
import {TimePicker} from 'ui/time-picker';
import {ListPicker} from 'ui/list-picker';
import {Page} from 'ui/page';

@Component({
    moduleId: module.id,
    templateUrl: './reservationmodal.component.html'
})
export class ReservationModalComponent implements OnInit {

    guestArray=[1,2,3,4,5,6];
    guests:number;
    isDateTime:boolean=false;


    constructor(private params:ModalDialogParams,
        private page:Page){
            if(params.context === "guest") {
                this.isDateTime = false;
            }
            else if(params.context === "date-time") {
                this.isDateTime = true;
            }
    }

    ngOnInit(){
        if(this.isDateTime){
            let datePicker:DatePicker=<DatePicker>this.page.getViewById<DatePicker>('datePicker');

            let currrentdate:Date =new Date();
            datePicker.year =currrentdate.getFullYear();
            datePicker.month=currrentdate.getMonth()+1;
            datePicker.day=currrentdate.getDate();
            datePicker.minDate=currrentdate;
            datePicker.maxDate= new Date(2045,4,12);

            let timePicker:TimePicker=<TimePicker>this.page.getViewById<TimePicker>('timePicker');
            timePicker.hour=currrentdate.getHours();
            timePicker.minute=currrentdate.getMinutes();

        }
    }
    public submit(){
        if (this.isDateTime) {
            let datePicker: DatePicker = <DatePicker>this.page.getViewById<DatePicker>('datePicker');
            let selectedDate = datePicker.date;
            let timePicker: TimePicker = <TimePicker>this.page.getViewById<TimePicker>('timePicker');
            let selectedTime = timePicker.time;
            let reserveTime = new Date(selectedDate.getFullYear(),
                                        selectedDate.getMonth(),
                                        selectedDate.getDate(),
                                        selectedTime.getHours(),
                                        selectedTime.getMinutes());
            this.params.closeCallback(reserveTime.toISOString());
        }
        else {
            let picker = <ListPicker> this.page.getViewById<ListPicker>('guestPicker');
            this.params.closeCallback(this.guestArray[picker.selectedIndex])
        }
    }
}