#thuc hien build IOS,
#npm i

# Cach 1: ----- bien dich va chay tren xcode for debug -----
ionic cordova plugin save
ionic cordova platform remove ios
ionic cordova platform add ios --save
ionic cordova build ios --prod --release

#Open xcode select <project_name>.xcodeproj 
#File --> Project settings --> Build system = Legacy Build System
#project navigator -> select <project name> --> targets --> select <projectname> 
#in tab General --> go to row: signing --> select team --> add account registered with apple for deverloper
# run build and install in ios


# Cach 2: chay truc tiep thuong bi loi thi build voi tham so sau
#ionic cordova run ios -c

# Cach 3: Build tranh loi xay ra o cach 2
ionic cordova build ios -- --buildFlag="-UseModernBuildSystem=0"
ionic cordova run ios -- --buildFlag="-UseModernBuildSystem=0"




