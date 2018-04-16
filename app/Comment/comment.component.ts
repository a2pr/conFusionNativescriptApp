import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ModalDialogParams} from 'nativescript-angular/modal-dialog';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import {Page} from 'ui/page';

@Component({
    moduleId: module.id,
    templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {

    comment:FormGroup;
    constructor(private params:ModalDialogParams,
        private formBuilder: FormBuilder,
        private page:Page){
            this.comment=this.formBuilder.group({
                rating:1,
                comment:['',Validators.required],
                author:'',
                date: new Date().toISOString()
            })
        }

        ngOnInit(){

        }
    public submit(){
        console.log(JSON.stringify(this.comment.value));
        this.params.closeCallback(this.comment.value);
    }
}