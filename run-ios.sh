#sau khi cai va thiet lap sign trong xcode thi moi chay buoc 2

#buoc 1: cai dat moi truong platform
# Khi đổi tên trong config.xml thì ba bước này phải thực hiện lại đầy đủ

#ionic cordova plugin save
#ionic cordova platform remove ios
#ionic cordova platform add ios --save

#buoc 2: 
#Open xcode select <project_name>.xcodeproj 
#File --> Project settings --> Build system = Legacy Build System
#project navigator -> select <project name> --> targets --> select <projectname> 
#in tab General --> go to row: signing --> select team --> add account registered with apple for deverloper

# buoc 3: chay truc tiep tu dong lenh, khong debug console log duoc
#ionic cordova build ios -- --buildFlag="-UseModernBuildSystem=0"



ionic cordova run ios -- --buildFlag="-UseModernBuildSystem=0"
