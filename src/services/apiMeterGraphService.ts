import { Injectable } from '@angular/core';

@Injectable()
export class ApiGraphService {
    
    private graphColor = {
        statusColor: "#309030",
        backgroundColor : "#E0E0E0",
        progressColor : "#EEEEEE"
    };

    constructor() { }
    
    initUI(colors?: {statusColor: string,
                    backgroundColor : string,
                    progressColor : string}) {
        if (colors) this.graphColor = colors; //doi mau default
        this.drawMeter(this.I("dlMeter"), 0, 0); 
        this.I("dlText").textContent = "";
    }

    I(id) { return document.getElementById(id); }

    drawMeter(c, amount, progress, colors?: {statusColor: string,
                                             backgroundColor : string,
                                             progressColor : string}) {

        var myColors = (colors)?colors:this.graphColor;
        
        var ctx = c.getContext("2d");
        var dp = window.devicePixelRatio || 1;
        var cw = c.clientWidth * dp, ch = c.clientHeight * dp;
        var sizScale = ch * 0.0055;
        if (c.width == cw && c.height == ch) {
            ctx.clearRect(0, 0, cw, ch);
        } else {
            c.width = cw;
            c.height = ch;
        }
        ctx.beginPath();
        ctx.strokeStyle = myColors.backgroundColor;
        ctx.lineWidth = 16 * sizScale;
        ctx.arc(c.width / 2, c.height - 58 * sizScale, c.height / 1.8 - ctx.lineWidth, -Math.PI * 1.1, Math.PI * 0.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = myColors.statusColor;
        ctx.lineWidth = 16 * sizScale;
        ctx.arc(c.width / 2, c.height - 58 * sizScale, c.height / 1.8 - ctx.lineWidth, -Math.PI * 1.1, amount * Math.PI * 1.2 - Math.PI * 1.1);
        ctx.stroke();
        if (typeof progress !== "undefined") {
            ctx.fillStyle = myColors.progressColor;
            ctx.fillRect(c.width * 0.3, c.height - 16 * sizScale, c.width * 0.4 * progress, 4 * sizScale);
        }
    }

    mbpsToAmount(s) {
        return 1 - (1 / (Math.pow(1.3, Math.sqrt(s))));
    }

    msToAmount(s) {
        return 1 - (1 / (Math.pow(1.08, Math.sqrt(s))));
    }

    updateUI(data: {state: 0|1, contermet: string, progress: number}) {
        this.I("dlText").textContent = (data.state == 1 && data.contermet ==  '0') ? "..." : data.contermet;
        this.drawMeter(this.I("dlMeter"), this.mbpsToAmount(Number(Number(data.contermet) * (data.state == 1 ? this.oscillate() : 1))), Number(data.progress));  
    }

    oscillate() {
        return 1 + 0.02 * Math.sin(Date.now() / 100);
    }
    
}