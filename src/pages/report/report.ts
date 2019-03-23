import { Component } from '@angular/core';
import { ItemSliding,  ToastController } from 'ionic-angular';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {

  chats: any[];
  logins: any[];

  constructor(private toastCtrl: ToastController) {
    this.chats = [
    {
      img: './assets/avatar-cher.png',
      name: 'Cher',
      message: 'Ugh. As if.',
      time: '9:38 pm'
    }, {
      img: './assets/avatar-dionne.png',
      name: 'Dionne',
      message: 'Mr. Hall was way harsh.',
      time: '8:59 pm'
    }, {
      img: './assets/avatar-murray.png',
      name: 'Murray',
      message: 'Excuse me, "Ms. Dione."',
      time: 'Wed'
    }];

    this.logins = [
    {
        icon: 'logo-twitter',
        name: 'Twitter',
        username: 'admin',
    }, {
        icon: 'logo-github',
        name: 'GitHub',
        username: 'admin37',
    }, {
        icon: 'logo-instagram',
        name: 'Instagram',
        username: 'imanadmin',
    }, {
        icon: 'logo-google',
        name: 'Google',
        username: 'cuongdq3500888',
    }, {
        icon: 'logo-codepen',
        name: 'Codepen',
        username: 'administrator',
    }];
  }

  more(item: ItemSliding) {
    console.log('More');
    item.close();
  }

  delete(item: ItemSliding) {
    console.log('Delete');
    item.close();
  }

  mute(item: ItemSliding) {
    console.log('Mute');
    item.close();
  }

  archive(item: ItemSliding) {
    this.expandAction(item, 'archiving', 'Chat was archived.');
  }

  download(item: ItemSliding) {
    this.expandAction(item, 'downloading', 'Login was downloaded.');
  }

  expandAction(item: ItemSliding, _: any, text: string) {
    // TODO item.setElementClass(action, true);

    setTimeout(() => {
      const toast = this.toastCtrl.create({
        message: text
      });
      toast.present();
      // TODO item.setElementClass(action, false);
      item.close();

      setTimeout(() => toast.dismiss(), 2000);
    }, 1500);
  }

}
