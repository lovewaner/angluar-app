import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  ModalController
} from "ionic-angular";
import { DPSUser, HttpResponse, ModalResponse, Task } from '../../interface/index';
import { CommonProvider } from '../../providers/common/common';

/**
 * Generated class for the ViolationHandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-violation-handing',
  templateUrl: 'violation-handing.html',
})
export class ViolationHandingPage {
  public remarks: string;
  public modalResponse: ModalResponse;
  public type = 1;
  public taskInfo: Task.RootObject;
  public user: DPSUser = localStorage.getItem("dpsuser")
    ? JSON.parse(localStorage.getItem("dpsuser"))
    : {};

    constructor(
      public navCtrl: NavController,
      public viewCtrl: ViewController,
      public navParams: NavParams,
      public toastCtrl: ToastController,
      public modalCtrl: ModalController,
      public commonProvider: CommonProvider
    ) {
      if (this.navParams.get("taskID")) {
        this.type = 2;
        this.commonProvider.getTasksID(this.navParams.get("taskID")).then((data: Task.RootObject[]) => {
          this.taskInfo = data[0];
          this.remarks = this.taskInfo.Task_Remark;
        });
      }
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViolationHandingPage');
  }

  onRemarksChange(e) {
    this.remarks = e;
  }

  closePage() {
    this.modalResponse = {
      page: "ViolationHandingPage",
      code: 0,
      action: "close",
      data: null
    };
    this.viewCtrl.dismiss(this.modalResponse);
  }

  update() {
    if (!this.remarks) {
      this.toastCtrl
        .create({
          message: "请填写备注后再提交~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else {
      if (this.remarks === this.taskInfo.Task_Remark) {
        this.toastCtrl.create({
          message: "您未修改备注~",
          duration: 2000,
          position: "top"
        }).present();
      } else {
        const taskUpdate = {
          Open_ID: this.user.Open_ID,
          ID: this.taskInfo.ID,
          Task_Remark: this.remarks,
          Task_State: 2,
        };
        this.addTasks('update', taskUpdate);
      }
    }
  }

  submit() {
    if (!this.remarks) {
      this.toastCtrl
        .create({
          message: "请填写备注后再提交~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else {
      const map = this.modalCtrl.create("MapPage");
      map.present();
      map.onDidDismiss((data: ModalResponse) => {
        if (data.code === 0) return;
        const taskData = {
          Open_ID: this.user.Open_ID,
          Task_Type: '协同违章处理',
          Task_State: 2,
          Task_Remark: this.remarks,
          Link_Href: "ViolationHandingPage",
          First_Type : "协同违章处理",
          Clock_Site: data.data.currentAddress || "",
          Longitude: data.data.currentPosition["lng"],
          Latitude: data.data.currentPosition["lat"],
        };
        this.addTasks('insert', taskData);
      });
    }
  }

  addTasks(type: string, data: Object) {
    this.commonProvider.handleTasks(type, data).then((data: HttpResponse) => {
      if (data.errcode === 0) {
        const toaster = this.toastCtrl.create({
          message: "任务提交成功~",
          duration: 2000,
          position: "top"
        });
        toaster.present();
        toaster.onDidDismiss(() => {
          this.modalResponse = {
            page: "ValetCarPage",
            code: 1,
            action: "confirm",
            data: {
              remarks: this.remarks
            }
          };
          this.viewCtrl.dismiss(this.modalResponse);
        });
      } else {
        const toaster = this.toastCtrl.create({
          message: "任务提交失败，请重试~",
          duration: 2000,
          position: "top"
        });
        toaster.present();
      }
    });
  }
}
