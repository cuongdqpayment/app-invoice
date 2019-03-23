import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'page-link',
  templateUrl: 'link.html'
})
export class LinkPage {

  parent:any;
  linkOrigin: string;
  public link: SafeResourceUrl;
  
  constructor(
    private viewCtrl: ViewController
    , private navParams: NavParams
    , private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.parent = this.navParams.get("parent");
    this.linkOrigin = this.navParams.get("link");
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl(this.linkOrigin);
  }

  onClickClose(){
    if (this.parent) this.viewCtrl.dismiss()
  }
}
