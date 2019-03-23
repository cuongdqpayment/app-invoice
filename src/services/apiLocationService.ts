
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiLocationService {

    locationTracking: any;
    currenLocation: any;

    constructor(private geoLocation: Geolocation) { }

    getCurrentLocation(){
        this.stopTracking();
        this.startTracking();
        return this.currenLocation;
    }

    initPosition() {
        return this.geoLocation.getCurrentPosition()
        .then(pos => {
                console.log('debug',pos);
                this.currenLocation = pos;
                return {lat:pos.coords.latitude,
                        lon:pos.coords.longitude,
                        timestamp:pos.timestamp,
                        time_tracking: new Date().getTime()
                        };
                    })
        .catch((err) => {
                console.log('error get current loc',err);
                throw err;
            })

    }
    //Theo dõi thay đổi vị trí
    startTracking() {
        this.locationTracking = this.geoLocation.watchPosition({
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 3000
        })
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