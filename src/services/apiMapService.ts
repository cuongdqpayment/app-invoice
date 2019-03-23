import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiStorageService } from './apiStorageService';


@Injectable()
export class ApiMapService {
    GOOGLE_API_KEY = 'AIzaSyDBxMizhomgbDZ9ljbf9-mY_Omuo0heCig';
    WEATHER_API_KEY = '22bc862e9465e98d1c74b7351cab36ef';
    GOOGLE_POINTS_ENDCODER_DEFAULT = 1E5;

    countNoLoc:number = 0;

    public static moveLocations = {
        line: 'M -2,-2 2,2 M 2,-2 -2,2',
        car: 'M 5.60,4.30 C 9.29,-0.23 21.91,-0.11 24.98,5.14 26.41,7.60 26.00,13.99 26.00,17.00 26.00,17.00 30.00,17.00 30.00,17.00 30.00,17.00 30.00,20.00 30.00,20.00 30.00,20.00 26.00,20.00 26.00,20.00 26.00,20.00 26.00,40.00 26.00,40.00 25.98,42.34 26.21,45.49 24.40,47.26 21.59,50.02 7.35,49.95 5.02,46.57 3.87,44.89 4.01,41.97 4.00,40.00 4.00,40.00 4.00,20.00 4.00,20.00 4.00,20.00 0.00,20.00 0.00,20.00 0.00,20.00 0.00,17.00 0.00,17.00 0.00,17.00 4.00,17.00 4.00,17.00 4.00,13.52 3.38,7.01 5.60,4.30 Z M 7.00,15.00 C 10.40,23.37 19.60,23.37 23.00,15.00 16.93,12.19 13.11,12.46 7.00,15.00 Z M 7.00,40.00 C 10.93,33.40 11.55,26.44 7.00,20.00 5.42,23.99 5.42,36.01 7.00,40.00 Z M 24.00,39.00 C 24.00,39.00 24.00,20.00 24.00,20.00 18.29,24.87 18.29,34.13 24.00,39.00 Z M 7.00,44.00 C 12.69,45.38 17.31,45.38 23.00,44.00 19.37,35.76 10.63,35.76 7.00,44.00 Z',
    	car_s: 'M 5.60,4.30 C 9.29,-0.23 21.91,-0.11 24.98,5.14 26.45,7.66 26.00,14.86 26.00,18.00 26.00,18.00 29.00,19.00 29.00,19.00 27.80,19.80 27.30,19.74 26.59,21.29 25.60,23.48 26.01,35.78 26.00,39.00 25.99,41.53 26.34,45.36 24.40,47.26 21.59,50.02 7.35,49.95 5.02,46.57 3.87,44.89 4.01,41.97 4.00,40.00 4.00,40.00 4.00,19.00 4.00,19.00 4.00,19.00 1.00,18.00 1.00,18.00 6.79,14.12 1.83,8.91 5.60,4.30 Z M 7.00,14.00 C 7.45,15.79 7.64,17.18 8.89,18.69 11.36,21.67 17.60,21.70 20.53,19.40 22.03,18.22 22.97,16.56 24.00,15.00 16.84,12.02 14.31,13.04 7.00,14.00 Z M 5.00,40.00 C 10.71,34.81 10.23,25.99 6.00,20.00 6.00,20.00 5.00,40.00 5.00,40.00 Z M 25.00,39.00 C 25.00,39.00 25.00,20.00 25.00,20.00 19.29,24.87 19.29,34.13 25.00,39.00 Z M 6.00,44.00 C 13.64,45.37 16.36,45.37 24.00,44.00 19.57,35.80 10.43,35.80 6.00,44.00 Z',
        car_m: 'M 5.60,4.30 C 9.29,-0.23 21.91,-0.11 24.98,5.14 26.41,7.60 26.00,13.99 26.00,17.00 26.00,17.00 30.00,17.00 30.00,17.00 30.00,17.00 30.00,20.00 30.00,20.00 30.00,20.00 26.00,20.00 26.00,20.00 26.00,20.00 26.00,40.00 26.00,40.00 25.98,42.34 26.21,45.49 24.40,47.26 21.59,50.02 7.35,49.95 5.02,46.57 3.87,44.89 4.01,41.97 4.00,40.00 4.00,40.00 4.00,20.00 4.00,20.00 4.00,20.00 0.00,20.00 0.00,20.00 0.00,20.00 0.00,17.00 0.00,17.00 0.00,17.00 4.00,17.00 4.00,17.00 4.00,13.52 3.38,7.01 5.60,4.30 Z M 7.00,14.00 C 7.45,15.79 7.64,17.18 8.89,18.69 11.36,21.67 17.60,21.70 20.53,19.40 22.03,18.22 22.97,16.56 24.00,15.00 16.84,12.02 14.31,13.04 7.00,14.00 Z M 7.00,40.00 C 10.93,33.40 11.55,26.44 7.00,20.00 5.42,23.99 5.42,36.01 7.00,40.00 Z M 24.00,39.00 C 24.00,39.00 24.00,20.00 24.00,20.00 18.29,24.87 18.29,34.13 24.00,39.00 Z M 6.00,44.00 C 13.64,45.37 16.36,45.37 24.00,44.00 19.57,35.80 10.43,35.80 6.00,44.00 Z',
    	car_x: 'M 8.03,5.29 C 9.80,3.14 12.38,2.65 15.00,2.29 20.76,1.50 34.65,1.10 38.40,6.14 40.97,9.60 40.00,22.29 40.00,27.00 40.00,27.00 45.00,27.00 45.00,27.00 45.00,27.00 45.00,29.00 45.00,29.00 45.00,29.00 41.00,29.00 41.00,29.00 41.00,29.00 41.00,63.00 41.00,63.00 40.99,65.80 41.31,69.31 39.40,71.58 36.41,75.14 30.22,74.99 26.00,75.00 17.33,75.01 6.22,76.62 6.00,65.00 6.00,65.00 6.00,29.00 6.00,29.00 6.00,29.00 2.00,29.00 2.00,29.00 2.00,29.00 2.00,27.00 2.00,27.00 2.00,27.00 6.00,27.00 6.00,27.00 6.00,21.81 4.88,9.11 8.03,5.29 Z M 10.00,22.00 C 11.25,25.00 13.29,29.28 16.21,30.98 17.96,32.00 20.04,31.96 22.00,32.00 30.59,32.15 32.73,31.53 36.00,23.00 27.45,19.88 18.83,20.84 10.00,22.00 Z M 7.00,60.00 C 9.38,58.65 10.79,57.58 12.15,54.98 13.44,51.97 13.42,39.18 12.15,36.00 11.35,33.44 9.84,31.89 8.00,30.00 6.07,34.87 7.00,53.62 7.00,60.00 Z M 34.89,35.02 C 33.54,38.17 33.56,51.86 34.89,54.98 35.95,57.29 37.22,58.37 39.00,60.00 39.00,60.00 39.00,30.00 39.00,30.00 37.07,31.66 35.88,32.55 34.89,35.02 Z M 15.00,58.00 C 15.00,58.00 10.00,67.00 10.00,67.00 20.49,67.85 26.47,69.41 37.00,66.00 29.29,55.38 26.18,60.72 15.00,58.00 Z',
        //point: google.maps.SymbolPath.FORWARD_CLOSED_ARROW //tim kiem o google se co cac bieu tuong default
        blue:'#296ce8',
        yellow:'#FFFF7C',
        red:'#ff0000',
        green:'#00ff00',
        white:"#ffffff",
        black:"#000000",
        light:"#B1B1B1",
        brown:"#101010"
    }
    /* 
    urlLatLng ='https://maps.googleapis.com/maps/api/geocode/json?latlng=16.0652695,108.2010651&key=AIzaSyDBxMizhomgbDZ9ljbf9-mY_Omuo0heCig';
    urlAddress='https://maps.googleapis.com/maps/api/geocode/json?address=30%20be%20van%20dan,%20da%20nang&key=AIzaSyDBxMizhomgbDZ9ljbf9-mY_Omuo0heCig';
    urlRoute='https://maps.googleapis.com/maps/api/directions/json?origin=30%20Be%20van%20dan,%20da%20nang,%20viet%20nam&destination=263%20nguyen%20van%20linh,%20da%20nang&key=AIzaSyDBxMizhomgbDZ9ljbf9-mY_Omuo0heCig';
    urlWeather='https://api.openweathermap.org/data/2.5/weather?id=1905468&APPID=22bc862e9465e98d1c74b7351cab36ef&units=metric';
    */

