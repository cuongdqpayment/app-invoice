#ionic cordova plugin save
#ionic cordova platform remove android
#ionic cordova platform add android --save
#ionic cordova build android --prod --release
# onic cordova run android --device

#1. build --> release android 24.0 chay tren may win
ionic cordova build android --prod --release

#2. -->get file: <app>\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk
# -->copy to ./build to sign --> remame to: ./build/speedtest-app-unsigned.apk

# default lenh de go ngan gon
#export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/Users/cuongdq/Library/Android/sdk/platform-tools:/Users/cuongdq/Library/Android/sdk/tools:/Users/cuongdq/Library/Android/sdk/platform-tools:/Users/cuongdq/Library/Android/sdk/tools:/Users/cuongdq/Library/Android/sdk/build-tools/28.0.3/

#3. use keytool create key pair for sign 4year=365*4+1 chay tren may win/mac:
# keytool -genkey -v -keystore ./build/speedtest-app-key.keystore -alias speedtest-app-alias -keyalg RSA -keysize 2048 -validity 1461
# -->get file ./build/cng-release-key.keystore with pass when type

#4. jarsigner sign apk file chay tren may mac:
# jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./build/speedtest-app-key.keystore ./build/speedtest-app-unsigned.apk speedtest-app-alias

#5. zipalign align file apk: kiem tra echo $ANDROID_HOME cd den build-tools... chay tren mac
#  zipalign -v 4 ./build/speedtest-app-unsigned.apk ./build/speedtest-app.apk

#6. upload into playstore
