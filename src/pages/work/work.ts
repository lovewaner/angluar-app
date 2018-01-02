import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { ModalResponse, DPSUser } from "../../interface/index";
/**
 * Generated class for the WorksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({
  priority: "high"
})
@Component({
  selector: "page-work",
  templateUrl: "work.html"
})
export class WorkPage {
  public user: DPSUser = localStorage.getItem("dpsuser")
    ? JSON.parse(localStorage.getItem("dpsuser"))
    : {};
  public workType: number;
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.workType = this.user.Department;
    window.addEventListener("onStorageChange", e => {
      if (e["name"] === "dpsuser") {
        this.user = JSON.parse(e["value"]);
        this.workType = this.user.Department;
      }
    });
    console.log(this.workType);
  }
  toPage(name: string) {
    this.navCtrl.push(name);
  }
  loadModal(name: string) {
    const page = this.modalCtrl.create(name);
    page.onWillDismiss((data: ModalResponse) => {
      if (data.code === 0) return;
      this.navCtrl.parent.select(0);
    });
    page.present();
  }
}