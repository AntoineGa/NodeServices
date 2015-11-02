import * as ng from 'angular2/angular2';
import { Http } from 'angular2/http';
import { AlbumTile } from '../album-tile/album-tile';
import * as models from '../../../models/models';
 
@ng.Component({
  selector: 'home'
})
@ng.View({
  templateUrl: './ng-app/components/public/home/home.html',
  directives: [ng.NgFor, AlbumTile]
})
export class Home {
    public mostPopular: models.Album[];

    constructor(http: Http) {
        http.get('/api/albums/mostPopular').subscribe(result => {
            this.mostPopular = result.json(); 
        });
    }
}
