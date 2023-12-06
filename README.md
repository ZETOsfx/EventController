# Event Controller 

🔥 This project is aimed at efficient administration of information broadcasting on collective display media.

🫡 We strive to provide a convenient and accessible experience for all users so that they can easily receive and share information in learning and work environments.
  
#### How to install on server

Installation is running on Ubuntu 22.04 LTS

1. **Install NodeJS with NVM** 

```sh
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

Next, install the latest version with long support

```sh
nvm install --lts
```

2. **Installing PostgreSQL and creating a database**

```sh
sudo apt update
sudo apt -y install postgresql
```

Checking available locales

```sh
locale -a
```

Generate a new locale if it doesn't already exist And reload PostgreSQL

```sh
locale-gen en_US.UTF-8
systemctl restart postgresql
```

Let's change the user and start the client to work with PostgreSQL

```sh
sudo -u postgres psql
```

Create a database user

```sql
CREATE USER <username> WITH ENCRYPTED PASSWORD '<password>';
```

Create a database

```sql
CREATE DATABASE "<db_name>"
WITH OWNER "<username>"
ENCODING 'UTF8'
LC_COLLATE = 'en_US.UTF-8'
LC_CTYPE = 'en_US.UTF-8'
TEMPLATE template0;
```

One line command:

```sql
CREATE DATABASE "<db_name>" WITH OWNER "<username>" ENCODING 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8' TEMPLATE template0;
```

Granting rights to the user

```sql
GRANT ALL PRIVILEGES ON DATABASE <db_name> TO <username>;
```

Reload the database

```sh
systemctl restart postgresql
```

3. **Setting up EventController**

Clone EventController to the server.

```sh
git clone https://github.com/ZETOsfx/EventController
```

Install the dependencies for the client and the application server & install pm2 globally

```sh
cd /path/to/folder/EventController/server && npm ci 
cd /path/to/folder/EventController/client && npm ci 
npm i pm2 -g
```

Create a **server side config file**

```sh
touch /path/to/folder/EventController/server/.env
```

Let's write the config for the operation of the server part. 
The following format is used here:

```sh
SERVER_PORT=<app_port>
SECRET='<server_app_secret>'
COOKIE_LIVE=<cookie_lifetime_in_ms>
TOKEN_KEY='<auth_token_secret>'
AGE_OF_EDITOR_CALLBACK=3

# DATABASE
DB_HOST_MIG='<db_host>'
DB_PORT=<db_port>
DB_USER="<db_username>"
DB_PASSWORD="<db_password>"
MAIN_DB="<name_of_main_db>"

API_URL=http://<host_ip_form>:<app_port>
NODE_ENV="production"

# FILE UPLOAD FOLDER
UPLOAD_PATH_ORIGIN='<path_to_dir>'
UPLOAD_PATH_IMAGINE='upload' 
DISK_FREE='<path_to_dir_1_level_upper>'

# MAIL DATA
EMAIL='<primary_email_for_bugreports>'
TARGET_EMAIL='<secondary_for_bugreports>'

REFRESH_TOKEN_MAIL='<refresh_token_oauth2>'
CLIENT_ID_MAIL='<client_id_oauth2>'
CLIENT_SECRET_MAIL='<client_secret_oauth2>'
```

Next, create a **configuration file for ORM**:

```sh
touch /path/to/folder/EventController/server/config/config.json
```

The following format is used here:

```json
{  
	"development": {  
		"username": "root",  
		"password": null,  
		"database": "database_development",  
		"host": "127.0.0.1",  
		"dialect": "mysql"  
	},  
	"test": {  
		"username": "root",  
		"password": null,  
		"database": "database_test",  
		"host": "127.0.0.1",  
		"dialect": "mysql"  
	},  
	"production": {  
		"username": "root",  
		"password": null,  
		"database": "database_production",  
		"host": "127.0.0.1",  
		"dialect": "mysql"  
	}  
}
```

Similarly, we add the **configuration for migration** to the database. 

```sh
touch /path/to/folder/EventController/server/config/default.json
```

Format: 

```json
{
	"db": {
		"user": "<username>",
		"password": "<password>",
		"host": "<host>",
		"port": <port>,
		"database": "<db_name>"
	}
}
```

Performing migration:

```sh
cd /path/to/folder/EventController/server 
npm run migrate up
```

In case of successful migration, there will be a single default profile in the database:

```
Login: admin
Password: 1
```

Start server

```sh
pm2 start /path/to/folder/EventController/server/server.js
```

Go to the authorization page and log in to this account.

```
In your browser: http://<host>:<port>
Click on SignIn button in the lower left corner of the screen.
Log in under Admin.
```

Congrats! Installation completed.

---
EventController team: [funpin](https://github.com/funpin), [zazacaca32](https://github.com/zazacaca32), [zetosfx](https://github.com/ZETOsfx) © 2023 