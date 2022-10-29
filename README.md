# Install UniTime locally
Date Created: October 23, 2022 2:13 PM


## Install UniTime

Reference: [[Installation guide](https://docs.google.com/document/d/1VCscHsSpazzmsh_DQZiicqOjAda3eX0f4S9oxlll8CY/edit#)]

- Install JDK 8 or higher
    - [x]  Open JDK 19
    - Attempt using JDK 8 (correto), JDK 11 (Android) but did not work !?
- Install Apache Tomcat versions 8.5 and 9.0
    - [x]  Apache Tomcat versions 9.0
    - Java 16 or newer, you will need to set the --illegal-access=permit java option
        - [x]  Set in Configure Tomcat
        - [ ]  Should be set in JAVA-OPTS
    - A special Tomcat 10 compatible build of UniTime is needed (due to the change from Java EE to Jakarta EE).
        - [x]  Select the correct *.war file according to Tomcat version.
- Install MySQL 8.0 is supported as well
    - [x]  MySQL 8.0
    - [ ]  You may need to add serverTimezone parameter in the connection string
    - [x]  place the mysql-connector-java-x.x.x.jar under the Tomcat/lib folder.
    - Path to mysql: *C:\Program Files\MySQL\MySQL Workbench 8.0\*mysql.exe

- Install UniTime
    - Deploy the UniTime application (put *.war file under Tomcatwebapps)
    - Create UniTime custom properties file (used for db config, …)    

## Build UniTime

- Checkout a stable branch (currently using branch maint_UniTime46)
- Build with maven: mvn package
- The *.war file will be generated under unitime/target

## Run UniTime

- to create and populate the timetable database (only once for the first time)

```bash
mysql -u root --password="123456"
source unitime-4.6_bld96\doc\mysql\schema.sql
source unitime-4.6_bld96\doc\mysql\woebegon-data.sql
```

- to config jre location (optional step)

```bash
C:\Program Files\Android\Android Studio\jre\
C:\Users\tpntt\.jdks\temurin-1.8.0_345\
~jre\bin\server\jvm.dll
--> Access denied
C:\Program Files\Java\jdk-19
C:\Program Files\Java\jdk-19\bin\server\jvm.dll
--> Work
```

- Wolla, you should be able to open UniTime at [http://localhost:8080/UniTime](http://localhost:8080/UniTime)
