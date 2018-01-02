import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ToastController
} from "ionic-angular";
import { CommonProvider } from "../../providers/common/common";
import {
  DPSUser,
  Store,
  StoreWaiter,
  HttpResponse,
  ModalResponse,
  Task
} from "../../interface/index";
import { Unit } from "../../units/units";
/**
 * Generated class for the TalkWaiterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-talk-waiter',
  templateUrl: 'talk-waiter.html',
})
export class TalkWaiterPage {
  public user: DPSUser = localStorage.getItem("dps-user")
  ? JSON.parse(localStorage.getItem("dps-user"))
  : {};
  public type = 1;
  public store: Store;
  public remarks: string;
  public waiter: string | string[];
  public waiterList: StoreWaiter[] = [];
  public selectWaiter = new Set([]);
  public oldSelectWaiter = new Set([]);
  public labelList: Object[] = [];
  public selectLabel = new Set([]);
  public oldSelectLabel = new Set([]);
  public taskInfo: Task.RootObject;

  constructor(
    public commonProvider: CommonProvider,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TalkWaiterPage');
  }

  ngOnInit() {
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
          this.taskInfo.Label_List.forEach((element: Task.LabelList) => {
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

  getTaskLabel() {
    this.commonProvider.getTaskLabel("服务顾问交流").then((data: HttpResponse) => {
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
    const result = this.waiterList.filter(
      (element: StoreWaiter, index) =>
        this.waiter.toString().indexOf(element.Waiter_Name) > -1
    );
    this.selectWaiter.clear();
    result.forEach((element: StoreWaiter, index) => {
      this.selectWaiter.add(element.Open_ID);
    });
  }

  loadModal(name: string, data?: object) {
    const modal = this.modalCtrl.create(name, data);
    modal.present();
    modal.onDidDismiss((data: ModalResponse) => {
      this.onModalDismiss(data);
    });
  }

  onModalDismiss(data: ModalResponse) {
    if (data.code === 0) return;
    switch (data.page) {
      case "SearchStorePage":
        if (this.store) {
          if (this.store.Store_ID === data.data["store"]["Store_ID"]) {
            return;
          }
        }
        this.store = data.data["store"];
        this.waiter = "";
        this.commonProvider
          .getWaiter(this.store.Store_ID)
          .then((data: StoreWaiter[]) => {
            this.waiterList = data;
          });
        break;
      case "LabelDescriptionsPage":
        if (!data.data["label"]["Is_Flag"]) {
          this.selectLabel.delete(data.data["label"]["ID"]);
          return;
        }
        this.selectLabel.add(data.data["label"]["ID"]);
        break;
      case "MapPage":
        const task = {
          Open_ID: this.user.Open_ID,
          Task_Type: "服务顾问交流",
          Task_State: 2,
          Task_Remark: this.remarks || "",
          Clock_Site: data.data["currentAddress"] || "",
          Longitude: data.data["currentPosition"]["lng"],
          Latitude: data.data["currentPosition"]["lat"],
          Shop_ID: this.store.Store_ID,
          People: Array.from(new Set(this.selectWaiter)),
          Label_List: Array.from(new Set(this.selectLabel)),
          Link_Href: "TrainWaiterPage",
          First_Type : "交流",
        };
        this.addTask("insert", task, "提交");
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
    } else if (this.selectLabel.size === 0) {
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

  update() {
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
      this.addTask("update", task, "更新");
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
