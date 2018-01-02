import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ToastController
} from 'ionic-angular';
import {
  Store,
  ModalResponse,
  StoreWaiter,
  HttpResponse,
  Task,
  DPSUser
} from '../../interface/index';
import { CommonProvider } from '../../providers/common/common';
import { Unit } from '../../units/units';

/**
 * Generated class for the MallDistributionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-mall-distribution',
  templateUrl: 'mall-distribution.html',
})
export class MallDistributionPage {
  public store: Store;
  public waiterList: StoreWaiter[];
  public waiter: string[] | string;
  public remarks: string;
  public selectWaiter = new Set([]);
  public oldSelectWaiter = new Set([]);
  public taskInfo: Task.RootObject;
  public type = 1;
  public user: DPSUser = localStorage.getItem("dpsuser") ? JSON.parse(localStorage.getItem("dpsuser")) : {}

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public commonProvider: CommonProvider,
    public toastCtrl: ToastController,
  ) {
    if (this.navParams.get("taskID")) {
      this.type = 2;
      // 根据TaskID获取数据
      this.commonProvider.getTasksID(this.navParams.get("taskID")).then((data: Task.RootObject[]) => {
        this.taskInfo = data[0];
        this.remarks = this.taskInfo.Task_Remark;
        // 根据门店ID获取门店名
        this.commonProvider.getStoreName(this.taskInfo.Shop_ID).then((data: Store[]) => {
          this.store = data[0];
          // 根据门店ID获取该门店下所有服务顾问
          this.commonProvider.getWaiter(this.store.Store_ID).then((data: StoreWaiter[]) => {
            this.waiterList = data;
          });
        });
        const Waiter = [];
        this.taskInfo.People.forEach((item: Task.Person) => {
          Waiter.push(item.People_Name)
          this.selectWaiter.add(item.Open_ID);
          this.oldSelectWaiter.add(item.Open_ID);
        });
        this.waiter = Waiter;
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MallDistributionPage');
  }

  onRemarksChange(e){
    this.remarks = e;
  }

  ngWaiterChange() {
    const result = this.waiterList.filter((item: StoreWaiter, index) => 
      this.waiter.toString().indexOf(item.Waiter_Name) > -1
    );
    result.forEach((item, index) => {
      this.selectWaiter.add(item.Open_ID);
    });
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
    } else {
      const taskData = {
        Open_ID: this.user.Open_ID,
        Task_State: 2,
        Task_Remark: this.remarks || "",
        Shop_ID: this.store.Store_ID,
        ID: this.taskInfo.ID,
        Task_ID: this.taskInfo.Task_ID,
      };
      if (!Unit.CompareArray
        (
          Array.from(new Set(this.selectWaiter)),
          Array.from(new Set(this.oldSelectWaiter)),
        )
      ) {
        taskData["People"] = Array.from(new Set(this.selectWaiter));
      }
      this.addTask('update', taskData);
    }
  }

  // 提交至数据库
  submit() {
    if (!this.store) {
      this.toastCtrl
        .create({
          message: "请选择门店~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else if (!this.waiter) {
      this.toastCtrl
      .create({
        message: "请选择服务顾问~",
        duration: 2000,
        position: "top"
      })
      .present();
    } else {
      const map = this.modalCtrl.create('MapPage');
      map.present();
      map.onDidDismiss((res: ModalResponse) => {
        if (res.code === 0) return;
        const taskData = {
          Open_ID: JSON.parse(localStorage.getItem('dpsuser'))["Open_ID"],
          Task_Type: "商城配送",
          Task_State: 1,
          Task_Remark: this.remarks || "",
          Clock_Site: res.data.currentAddress || "",
          Longitude: res.data.currentPosition["lng"],
          Latitude: res.data.currentPosition["lat"],
          Shop_ID: this.store.Store_ID,
          Link_Href: "MallDistributionPage",
          First_Type: "商城配送",
          People: Array.from(new Set(this.selectWaiter))
        }
        this.addTask('insert', taskData);
      })
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
    const searchStore = this.modalCtrl.create(name, data);
    searchStore.present();
    searchStore.onDidDismiss((data: ModalResponse) =>{
      if (data.code === 0) return;
      if (this.store) {
        if (this.store.Store_ID === data.data["store"]["Store_ID"]) return;
      }
      this.store = data.data["store"];
      this.waiter = "";
      this.commonProvider.getWaiter(this.store.Store_ID).then((data: StoreWaiter[]) => {
        this.waiterList = data;
      });
    });
  }
}
