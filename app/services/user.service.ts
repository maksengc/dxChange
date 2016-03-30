import {Injectable} from "angular2/core";
import {BehaviorSubject, Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Http, Response} from 'angular2/http';
import {AppSettings} from '../settings';
import {Storage, SqlStorage} from 'ionic-framework/ionic';

export class UserData {
    public username:       string;
    public email:          string;
    public telcountrycode: string;
    public mobile:         string;

    /*
        this technique illustrates the construction of an object with named parameters
        and if these parameters are not provided, reverts to default specified in the constructor
        code

        e.g. new UserData({ username : 'William Tan'});
     */
    constructor(obj?: any) {
        this.username       = obj && obj.username           || '';
        this.email          = obj && obj.email              || '';
        this.telcountrycode = obj && obj.telcountrycode     || '';
        this.mobile         = obj && obj.mobile             || '';
    }
}

@Injectable()
export class UserService {

    private _storage : Storage;

    // BehaviorSubject is both an observer and observable (read/write stream)
    // with retaining the last value for new subscribers
    private _user: BehaviorSubject<UserData> = new BehaviorSubject<UserData>(new UserData());

    // if user exist in storage, publish it
    constructor(private http: Http)
    {
        this._storage = new Storage(SqlStorage);
        this._storage.get('user').then(
            (userjson : string) => {
                if (userjson!=null) {
                    let u : UserData = JSON.parse(userjson);
                    if (u.username!='')
                        this._user.next(u);
                }
            }
        );
    }


    public get user() :Observable<UserData> {

        return this._user;
    }

    private setuser(user : UserData)
    {
        this._storage.set('user', JSON.stringify(user)).then(
            () => {
                this._user.next(user);
            }
        );
    }

    public logout()
    {
        this.setuser(new UserData());
    }

    public signUp(user : UserData,
                  smsverifycode)
    {
        var param = {
            username: user.username,
            email: user.email,
            telcountrycode: user.telcountrycode,
            mobile: user.mobile,
            smsverifycode: smsverifycode
        };

        return this.http.post(`${AppSettings.API_ENDPOINT}/signup.php`, JSON.stringify(param))
            .map(res => res.json())
            .map((success) => {
                if (success.status.indexOf('000') == 0)
                    this.setuser(user);
                return success;
            });
    }
}