import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
} from "ionic-angular";

/**
 * Generated class for the TalkWayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-talk-way',
  templateUrl: 'talk-way.html',
})
export class TalkWayPage {
  public bill: boolean = false;
  public problem: boolean = false;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TalkWayPage');
  }

  next() {
    this.navCtrl.push("TalkStationmasterPage", {
      bill: this.bill,
      problem: this.problem
    });
  }
}
