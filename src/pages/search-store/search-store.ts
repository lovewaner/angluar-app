import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Store, ModalResponse } from '../../interface/index'

/**
 * Generated class for the SearchStorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-search-store',
  templateUrl: 'search-store.html',
})
export class SearchStorePage {
  @ViewChild("ToolBarSearch") ToolBarSearch: ElementRef;
  @ViewChild("Search") Search: ElementRef;

  public StoreList: Store[];
  public SelectList: Store[];
  public SearchValue: string = "";
  public modalResponse: ModalResponse;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonProvider: CommonProvider,
    public ViewCtrl: ViewController,
    public LoadingCtrl: LoadingController,
  ) {
    const loading = this.LoadingCtrl.create({
      content: "加载中..."
    });
    loading.present();
    this.commonProvider.getStore().then((data: Store[]) => {
      setTimeout(() => {
        loading.dismiss();
        this.StoreList = data;
        this.SelectList = data;
      }, 800);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchStorePage');
  }

  getStore(e) {
    if (e === "") {
      this.SelectList = this.StoreList;
    } else {
      this.SelectList = this.StoreList.filter((res) => res.Store_Name.indexOf(e) > -1);
    }
  }

  //关闭searchModal页面返回数据
  closePage() {
    this.modalResponse = {
      page: "SearchStorePage",
      code: 0,
      action: "close",
      data: null
    }
    this.ViewCtrl.dismiss(this.modalResponse);
  }

  //选择店名返回数据 
  selectStore(store: Store) {
    this.modalResponse = {
      page: "SearchStorePage",
      code: 1,
      action: "confirm",
      data: {
        store
      }
    }
    this.ViewCtrl.dismiss(this.modalResponse);
  }

  onScroll(e) {
    const dis = e.scrollTop <= 100 ? 0 : e.scrollTop >= 100 ? 100 : e.scrollTop;
    const opacity = Number(1 - dis / 100).toFixed(1);
    this.ToolBarSearch.nativeElement.style.opacity = Number(dis / 100).toFixed(1);
    this.ToolBarSearch.nativeElement.style.transform = `scale(${Number(
      dis / 100
    ).toFixed(1)}, ${Number(dis / 100).toFixed(1)})`;
    this.Search.nativeElement.style.opacity = opacity;
    this.Search.nativeElement.style.transform = `scale(${Number(
      1 - dis / 100
    ).toFixed(1)}, ${Number(1 - dis / 100).toFixed(1)})`;
  }
}
