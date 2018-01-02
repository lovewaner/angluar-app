import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { ModalResponse } from "../../interface/index";

/**
 * Generated class for the BranchSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-branch-search',
  templateUrl: 'branch-search.html',
})
export class BranchSearchPage {
  @ViewChild("ToolBarSearch") ToolBarSearch: ElementRef;
  @ViewChild("Search") Search: ElementRef;

  public brandList: Object[] = [];
  public searchList: Object[] = [];
  public brandName: string;
  public modalResponse: ModalResponse;

  constructor(
    public viewCtrl: ViewController,
    public commonProvider: CommonProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController
  ) {
  }

  ngOnInit() {
    const loading = this.loadingCtrl.create({
      content: "加载中..."
    })
    loading.present();
    this.commonProvider.getCarBrand().then((data: any) => {
      loading.dismiss();
      this.brandList = data.slice(0, 218);
      this.searchList = this.brandList;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BranchSearchPage');
  }

  getBrand(e) {
    if (e === "") {
      this.searchList = this.brandList;
    } else if (e && e !== "") {
      this.searchList = this.brandList.filter(
        item => item["name"].indexOf(e) > -1
      );
    }
  }
  closePage() {
    this.modalResponse = {
      page: "BranchSearchPage",
      code: 0,
      action: "close",
      data: null
    };
    this.viewCtrl.dismiss(this.modalResponse);
  }
  selectBrand(brand: Object) {
    this.modalResponse = {
      page: "BranchSearchPage",
      code: 1,
      action: "confirm",
      data: {
        brand
      }
    };
    this.viewCtrl.dismiss(this.modalResponse);
  }
  onScroll(e) {
    const distance =
      e.scrollTop <= 0 ? 0 : e.scrollTop >= 100 ? 100 : e.scrollTop;
    const opacity = Number(1 - distance / 100).toFixed(1);
    this.ToolBarSearch.nativeElement.style.opacity = Number(
      distance / 100
    ).toFixed(1);
    this.ToolBarSearch.nativeElement.style.transform = `scale(${Number(
      distance / 100
    ).toFixed(1)}, ${Number(distance / 100).toFixed(1)})`;
    this.Search.nativeElement.style.opacity = opacity;
    this.Search.nativeElement.style.transform = `scale(${Number(
      1 - distance / 100
    ).toFixed(1)}, ${Number(1 - distance / 100).toFixed(1)})`;
  }

}
