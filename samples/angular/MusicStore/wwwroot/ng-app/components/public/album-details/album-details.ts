import * as ng from 'angular2/angular2';
import * as router from 'angular2/router';
import { Http } from 'angular2/http';
import * as models from '../../../models/models';

@ng.Component({
  selector: 'album-details'
})
@ng.View({
  templateUrl: './ng-app/components/public/album-details/album-details.html',
  directives: [ng.NgIf]
})
export class AlbumDetails {
    public albumData: models.Album;
    
    constructor(http: Http, routeParam: router.RouteParams) {
        http.get('/api/albums/' + routeParam.params['albumId']).subscribe(result => {
            this.albumData = result.json();
        });
    }
}
