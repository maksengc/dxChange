import {Injectable} from "angular2/core";
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Http, Response} from 'angular2/http';
import {AppSettings} from '../settings';

@Injectable()
export class CacheService {

    private _ccyList : any = null;
    private _countryList : any = null;

    constructor(private http: Http) {
    }

    public load() : Observable<any[]>
    {
        return Observable.forkJoin([
            this.http.post(`${AppSettings.API_ENDPOINT}/getccy.php`, "")
                .map((res) => {
                    res = res.json();
                    this._ccyList = res;
                    return res;
                }),
            this.http.post(`${AppSettings.API_ENDPOINT}/getcountries.php`, "")
                .map((res) => {
                    res = res.json();
                    this._countryList = res;
                    return res;
            })
        ]);
    }

    // public property
    public get ccyList():any
    {
        return this._ccyList;
    }

    public get countryList():any
    {
        return this._countryList;
    }

    public cityList(country) : Observable<any>
    {
        var param = { country: country };
        return this.http.post(`${AppSettings.API_ENDPOINT}/getlocations.php`, JSON.stringify(param))
            .map(res => res.json());
    }
}