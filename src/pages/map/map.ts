import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  LoadingController,
  ToastController 
} from 'ionic-angular';
import { ModalResponse } from '../../interface/index'

//声明地图组建
declare var AMap; 
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  public map: any;
  public geolocation: any;
  public currentAddress: string;
  public currentPosition = {};
  public modalResponse: ModalResponse;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public ViewCtrl: ViewController,
    public LoadingCtrl: LoadingController,
    public ToastCtrl: ToastController,
  ) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  back() {
    this.modalResponse = {
      page: "MapPage",
      code: 0,
      action: "close",
      data: null,
    }
    this.ViewCtrl.dismiss(this.modalResponse);
  }

  getPosition() {
    this.loadMap()
  }
  
  clock() {
    this.modalResponse = {
      page: "MapPage",
      code: 1,
      action: "confirm",
      data: {
        currentAddress: this.currentAddress,
        currentPosition: this.currentPosition
      },
    }
    this.ViewCtrl.dismiss(this.modalResponse);
  }

  loadMap() {
    const loading = this.LoadingCtrl.create({
      content: '正在定位中...'
    });
    loading.present();
    this.map = new AMap.Map('container');
    this.map.setZoom(15);
    this.map.plugin('AMap.Geolocation', () => {
      this.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: false,        //显示定位按钮，默认：true
        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      this.map.addControl(this.geolocation);
      this.geolocation.getCurrentPosition();
      AMap.event.addListener(this.geolocation, 'complete', (res) => {
        this.currentAddress = res.formattedAddress;
        this.currentPosition = res.position;
        loading.dismiss();
      })
      AMap.event.addListener(this.geolocation, 'error', (res) => {
        loading.dismiss();
        loading.onDidDismiss(() => {
          this.ToastCtrl
            .create({
              message: "定位失败，请重新定位~",
              duration: 2000,
              position: "top"
            })
            .present();
        });
      })
    })
  }
}
