import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { convertEnumToColumn } from 'ion-multi-picker';

/**
 * Generated class for the MinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
enum Fruit {
	Apple, Orange, Melon, Banana, Pear, App,
}

@IonicPage()
@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html',
})

export class MinePage {
  fruits: any[];
	fruit: Fruit;
  Fruit;
  cancelText: string = '取消'
  doneText: string = '确定'
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.fruit = Fruit.Melon;
		this.Fruit = Fruit;
		this.fruits = convertEnumToColumn(this.Fruit);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MinePage');
  }

}
