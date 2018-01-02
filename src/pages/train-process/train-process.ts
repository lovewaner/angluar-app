import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ModalController
 } from 'ionic-angular';
import {
  Store,
  DPSUser,
  Task,
  ModalResponse,
  StoreWaiter,
  HttpResponse
} from '../../interface/index';
import { CommonProvider } from '../../providers/common/common';
import { Unit } from '../../units/units'

/**
 * Generated class for the TrainProcessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-train-process',
  templateUrl: 'train-process.html',
})
export class TrainProcessPage {
  public user: DPSUser = localStorage.getItem("dpsuser")
  ? JSON.parse(localStorage.getItem("dpsuser"))
  : {};
  public store: Store;
  public waiter: string[] | string;
  public waiterList: StoreWaiter[];
  public type = 1;
  public remarks: string;
  public selectWaiter = new Set([]);
  public oldSelectWaiter = new Set([]);
  public taskInfo: Task.RootObject;
  public selectLabel = new Set([]);
  public oldSelectLabel = new Set([]);
  public labelList: Object[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public commonProvider: CommonProvider,
  ) {
    if (this.navParams.get("taskID")) {
      this.type = 2;
      this.commonProvider
        .getTasksID(this.navParams.get("taskID"))
        .then((task: Task.RootObject[]) => {
          this.taskInfo = task[0];
          this.remarks = this.taskInfo.Task_Remark;
          const Waiter = [];
          this.taskInfo.People.forEach((element: Task.Person) => {
            Waiter.push(element.People_Name);
            this.selectWaiter.add(element.Open_ID);
            this.oldSelectWaiter.add(element.Open_ID);
          });
          this.waiter = Waiter;
          this.taskInfo.Label_List.forEach((element: any) => {
            this.selectLabel.add(element.Label_ID);
            this.oldSelectLabel.add(element.Label_ID);
          });
          this.commonProvider
            .getStoreName(this.taskInfo.Shop_ID)
            .then((store: Store) => {
              this.store = store[0];
              this.commonProvider
                .getWaiter(this.store.Store_ID)
                .then((waiter: StoreWaiter[]) => {
                  this.waiterList = waiter;
                });
            });
        });
    }
    this.getTaskLabel();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrainProcessPage');
  }

  update() {
    if (!this.store) {
      this.toastCtrl
        .create({
          message: "请选择门店信息~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else if (!this.waiter) {
      this.toastCtrl
        .create({
          message: "请选择人员信息~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else if (!this.selectLabel) {
      this.toastCtrl
        .create({
          message: "请选择培训内容~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else {
      const task = {
        ID: this.taskInfo["ID"],
        Task_ID: this.taskInfo["Task_ID"],
        Task_State: "已处理",
        Task_Remark: this.remarks || "",
        Shop_ID: this.store.Store_ID
      };
      if (
        !Unit.CompareArray(
          Array.from(new Set(this.selectWaiter)),
          Array.from(new Set(this.oldSelectWaiter))
        )
      ) {
        task["People"] = Array.from(new Set(this.selectWaiter));
      }
      if (
        !Unit.CompareArray(
          Array.from(new Set(this.selectLabel)),
          Array.from(new Set(this.oldSelectLabel))
        )
      ) {
        task["Label_List"] = Array.from(new Set(this.selectLabel));
      }
      this.addTask('update', task);
    }
  }

  getTaskLabel() {
    this.commonProvider.getTaskLabel("操作流程培训").then((data: HttpResponse) => {
      if (data.errcode === 0) {
        const result = [];
        for (let i = 0, len = data.data.length; i < len; i += 3) {
          result.push(data.data.slice(i, i + 3));
        }
        this.labelList = result;
      }
    });
  }

  getSelectWaiterID() {
    const result = this.waiterList.filter((item: StoreWaiter) => this.waiter.toString().indexOf(item.Waiter_Name) > -1)
    result.forEach((item: StoreWaiter) => {
      this.selectWaiter.add(item.Open_ID)
    })
  }
  
  // 选择门店
  loadModal(name: string, data?: Object) {
    const modal = this.modalCtrl.create(name, data);
    modal.present();
    modal.onDidDismiss((data:ModalResponse) => {
      if (data.code === 0) return;
      this.onModalDismiss(data);
    })
  }

  onModalDismiss(data: ModalResponse) {
    switch (data.page) {
      case "SearchStorePage":
          if (this.store) {
            if (this.store.Store_Name === data.data["store"]["Store_Name"]) {
              return;
            }
          }
          this.store = data.data["store"];
          this.waiter = "";
          this.commonProvider.getWaiter(this.store.Store_ID).then((data: StoreWaiter[]) => {
            this.waiterList = data;
          });
        break;
      case "MapPage":
            const taskData = {
              Open_ID: this.user.Open_ID,
              Task_Type: "操作流程培训",
              Task_State: "已处理",
              Task_Remark: this.remarks || "",
              Clock_Site: data.data["currentAddress"] || "",
              Longitude: data.data["currentPosition"]["lng"],
              Latitude: data.data["currentPosition"]["lat"],
              Shop_ID: this.store.Store_ID,
              People: Array.from(new Set(this.selectWaiter)),
              Label_List: Array.from(new Set(this.selectLabel)),
              Link_Href: "TrainProcessPage",
              First_Type : "培训"
            }
            this.addTask('insert', taskData);
        break;
      case "LabelDescriptionsPage":
          if (!data.data["label"]["Is_Flag"]) {
            this.selectLabel.delete(data.data["label"]["ID"]);
            return;
          }
          this.selectLabel.add(data.data["label"]["ID"]);
        break;
      default:
        break;
    }
  }

  submit() {
    if (!this.store) {
      this.toastCtrl
        .create({
          message: "请选择店名~",
          duration: 2000,
          position: "top"
        }).present();
    } else if (!this.waiter) {
      this.toastCtrl
      .create({
        message: "请选择人员~",
        duration: 2000,
        position: "top"
      }).present();
    } else if (!this.selectLabel) {
      this.toastCtrl
        .create({
          message: "请选择培训内容~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else {
      this.loadModal("MapPage");
    }
  }

  //处理任务
  addTask(type: string, data: Object) {
    this.commonProvider.handleTasks(type, data).then((data: HttpResponse) => {
      if (data.errcode === 0) {
        const toaster = this.toastCtrl.create({
          message: "任务提交成功~",
          duration: 2000,
          position: "top"
        });
        toaster.present();
        toaster.onDidDismiss(() => {
          this.navCtrl.parent.select(0);
          this.navCtrl.popToRoot();
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
