import {App, IonicApp, Platform} from 'ionic-framework/ionic';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Storage, SqlStorage} from 'ionic-framework/ionic';
import {HelloIonicPage} from './pages/hello-ionic/hello-ionic';
import {Start} from './pages/start/start';
import {ListPage} from './pages/list/list';
import {UserService,UserData} from './services/user.service';
import {CacheService} from './services/cache.service';
import {OrderService, OrderData} from './services/order.service';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';


@App({
  templateUrl: 'build/app.html',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers:[UserService, CacheService, OrderService]   // these services become singletons when included at app level.

})
class MyApp {
  rootPage: Type = Start;                           // make Start the root page
  pages: Array<{title: string, component: Type}>;   // an array of pages
  user: UserData = new UserData();                  // model of the login user

  constructor(private app: IonicApp,
              private platform: Platform,
              private cacheService: CacheService,
              private userService : UserService) {

    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Find Match', component: Start },
      { title: 'Hello Ionic', component: HelloIonicPage },
      { title: 'My First List', component: ListPage }
    ];
  }

  // this is only called once
  initializeApp() {
    this.platform.ready().then(() => {
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)

        /*
        var storage : Storage = new Storage(SqlStorage);

        storage.query('CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT)').then((data) => {
            console.log("TABLE CREATED -> " + JSON.stringify(data.res));
        }, (error) => {
            console.log("ERROR -> " + JSON.stringify(error.err));
        });
        */


      this.userService.user.subscribe(
         (user) => {
             this.user = user;
             console.log('initializeApp ' + JSON.stringify(user));
         },
         (error) => {
             console.log(JSON.stringify(error));
      });
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.app.getComponent('leftMenu').close();
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);

    console.log('openpage');
  }

  logout() {
      this.userService.logout();
      this.app.getComponent('leftMenu').close();
  }
}
