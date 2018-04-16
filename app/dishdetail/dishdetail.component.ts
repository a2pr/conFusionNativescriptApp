import {Component,OnInit, Inject, ViewContainerRef} from '@angular/core';
import {ModalDialogService, ModalDialogOptions} from 'nativescript-angular/modal-dialog';
import {Dish} from '../shared/dish';
import {Comment} from '../shared/comment';
import {DishService} from '../services/dish.service';
import {TNSFontIconService} from 'nativescript-ngx-fonticon';
import {ActivatedRoute,Params} from '@angular/router';
import {RouterExtensions} from 'nativescript-angular/router';
import 'rxjs/add/operator/switchMap';
import { FavoriteService } from '../services/favorite.service';
import {confirm, action} from 'ui/dialogs';
import { Toasty } from 'nativescript-toasty';
import { CommentComponent } from '../Comment/comment.component';
@Component({
    selector:'app-dishdetail',
    moduleId:module.id,
    templateUrl:'./dishdetail.component.html',
    styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit{

    dish:Dish;
    comment:Comment;
    height:number;
    newcomment:Comment;
    errMess:string;
    avgstars:string;
    numcomments:number;
    favorite:boolean=false;
    constructor( private dishservice:DishService,
        private favoriteService:FavoriteService,
        private route:ActivatedRoute,
        private fonticon:TNSFontIconService,
        private routerExtensions: RouterExtensions,
        private modalService:ModalDialogService,
        private vcRef:ViewContainerRef,
    @Inject('BaseURL' ) private BaseURL){   }
    ngOnInit(){
        this.route.params
        .switchMap((params:Params)=>this.dishservice.getDish(+params['id']))
        .subscribe(dish=>{
            this.dish=dish;
            this.favorite=this.favoriteService.isFavorite(this.dish.id);
            this.numcomments=this.dish.comments.length;

            let total=0;
            this.dish.comments.forEach(comment=>total+=comment.rating);
            this.avgstars=(total/this.numcomments).toFixed(2);
            this.height=this.dish.comments.length*100;
        },
            errMess=>this.errMess=errMess);
    }

    dishOptions(){
        let options={
            title:'Actions',
            actions:['Add comment', 'Add to Favorites'],
            cancelButtonText:'Cancel'
        };
        action(options).then((result)=>{
            if(result==="Add comment"){
                this.createModalView();
            }else if(result==="Add to Favorites"){
                this.addToFavorites();
                
                console.log(this.dish.comments);
                

            }
        })
    }
    createModalView(){
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            fullscreen: false
        };
        this.modalService.showModal(CommentComponent, options)
            .then((result)=>{
                if(result){
                    //update commments
                    this.newcomment=result;
                    console.log(this.newcomment)
                    this.dish.comments.push(this.newcomment);
                    this.height+=100;
                    this.numcomments=this.dish.comments.length;
                    let total=0;
                    this.dish.comments.forEach(comment=>total+=comment.rating);
                    this.avgstars=(total/this.numcomments).toFixed(2);
                }
            });
    }
    addToFavorites(){
        if(!this.favorite){
            this.favorite=this.favoriteService.addFavorite(this.dish.id);
            const toast=new Toasty('Added dish'+ this.dish.id, 'short', 'bottom');
            toast.show();
        }
    }
    goBack():void{
        this.routerExtensions.back();
    }
}