import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TalkTreePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-talk-tree',
  templateUrl: 'talk-tree.html',
})
export class TalkTreePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
        
  ionViewDidLoad() {
    console.log('ionViewDidLoad TalkTreePage');
  }

  toPage(name: string) {
    this.navCtrl.push(name);
  }
}