    /* // Converts from degrees to radians.
    Math.radians = function(degrees) {
        return degrees * Math.PI / 180;
    };
   
    // Converts from radians to degrees.
    Math.degrees = function(radians) {
        return radians * 180 / Math.PI;
    }; */

  
    constructor(private httpClient: HttpClient) {}

    getWeatherApi(cityId: number) {
        return this.httpClient.get('https://api.openweathermap.org/data/2.5/weather?id='
            + cityId
            + '&APPID=' + this.WEATHER_API_KEY
            + '&units=metric')
            .toPromise()
            .then(data => {let rtn:any;rtn = data;return rtn})
    }

    getAddressFromLatlng(latlng: string) {
        //return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='
        return this.httpClient.get(ApiStorageService.mapServer + '/getPoint?latlng='
            + latlng
            + '&key=' + this.GOOGLE_API_KEY)
            .toPromise()
            .then(data => {let rtn:any;rtn = data;return rtn})
            //.then(apiJson => apiJson.results[0].formatted_address)
    }

    getLatlngFromAddress(address: string) {
        //return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='
        return this.httpClient.get(ApiStorageService.mapServer + '/getAddress?address='
            + address
            + '&key=' + this.GOOGLE_API_KEY)
            .toPromise()
            .then(data => {let rtn:any;rtn = data;return rtn})
    }

    
    getRouteApi(startPoint: string, endPoint: string) {
        return this.httpClient.get(
            ApiStorageService.mapServer + '/getRoutes?origin=' + startPoint
            + '&destination=' + endPoint
            + '&key=' + this.GOOGLE_API_KEY
            )
            .toPromise()
            .then(data => {let rtn:any;rtn = data;return rtn})
            .then(apiJson => {
                let routeApi =   {
                                route: apiJson.routes[0].overview_polyline.points,
                                points:this.decodePolyline(apiJson.routes[0].overview_polyline.points),
                                end_address: apiJson.routes[0].legs[0].end_address,
                                end_location: {
                                                lat : apiJson.routes[0].legs[0].end_location.lat,
                                                lng : apiJson.routes[0].legs[0].end_location.lng
                                                },
                                start_address: apiJson.routes[0].legs[0].start_address,
                                start_location: {
                                                lat : apiJson.routes[0].legs[0].start_location.lat,
                                                lng : apiJson.routes[0].legs[0].start_location.lng
                                                },
                                distance: {
                                    text: apiJson.routes[0].legs[0].distance.text,
                                    value: apiJson.routes[0].legs[0].distance.value
                                    },
                                duration: {
                                        text : apiJson.routes[0].legs[0].duration.text,
                                        value : apiJson.routes[0].legs[0].duration.value,
                                     },
                                cost: {
                                    vnd: 18,
                                    usd:0.1
                                }
                            }
                        return routeApi;
                    }
            )

    }

