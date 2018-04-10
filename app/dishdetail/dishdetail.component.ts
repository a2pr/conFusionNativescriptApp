import {Component,OnInit, Inject} from '@angular/core';
import {Dish} from '../shared/dish';
import {Comment} from '../shared/comment';
import {DishService} from '../services/dish.service';
import {TNSFontIconService} from 'nativescript-ngx-fonticon';
import {ActivatedRoute,Params} from '@angular/router';
import {RouterExtensions} from 'nativescript-angular/router';
import 'rxjs/add/operator/switchMap';
import { FavoriteService } from '../services/favorite.service';

@Component({
    selector:'app-dishdetail',
    moduleId:module.id,
    templateUrl:'./dishdetail.component.html',
    styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit{

    dish:Dish;
    comment:Comment;
    errMess:string;
    avgstars:string;
    numcomments:number;
    favorite:boolean=false;
    constructor( private dishservice:DishService,
        private favoriteService:FavoriteService,
    private route:ActivatedRoute,
    private fonticon:TNSFontIconService,
    private routerExtensions: RouterExtensions,
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
        },
            errMess=>this.errMess=errMess);
    }

    addToFavorites(){
        if(!this.favorite){
            this.favorite=this.favoriteService.addFavorite(this.dish.id);
        }
    }
    goBack():void{
        this.routerExtensions.back();
    }
}