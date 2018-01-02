import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { ModalResponse, Store, DPSUser, HttpResponse, Task } from '../../interface/index';
import { CommonProvider } from '../../providers/common/common'; 
import { Unit } from '../../units/units';

/**
 * Generated class for the TalkDoormanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-talk-doorman',
  templateUrl: 'talk-doorman.html',
})
export class TalkDoormanPage {
  public user: DPSUser = localStorage.getItem("dpsuser") ? JSON.parse(localStorage.getItem("dpsuser")) : {};
  public store: Store;
  public type = 1;
  public remarks: string;
  public labelList: Object[] = [];
  public selectLabel = new Set([]);
  public oldSelectLabel = new Set([]);
  public taskInfo: Task.RootObject;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public commonProvider: CommonProvider,
    public toastCtrl: ToastController
  ) {
  }

  ngOnInit() {
    if (this.navParams.get("taskID")) {
      this.type = 2;
      this.commonProvider
        .getTasksID(this.navParams.get("taskID"))
        .then((task: Task.RootObject[]) => {
          console.log(task);
          this.taskInfo = task[0];
          this.remarks = this.taskInfo.Task_Remark;
          this.taskInfo.Label_List.forEach((element: Task.LabelList) => {
            this.selectLabel.add(element.Label_ID);
            this.oldSelectLabel.add(element.Label_ID);
          });
          this.commonProvider
            .getStoreName(this.taskInfo.Shop_ID)
            .then((store: Store) => {
              this.store = store[0];
            });
        });
    }
    this.getTaskLabel();
  }

  update() {
    if (!this.store) {
    this.toastCtrl
      .create({
        message: "请选择店名~",
        duration: 2000,
        position: "top"
      }).present();
    } else if (this.selectLabel.size === 0) {
      this.toastCtrl
        .create({
          message: "请选择交流内容~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else {
      const task = {
        ID: this.taskInfo.ID,
        Task_ID: this.taskInfo.Task_ID,
        Task_State: 2,
        Task_Remark: this.remarks || "",
        Shop_ID: this.store.Store_ID
      };
      if (
        !Unit.CompareArray(
          Array.from(new Set(this.selectLabel)),
          Array.from(new Set(this.oldSelectLabel))
        )
      ) {
        task["Label_List"] = Array.from(new Set(this.selectLabel));
      }
      this.addTask("update", task, "更新");
    }
  }

  getTaskLabel() {
    this.commonProvider.getTaskLabel("门卫交流").then((data: HttpResponse) => {
      if (data.errcode === 0) {
        const result = [];
        for (let i = 0, len = data.data.length; i < len; i += 3) {
          result.push(data.data.slice(i, i + 3));
        }
        this.labelList = result;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TalkDoormanPage');
  }

  loadModal(name: string, data?: object) {
    const selectStore = this.modalCtrl.create(name, data);
    selectStore.present();
    selectStore.onDidDismiss((data: ModalResponse) => {
      this.onDismissModal(data);
    });
  }

  onDismissModal(data: ModalResponse) {
    if (data.code === 0) return;
    switch (data.page) {
      case "SearchStorePage":
        if (this.store) {
          if (this.store.Store_Name === data.data["store"]["Store_Name"]) {
            return;
          }
        }
        this.store = data.data["store"];
        break;
      case "MapPage":
        const taskData = {
          Open_ID: this.user.Open_ID,
          Task_Type: "门卫交流",
          Task_State: 2,
          Task_Remark: this.remarks || "",
          Clock_Site: data.data["currentAddress"] || "",
          Longitude: data.data["currentPosition"]["lng"],
          Latitude: data.data["currentPosition"]["lat"],
          Shop_ID: this.store.Store_ID,
          Link_Href: "TalkDoormanPage",
          Label_List: Array.from(new Set(this.selectLabel)),
          First_Type : "交流"
        }
        this.addTask("insert", taskData, "提交");
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
      this.toastCtrl.create({
        message: "请选择门店~",
        duration: 2000,
        position: "top"
      }).present();
    } else if (this.selectLabel.size === 0) {
      this.toastCtrl
        .create({
          message: "请选择交流内容~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else {
      this.loadModal("MapPage");
    }
  }

  //处理任务
  addTask(type: string, data: Object, msgType: string) {
    this.commonProvider.handleTasks(type, data).then((data: HttpResponse) => {
      if (data.errcode === 0) {
        const toaster = this.toastCtrl.create({
          message: `任务${msgType}成功~`,
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
          message:  `任务${msgType}失败，请重试~`,
          duration: 2000,
          position: "top"
        });
        toaster.present();
      }
    });
  }
}
