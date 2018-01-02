import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { ModalResponse } from "../../interface/index";
/**
 * Generated class for the LabelDescriptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({
  priority: "off"
})
@Component({
  selector: "page-label-descriptions",
  templateUrl: "label-descriptions.html"
})
export class LabelDescriptionsPage implements OnInit {
  public labelInfo: any = {};
  public modalResponse: ModalResponse;
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}
  ngOnInit() {
    this.labelInfo = this.navParams.get("label");
  }
  closePage() {
    this.modalResponse = {
      page: "LabelDescriptionsPage",
      code: 0,
      action: "close",
      data: null
    };
    this.viewCtrl.dismiss(this.modalResponse);
  }
  confirm() {
    this.modalResponse = {
      page: "LabelDescriptionsPage",
      code: 1,
      action: "confirm",
      data: {
        label: this.labelInfo
      }
    };
    this.viewCtrl.dismiss(this.modalResponse);
  }
}
