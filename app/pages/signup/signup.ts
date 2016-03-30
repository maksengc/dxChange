import {Page, NavController, NavParams} from 'ionic-framework/ionic';
import {FormBuilder,
    Validators,
    Control,
    ControlGroup,
    FORM_DIRECTIVES
} from 'angular2/common';
import {CustomValidator } from '../../common/custom.validator';
import {Http,Headers} from 'angular2/http';
import {ActivationPage} from '../activation/activation';
import {AppSettings} from '../../settings';
import {UserService,UserData} from '../../services/user.service';

@Page({
  templateUrl: 'build/pages/signup/signup.html',
  directives: [FORM_DIRECTIVES]
})
export class SignupPage {

  user : UserData = new UserData();
  form: ControlGroup
  name: Control;
  email: Control;
  telcountrycode : Control;
  mobile : Control

  constructor(private fb: FormBuilder,
              private http: Http,
              private nav: NavController) {

      this.user.telcountrycode = AppSettings.DEF_COUNTRYCODE_TEL;

      this.name =
          new Control("",Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)]));

      this.email =
          new Control("",Validators.compose([Validators.required, CustomValidator.isNotEmail]));

      this.telcountrycode =
          new Control("" ,Validators.compose([Validators.required, CustomValidator.isNotCountryCodeTel]));

      this.mobile =
          new Control("" ,Validators.compose([Validators.required, CustomValidator.isNotNumber]));

      this.form = fb.group({
          name:  this.name,
          email: this.email,
          telcountrycode: this.telcountrycode,
          mobile: this.mobile
      });
    // If we navigated to this page, we will have an item available as a nav param
  }

  signupNext() {
      console.log('signupNext');

      /*
      var payload = {'number': '006597637627', 'message': 'testmessage'};

      this.http.post("http://textbelt.com/intl", "number=006597637627\nmessage=testmessage")
          .subscribe(data => {
              console.log("succ " + JSON.stringify(data));
          }, error => {
              console.log("fail " + JSON.stringify(error));
          });
      */

      /*
      this.nav.push(ActivationPage, new UserData({
          username: this.name.value,
          email: this.email.value,
          telcountrycode : this.telcountrycode.value,
          mobile: this.mobile.value
      }));
      */
      this.nav.push(ActivationPage, this.user);
  }
}
