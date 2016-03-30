import {Injectable} from "angular2/core";
import {BehaviorSubject,Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Http, Response} from 'angular2/http';
import {AppSettings} from '../settings';
import {Storage, SqlStorage} from 'ionic-framework/ionic';

export class OrderData {
    public sellccy:       string;
    public sellamt:       number;
    public buyccy:        string;
    public country:       string;
    public location:      string;

    /*
     this technique illustrates the construction of an object with named parameters
     and if these parameters are not provided, reverts to default specified in the constructor
     code

     e.g. new UserData({ username : 'William Tan'});
     */
    constructor(obj?: any) {
        this.sellccy        = obj && obj.sellccy           || null;
        this.sellamt        = obj && obj.sellamt           || null;
        this.buyccy         = obj && obj.buyccy            || null;
        this.country        = obj && obj.country           || null;
        this.location       = obj && obj.location          || null;

    }
}

@Injectable()
export class OrderService {

    // the results of the order queried
    //public result$: Observable<OrderData[]>;

    // if user exist in storage, publish it
    constructor(private http: Http)
    {}

    public find(q : OrderData) : Observable<OrderData[]> {
        return this.http.post(`${AppSettings.API_ENDPOINT}/getorders.php`, JSON.stringify(q))
            .map(
            (res) => {
                console.log(JSON.stringify(res));
                return res.json();
            });
    }
}