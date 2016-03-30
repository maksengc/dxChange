import {Page,Alert, MenuController, NavController, NavParams} from 'ionic-framework/ionic';
import {FormBuilder,
        Validators,
        Control,
        ControlGroup,
        FORM_DIRECTIVES
} from 'angular2/common';
import {CustomValidator } from '../../common/custom.validator';
import {SignupPage} from '../signup/signup';
import {AppSettings} from '../../settings';
import {CacheService} from '../../services/cache.service';
import {UserService, UserData} from '../../services/user.service';
import {OrderService, OrderData} from '../../services/order.service';


@Page({
  templateUrl: 'build/pages/start/start.html',
  directives: [FORM_DIRECTIVES]
})
export class Start {

  user : UserData = new UserData();
  form: ControlGroup;
  amountIHave : Control;  // intentional so initial binding will not happen becos it was null
  ccyIHave : string     = AppSettings.DEF_CCY_I_HAVE;
  ccyChangeTo : string  = AppSettings.DEF_CCY_CHANGETO;
  countryMeet : string  = AppSettings.DEF_COUNTRYCODE;     // default singapore
  locationMeet : string = null; // default null

  ccyList : any = [];           // default array of nothing
  countryList : any = [];
  cityList : any = [];

  constructor(private userService: UserService,
              private orderService : OrderService,
              private fb: FormBuilder,
              private cacheService: CacheService,
              private menu: MenuController,
              private nav: NavController,
              navParams: NavParams)
  {
      this.amountIHave =
          new Control("",Validators.compose([Validators.required, CustomValidator.isNotNumber]));

      this.form = fb.group({
          amountIHave:  this.amountIHave
      });

      console.log('dxchange.constructor');
  }

  /*
     onPageLoaded is an inherited event fired only once, not every time page is access.
     otherwise use onPageWillEnter instead
  */
  onPageLoaded()
  {
      this.loadResource();

      console.log('onPageLoaded');

      this.userService.user.subscribe(
          (user : UserData) => {
              this.user = user;
              console.log('dxchange.onPageLoaded ' + JSON.stringify(user));
          },
          (error) => {
              console.log(JSON.stringify(error));
          });
  }

  /*
     loadResource() demonstrates the blocking of the page until the resources required of it is
     available
  */
  private loadResource() {

      console.log("pageInit");

      this.cacheService.load().subscribe(
          (data) => {
              this.ccyList = this.cacheService.ccyList;
              this.countryList = this.cacheService.countryList;
          },
          (err) => {
              let confirm = Alert.create({
                  title: "Network error",
                  //body: JSON.stringify(error),
                  buttons: [
                      {
                          text: 'Retry',
                          handler: () => {
                              this.loadResource();
                          }
                      }
                  ]
              });
              this.nav.present(confirm);
          });

  }

  private menuClick() {
      console.debug('menuClick()');
      if (this.user.username == '')
          this.nav.push(SignupPage);
      else
          this.menu.toggle()
  }

  private findMatch() {
      //console.debug('findMatch()' + this.amtIHave);

      if (this.user.username == '')
          this.nav.push(SignupPage);
      else {
          q : OrderData;
          let q = new OrderData({
            sellccy: this.ccyIHave.toString(),
            sellamt: this.amountIHave.value,
            buyccy: this.ccyChangeTo.toString(),
            country: this.countryMeet.toString(),
            location: this.locationMeet });


          console.log('findMatch1 ' + JSON.stringify(q));

          this.orderService.find(q).subscribe(
              (oArray : OrderData[]) => {
                  console.log('findMatch2 ' + JSON.stringify(oArray));
                  if (oArray.length==0)
                  {
                      let confirm = Alert.create({
                          title: "No match",
                          buttons: [
                              {
                                  text: 'Get notified if there are any matches in the future',
                                  handler: () => {
                                      //this.findMatch();
                                  }
                              },
                              {
                                  text: 'Close',
                                  handler: () => {
                                      //this.findMatch();
                                  }
                              }
                          ]
                      });
                      this.nav.present(confirm);
                  }
                  else {

                  }
              },
              (error) => {
                  let confirm = Alert.create({
                      title: "Network error",
                      buttons: [
                          {
                              text: 'Ok',
                              handler: () => {
                                  //this.findMatch();
                              }
                          }
                      ]
                  });
                  this.nav.present(confirm);
              },
              () => {
                console.log('complete');
              }
          )
      }
  }

  /*
      When selected country change, load a new city list for selection
  */
  private onCountryChange() {

      this.locationMeet = "";

      this.cacheService.cityList(this.countryMeet.toString()).subscribe( // for some reason, if i don't convert countryMeet to string, it wont work!
          cityList => {
              this.cityList = cityList;
          },
          error => {
              let confirm = Alert.create({
                  title: "Network error",
                  //body: JSON.stringify(error),
                  buttons: [
                      {
                          text: 'Retry',
                          handler: () => {
                              this.onCountryChange();
                          }
                      }
                  ]
              });
              this.nav.present(confirm);
          }
      );
  }

  private onMyCcyChange(value) {
      console.log(value);
      if (this.ccyChangeTo == value)
        this.ccyChangeTo = null;
  }

  private onToCcyChange(value) {
      if (this.ccyIHave == value)
        this.ccyIHave = null;
  }
}
