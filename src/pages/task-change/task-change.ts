import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams, LoadingController } from "ionic-angular";
import { CommonProvider } from "../../providers/common/common";
import { HttpResponse } from "../../interface/HttpResponse";
/**
 * Generated class for the TasksChangePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({
  priority: "off"
})
@Component({
  selector: "page-task-change",
  templateUrl: "task-change.html"
})
export class TaskChangePage implements OnInit {
  public taskList: object[] = [];
  public currentDate: string;
  public openID: string;
  public presentDate = new Date();

  constructor(
    public commonProvider: CommonProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public LoadingCtrl: LoadingController
  ) {
    this.currentDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + '-' + (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate());
    this.openID = JSON.parse(localStorage['dpsuser'])["Open_ID"];
  }

  ngOnInit() {
    const loading = this.LoadingCtrl.create({
      content: "加载中。。。"
    });
    loading.present();
    this.commonProvider.getTasks(this.openID, this.currentDate).then((data: HttpResponse) => {
      loading.dismiss();
      if (data.errcode === 0) {
        this.taskList = data.data;
      }
    });
  }

  toPage(name: string, params) {
    this.navCtrl.push(name, params);
  }
}
