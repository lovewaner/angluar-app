import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ModalController
} from "ionic-angular";
import {
  Store,
  ModalResponse,
  HttpResponse,
  Task,
  DPSUser
} from '../../interface/index';
import { CommonProvider } from '../../providers/common/common';

/**
 * Generated class for the CheckMaterielPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-check-materiel',
  templateUrl: 'check-materiel.html',
})
export class CheckMaterielPage {
  public store: Store;
  public cardPicker: Object[];
  public card: number;
  public bannerPicker: Object[];
  public banner: number;
  public screenPicker: Object[];
  public screen: number;
  public remarks: string;
  public toast: any;
  public type = 1;
  public user: DPSUser = localStorage.getItem("dpsuser")
  ? JSON.parse(localStorage.getItem("dpsuser"))
  : {};
  public taskInfo: Task.RootObject;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public commonProvider: CommonProvider
  ) {
    if (this.navParams.get("taskID")) {
      this.type = 2;
      this.commonProvider.getTasksID(this.navParams.get("taskID")).then((data: Task.RootObject) => {
        this.taskInfo = data[0];
        this.commonProvider.getStoreName(this.taskInfo.Shop_ID).then((store: Store) => {
          this.store = store[0];
        });
        this.remarks = this.taskInfo.Task_Remark;
        this.card = this.taskInfo.Decca_Num;
        this.banner = this.taskInfo.Roll_Banner;
        this.screen = this.taskInfo.Electronic_Screen;
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckMaterielPage');
  }
  ngOnInit() {
    this.cardPicker = [
      {
        options: [
          { text: "0张", value: "0" },
          { text: "1张", value: "1" },
          { text: "2张", value: "2" },
          { text: "3张", value: "3" },
          { text: "4张", value: "4" },
          { text: "5张", value: "5" },
          { text: "6张", value: "6" },
          { text: "7张", value: "7" },
          { text: "8张", value: "8" },
          { text: "9张", value: "9" },
          { text: "10张", value: "10" }
        ]
      }
    ];
    this.bannerPicker = [
      {
        options: [
          { text: "0个", value: "0" },
          { text: "1个", value: "1" },
          { text: "2个", value: "2" },
          { text: "3个", value: "3" },
          { text: "4个", value: "4" },
          { text: "5个", value: "5" },
          { text: "6个", value: "6" },
          { text: "7个", value: "7" },
          { text: "8个", value: "8" },
          { text: "9个", value: "9" },
          { text: "10个", value: "10" }
        ]
      }
    ];
    this.screenPicker = [
      {
        options: [
          { text: "0台", value: "0" },
          { text: "1台", value: "1" },
          { text: "2台", value: "2" },
          { text: "3台", value: "3" },
          { text: "4台", value: "4" },
          { text: "5台", value: "5" },
          { text: "6台", value: "6" },
          { text: "7台", value: "7" },
          { text: "8台", value: "8" },
          { text: "9台", value: "9" },
          { text: "10台", value: "10" }
        ]
      }
    ];
  }

  onPickerChange(e, type: string) {
    switch (type) {
      case "card":
        this.card = e[0].value;
        break;
      case "banner":
        this.banner = e[0].value;
        break;
      case "screen":
        this.screen = e[0].value;
        break;
      default:
        break;
    }
  }

  onRemarksChange(e) {
    this.remarks = e;
  }

  update() {
    if (!this.store || !this.card || !this.banner || !this.screen) {
      this.toastCtrl
        .create({
          message: "请补全您的信息~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else if (!this.remarks) {
      this.toastCtrl
      .create({
        message: "请填写备注~",
        duration: 2000,
        position: "top"
      })
      .present();
    } else {
      const taskData = {
        Open_ID: this.user.Open_ID,
        Task_State: 2,
        Task_Remark: this.remarks || "",
        Shop_ID: this.store.Store_ID,
        Decca_Num: this.taskInfo.Decca_Num,
        Roll_Banner: this.taskInfo.Roll_Banner,
        Electronic_Screen: this.taskInfo.Electronic_Screen,
        ID: this.taskInfo.ID
      };
      this.addTask("update", taskData);
    }
  }

  submit(position: string) {
    if (!this.store || !this.card || !this.banner || !this.screen) {
      this.toastCtrl
        .create({
          message: "请补全信息~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else if (!this.remarks) {
      this.toastCtrl
      .create({
        message: "请填写备注~",
        duration: 2000,
        position: "top"
      })
      .present();
    } else {
      const map = this.modalCtrl.create("MapPage");
      map.present();
      map.onDidDismiss((res: ModalResponse) => {
        if (res.code === 0) return;
        const taskData = {
          Open_ID: this.user.Open_ID,
          Task_Type: '物料巡检',
          Task_State: 1,
          Task_Remark: this.remarks,
          Clock_Site: res.data.currentAddress || "",
          Longitude: res.data.currentPosition["lng"],
          Latitude: res.data.currentPosition["lat"],
          Shop_ID: this.store.Store_ID,
          Link_Href: "CheckMaterielPage",
          First_Type : "物料巡检",
          Decca_Num: this.card,
          Roll_Banner: this.banner,
          Electronic_Screen: this.screen,
        };
        console.log(taskData);
        this.addTask('insert', taskData);
      });
    }
  }

  //任务处理
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

  toPage(name: string, data?: Object) {
    const storeSelect = this.modalCtrl.create(name, data);
    storeSelect.onDidDismiss((data: ModalResponse) => {
      if (data.code === 0) return;
      if (this.store) {
        if (this.store.Store_ID === data.data["store"]["Store_ID"]) {
          return;
        }
      }
      this.store = data.data["store"];
      this.card = -1;
      this.banner = -1;
      this.screen = -1;
    });
    storeSelect.present();
  }
}