    /**
     * chuyen doi chuoi polyline thanh cac toa do diem
     * source: http://doublespringlabs.blogspot.com.br/2012/11/decoding-polylines-from-google-maps.html
     * @param encoded 
     */
    decodePolyline(encoded) {
        // array that holds the points
        var points = []
        var index = 0, len = encoded.length;
        var lat = 0, lng = 0;
        while (index < len) {
            var b, shift = 0, result = 0;
            do {
                b = encoded.charAt(index++).charCodeAt(0) - 63;//finds ascii                                                                                    //and substract it by 63
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lat += dlat;
            shift = 0;
            result = 0;
            do {
                b = encoded.charAt(index++).charCodeAt(0) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lng += dlng;
            points.push({ lat: (lat / 1E5), lng: (lng / 1E5) })
        }
        return points
    }

    /**
     * Cac ham de encode list latlng thanh chuoi points
     * https://jeromejaglale.com/doc/javascript/google_static_maps_polyline_encoding
     * @param coordinate
     * @return
     */
    floor1e5(coordinate) {
        return Math.floor(coordinate * this.GOOGLE_POINTS_ENDCODER_DEFAULT);
    }

    encodeSignedNumber(num:number) {
        let sgn_num = num << 1;
        if (num < 0) {
            sgn_num = ~(sgn_num);
        }
        return (this.encodeNumber(sgn_num));
    }

    encodeNumber(num:number) {

        let encodeString = "";

        while (num >= 0x20) {
            let nextValue = (0x20 | (num & 0x1f)) + 63;
            encodeString +=String.fromCharCode(nextValue);
            num >>= 5;
        }

        num += 63;
        encodeString +=String.fromCharCode(num);

        return encodeString;
    }

    /**
     * Thuc hien ma hoa mot chan duong da tracking gui len mang cho de dang
     * @param latLngs
     * @return
     */
    encodePoints(latLngs) {
        if (latLngs==null) return null;

        let encodedPoints = "";

        let plat = 0;
        let plng = 0;
        let counter = 0;

        let listSize = latLngs.size();

        let latLng;

        for (let i = 0; i < listSize; i++) {
            counter++;
            latLng = latLngs.get(i);

            let late5 = this.floor1e5(latLng.lat);
            let lnge5 = this.floor1e5(latLng.lng);

            let dlat = late5 - plat;
            let dlng = lnge5 - plng;

            plat = late5;
            plng = lnge5;

            encodedPoints +=this.encodeSignedNumber(dlat);
            encodedPoints +=this.encodeSignedNumber(dlng);
        }
        return encodedPoints;
    }


    /**
     * loc = { lat:pos.coords.latitude,
        lng:pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        speed: pos.coords.speed,
        altitude: pos.coords.altitude,
        altitudeAccuracy: pos.coords.altitudeAccuracy,
        heading: pos.coords.heading,
        timestamp:pos.timestamp,
        time_tracking: new Date().getTime()
       }
     * @param newLoc 
     */
    getSpeed(old,newLoc){
        let distance =  this.distance(old.lat,old.lng,newLoc.lat,newLoc.lng);
        let dtimestamp = newLoc.timestamp - old.timestamp;
        let dtime_tracking =  newLoc.time_tracking - old.time_tracking;
        let old_accuracy = old.accuracy;
        let new_accuracy = newLoc.accuracy;
        let speed = 0; //toc do theo di chuyen location
        let angle = this.angle(old.lat,old.lng,newLoc.lat,newLoc.lng);
        let next_point = {lat:newLoc.lat, lng:newLoc.lng, angle: angle}; //diem moi
        let next_speed = old.result&&old.result.next_speed?old.result.next_speed:speed;; //lay toc do cu

        if (old_accuracy<50 && new_accuracy<50){
            if (newLoc.timestamp&&old.timestamp&&newLoc.timestamp>old.timestamp) speed = Math.round(distance/dtimestamp*1000*60*60);
            //neu trong khoang thoi gian 1 giay ma chenh lech toc do cu va moi-cu>
            next_speed = speed; //toc do moi
            this.countNoLoc = 0; //reset so lan sai so
        } else{
            this.countNoLoc++; //so lan sai so tang len 1
            if (old.result&&old.result.next_point) next_point = {lat:old.result.next_point.lat, lng:old.result.next_point.lng, angle: old.result.next_point.angle}; //diem cu
            //diem gia lap ke tiep neu vi tri sai so qua nhieu
            if (old.result&&old.result.next_point&&old.result.next_point.angle&&this.countNoLoc<5)next_point=this.nextPoint(next_point.lat,next_point.lng,next_speed*dtime_tracking/60/60,old.result.next_point.angle);
        }

        return {
            distance: distance
            , angle: angle
            , dtimestamp: dtimestamp
            , dtime_tracking: dtime_tracking
            , old_accuracy : old.accuracy
            , new_accuracy : newLoc.accuracy
            , speed: speed
            , next_speed: next_speed
            , next_point: next_point
        }
    }


//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at https://www.geodatasource.com                         :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: https://www.geodatasource.com                       :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2018            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    distance(lat1:number, lon1:number, lat2:number, lon2:number, unit?:"M"|"K"|"N") {
        if (!unit) unit="K";
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }
    }

