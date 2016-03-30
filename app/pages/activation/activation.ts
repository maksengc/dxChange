import {Page, Alert, NavController, NavParams} from 'ionic-framework/ionic';
import {FormBuilder,
    Validators,
    Control,
    ControlGroup,
    FORM_DIRECTIVES
} from 'angular2/common';
import {CustomValidator } from '../../common/custom.validator';
import {UserService,UserData} from '../../services/user.service';

@Page({
  templateUrl: 'build/pages/activation/activation.html',
    directives: [FORM_DIRECTIVES]
})
export class ActivationPage {

  //private myArray: Array<string> = new Array<string>();
  form: ControlGroup;
  smsverifycode : Control;

  constructor(private userService : UserService,
              private fb: FormBuilder,
              private nav: NavController,
              private navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.nav = nav;

    this.smsverifycode =
       new Control("",Validators.compose([Validators.required, Validators.maxLength(4), Validators.minLength(4)]));

    this.form = fb.group({
       smsverifycode:  this.smsverifycode
    });
  }

    onPageLoaded() {
   }

  // to do: popup a progress bar while performing the async operation
  submitActivation() {

      this.userService.signUp(
          this.navParams.data,
          this.smsverifycode.value).subscribe(
          (success) => {
              console.log('userService.signUp' + JSON.stringify(success));

              if (success.status.indexOf('000') == 0) {

                  let confirm = Alert.create({
                      title: success.status.substr(4),
                      buttons: [
                          {
                              text: 'Ok',
                              handler: () => {
                                  //this.nav.popToRoot(); // framework bug
                              }
                          }
                      ]
                  });
                  this.nav.present(confirm);
              }
              else
              {
                  let confirm = Alert.create({
                      title: success.status.substr(4),
                      buttons: [
                          {
                              text: 'Ok' ,
                              handler: () => {
                                  this.nav.pop(); // framework bug
                              }
                          }
                      ]
                  });
                  this.nav.present(confirm);
              }

          },
          error => {
              let confirm = Alert.create({
                  title: "Network error",
                  buttons: [{
                      text: 'Retry',
                      handler: () => {
                          this.submitActivation();
                      }
                  }]
              });
              this.nav.present(confirm);
          });
  }

  resendActivation() {
  }
}
