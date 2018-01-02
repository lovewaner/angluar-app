import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController
 } from 'ionic-angular';
import { CalendarComponentOptions } from 'ion2-calendar';
import { DPSUser, HttpResponse } from '../../interface/index';
import { CommonProvider } from '../../providers/common/common';
/**
 * Generated class for the TaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "high"
})
@Component({
  selector: 'page-task',
  templateUrl: 'task.html',
})
export class TaskPage {
  public type: 'string';
  public optionsMulti: CalendarComponentOptions;
  public currentDate: string;
  public user: DPSUser = localStorage.getItem('dpsuser') ? JSON.parse(localStorage.getItem('dpsuser')) : {};
  public taskList: object[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public commonProvider: CommonProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
  ) {
    this.optionsMulti = {
      pickMode: "single",
      disableWeeks: [],
      monthFormat: "YYYY 年 MM 月 ",
      monthPickerFormat: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
      ],
      weekdays: ["日", "一", "二", "三", "四", "五", "六"]
    };
    const Y = new Date().getFullYear(), 
    M = (new Date().getMonth() + 1) > 9 ?  new Date().getMonth() + 1 : `0${(new Date().getMonth() + 1)}`,
    D = new Date().getDate() > 9 ? new Date().getDate() : `0${new Date().getDate()}`
    this.currentDate = Y + '-' + M + '-' + D;
  }

  ionViewWillEnter() {
    const loading = this.loadingCtrl.create({
      content: "加载中..."
    });
    loading.present();
    this.commonProvider.getTasks(this.user.Open_ID, this.currentDate).then((data: HttpResponse) => {
        loading.dismiss();
        loading.onDidDismiss(() => {
          this.taskList = data.data;
        });
    });
  }
  onChange($event) {
    console.log($event);
  }

  monthChange($event) {
    console.log($event);
  }

  toPage(name: string, data?: Object) {
    this.navCtrl.push(name, data);
  }
}
