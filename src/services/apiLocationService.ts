
/**
 * dich vu nay lay va kiem tra thiet bi cordova
 * gom:
 * network
 * device
 * sim
 * platform
 * toa do
 */

import { Geolocation } from '@ionic-native/geolocation';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { Sim } from '@ionic-native/sim';

@Injectable()
export class ApiLocationService {

    locationTracking: any;
    currenLocation: any;

    constructor(
        private sim: Sim,
        private network: Network,
        private device: Device,
        private geoLocation: Geolocation,
        private platform: Platform
        ) { }



    getPlatform(){
        return {
                platforms: this.platform.platforms(),
                is_cordova: this.platform.is('cordova'),
                is_web: this.platform.is('core'),
                is_ios: this.platform.is('ios'),
                is_android: this.platform.is('android'),
                is_mobile: this.platform.is('mobile')
            }
    }

    getDevice(){
        return {
                cordova: this.device.cordova,
                is_virtual: this.device.isVirtual,
                manufacturer: this.device.manufacturer,
                model: this.device.model,
                serial: this.device.serial,
                platform: this.device.platform,
                uuid: this.device.uuid,
                version: this.device.version
               }
    }

    getNetwork(){
        return {
                type:  this.network.type,
                downlinkMax:  this.network.downlinkMax
               }
        
    }

    getSim(){
       return this.sim.getSimInfo()
       .then(info=>{
        return {
            carrier_name: info.carrierName,
            country_code: info.countryCode,
            phone: info.phoneNumber,
            mcc: info.mcc,
            mnc: info.mnc,
            imsi: info.subscriberId
         }
       })
       .catch(err=>{
        return {error: JSON.stringify(err)}
       })
    }
        
    getCurrentLocation(){
       return this.geoLocation.getCurrentPosition({
                                                    enableHighAccuracy: true,
                                                    timeout: 5000,
                                                    maximumAge: 3000
                                                    })
        .then(pos => {
            this.currenLocation = pos;
            return {lat:pos.coords.latitude,
                    lon:pos.coords.longitude,
                    timestamp:pos.timestamp
                    };
        })
        .catch((err) => {
            return {error:JSON.stringify(err)}    
        })
    }

    //Theo dõi thay đổi vị trí
    startTracking() {
        this.locationTracking = this.geoLocation.watchPosition(
            {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 3000
            }
        )
            .subscribe((pos) => {
                this.currenLocation = { lat:pos.coords.latitude,
                                        lon:pos.coords.longitude,
                                        timestamp:pos.timestamp,
                                        time_tracking: new Date().getTime()
                                      }
                    
            },
                err => {
                    console.log('error get tracking loc',err);
                }
            )
    }
    stopTracking() {
        try { this.locationTracking.unsubscribe() } catch (e) { };
    }
}