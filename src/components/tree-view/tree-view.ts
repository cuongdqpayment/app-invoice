import { Component, Input } from '@angular/core';

@Component({
    selector: 'tree-view',
    templateUrl: "tree-view.html"
})
export class TreeView {
    @Input() treeData: any[];
    @Input() level: number = 0;
    @Input() callback: any;

    constructor() { }

    toggleChildren(node: any) {
        node.visible = !node.visible;
    }

    onClickExpand(node,idx,parent){
        node.visible = !node.visible;    
        if (this.callback) this.callback(node,idx,parent)
    }

    onClickItem(node,idx,parent){
        if (node.click&&this.callback) this.onClickMore(node,idx,parent)
    }
    
    onClickMore(node,idx,parent){
        if (this.callback) this.callback(node,idx,parent,true)
    }
}