    angle(cx:number, cy:number, ex:number, ey:number) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta;
    }


    /**
     * Khi di chuyen ma toa do khong phu hop thi gia lap mot toa do theo huong di chuyen truoc do
     *
     * @param lat
     * @param lng
     * @param distance khoảng cách điểm đến là bao nhiêu (m)
     * @param bearing  góc di chuyển tính bằng độ (degree)
     * @return {lat,lng}
     * 
     */
    nextPoint(lat:number, lng:number, distance:number, bearing:number) {
        let radius = 6371000; //ban kinh trai dat tinh bang m
        let δ = distance / radius;
        let θ = bearing * Math.PI / 180;
        let φ1 = lat * Math.PI / 180;
        let λ1 = lng * Math.PI / 180;
        let φ2 = Math.asin((Math.sin(φ1) * Math.cos(δ)) + ((Math.cos(φ1) * Math.sin(δ)) * Math.cos(θ)));
        let λ2 = ((3 * Math.PI + (λ1 + Math.atan2((Math.sin(θ) * Math.sin(δ)) * Math.cos(φ1), Math.cos(δ) - (Math.sin(φ1) * Math.sin(φ2))))) % (2 * Math.PI)) - Math.PI;
        return {lat: φ2 * 180 / Math.PI, lng: λ2 * 180 / Math.PI, angle: bearing};
    }

}
