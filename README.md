# Event Controller project

🔥 This project is aimed at efficient administration of information broadcasting on collective display media.

🫡 We strive to provide a convenient and accessible experience for all users so that they can easily receive and share information in learning and work environments. 

😮 Full documentation on working inside the system (RU): http://rstring.mgul.ac.ru/guide

# How to install on server 

Installation is running on Ubuntu 22.04 LTS

1. Install Nodejs with nvm

``` 
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash 
```

Next, install the latest version with long support

``` 
nvm install --lts
 ```

2. Installing PostgreSQL and creating a database
``` 
sudo apt update
 ```
``` 
sudo apt -y install postgresql
 ```
Checking available locales
``` 
locale -a
 ```
Generate a new locale if it doesn't already exist And reload postgresql
``` 
locale-gen en_US.UTF-8
 ```
``` 
systemctl restart postgresql
 ```
Let's change the user and start the client to work with PostgreSQL
```
 sudo -u postgres psql
  ```
Create a database user
``` 
CREATE USER alexander_perelight WITH ENCRYPTED PASSWORD 'yourpass';
 ```
Create a database 
``` 
    CREATE DATABASE "ecdb"
    WITH OWNER "alexander_perelight"
    ENCODING 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE template0; 
```
One line command:
```
 CREATE DATABASE "ecdb" WITH OWNER "alexander_perelight" ENCODING 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8' TEMPLATE template0;
   ```
Granting rights to the user
``` 
GRANT ALL PRIVILEGES ON DATABASE ecdb TO alexander_perelight;
 ```

3. Installing the pg_cron add-on
```
 sudo apt-get -y install postgresql-14-cron 
```
Connect the add-on to the configuration file /etc/postgresql/14/main/postgresql.conf
```
  shared_preload_libraries = 'pg_cron'
```
Specify the timezone and database
The lines below should be added to the end of the file
``` 
    cron.timezone = 'Europe/Moscow'
    cron.database_name = 'ecdb'
```
Reload the database
```
systemctl restart postgresql
```
Create pg_cron extension
``` 
    su postgres
    psql -d ecdb
    CREATE EXTENSION pg_cron;
    GRANT USAGE ON SCHEMA cron TO alexander_perelight;
```

4. Setting up event_controller
Clone event_controller to the server
``` 
git clone https://github.com/ZETOsfx/event_controller.git
 ```
Move the database dump to another folder
```
 mv /root/event_controller/dump.sql /tmp 
 ```
Import dump into database
``` 
    su postgres
    psql ecdb < /tmp/dump.sql
```
Let's go to the folder with event_controller
```
 cd /root/event_controller/server 
 ```
Install modules
```
 npm i && cd vue && npm i 
 ```
Install pm2 globally
``` 
npm i pm2 -g 
```
Create a file
``` 
touch /root/event_controller/server/.env 
```
Let's write the data for connecting to the database
```     
    DB_USER=alexander_perelight
    DB_PASSWORD=yourpass
    MAIN_DB=ecdb
    SECRET=123222
    PORT=80
```
Start server
``` 
pm2 start /root/event_controller/server/server.js 
```
Congrats! Installation completed


© 2023 EditorService Team:
-
1) [funpin](https://github.com/funpin) : Design, layout, clown 🤡
2) [zazacaca32](https://github.com/zazacaca32) : Server setup, professional 😎
3) [zetosfx](https://github.com/ZETOsfx) : Controller making, optimization, genius 🤯