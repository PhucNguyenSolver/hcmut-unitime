## Requirements
Install Apache v 9.0
    C:\Program Files\Java\jdk-19\bin\server\jvm.dll
Install JDK 19
    set java option --illegal-access=permit 
Install MySQL 8.0
    put mysql-connector-java-x.x.x.jar under the Tomcat/lib

## Build UniTime

Checkout maint_UniTime46
run mvn package

## Run UniTime

## Unitime database

```bash
mysql -u root --password="123456"
source unitime-4.6_bld96\doc\mysql\schema.sql
source unitime-4.6_bld96\doc\mysql\woebegon-data.sql
```
- Wolla, you should be able to open UniTime at [http://localhost:8080/UniTime](http://localhost:8080/UniTime)
