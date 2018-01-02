import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import {
  ModalResponse,
} from "../../interface/index";
/**
 * Generated class for the ProblemHandlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-problem-handle',
  templateUrl: 'problem-handle.html',
})
export class ProblemHandlePage {
  public remarks: string;
  public modalResponse: ModalResponse;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ToastCtrl: ToastController
  ) {
    if (this.navParams.get("Interflow_Content")) {
      this.remarks = this.navParams.get("Interflow_Content")
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProblemHandlePage');
  }

  closePage() {
    this.modalResponse = {
      page: "ProblemHandlePage",
      code: 0,
      action: "close",
      data: null
    };
    this.viewCtrl.dismiss(this.modalResponse);
  }

  submit() {
    if (!this.remarks) {
      this.ToastCtrl.create({
        message: "请填写备注~",
        duration: 2000,
        position: "top"
      }).present();
    } else {
      this.modalResponse = {
        page: "ProblemHandlePage",
        code: 1,
        action: "confirm",
        data: {
          remarks: this.remarks
        }
      };
      this.viewCtrl.dismiss(this.modalResponse);
    }
  }
}
