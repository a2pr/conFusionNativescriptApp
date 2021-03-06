import {Injectable} from '@angular/core';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CouchbaseService } from './couchbase.service';
import * as LocalNotifications from 'nativescript-local-notifications';

@Injectable()
export class FavoriteService{

    favorites:Array<number>;
    docId:string='favorites';
    constructor(private dishService:DishService,
    private couchbaseService:CouchbaseService){
        this.favorites=[];
        let doc = this.couchbaseService.getDocument(this.docId);
        if( doc == null) {
          this.couchbaseService.createDocument({"favorites": []}, this.docId);
        }
        else {
          this.favorites = doc.favorites;
        }
    }
    isFavorite(id:number):boolean{
        return this.favorites.some(el=>el===id);
    }
    addFavorite(id:number):boolean{
        if(!this.isFavorite(id)){
            this.favorites.push(id);
            this.couchbaseService.updateDocument(this.docId, {"favorites":this.favorites});
            LocalNotifications.schedule([{
                id: id,
                title:'Confusion Favorites',
                body:'Dish '+ id+ ' added succesfully'
            }])
            .then(()=>console.log('Notification scheduled'),
            (error)=> console.log('Error showing notification' +error));
        }
        return true;
    }
    getFavorites():Observable<Dish[]>{
        return this.dishService.getDishes()
            .map(dishes=>dishes.filter(dish=>this.favorites.some(el=>el===dish.id)))
    }
    deleteFavorite(id:number):Observable<Dish[]>{
        let index=this.favorites.indexOf(id);
        if(index>=0){
            this.favorites.splice(index,1);
            this.couchbaseService.updateDocument(this.docId, {"favorites":this.favorites});
            return this.getFavorites();
        }
        else{
            return  Observable.throw('Deleting non-existan favorite');
        }
    }
}