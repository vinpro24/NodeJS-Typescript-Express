# [NodeJS Typescript Express]

![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
[![GitHub issues open](https://img.shields.io/github/issues/creativetimofficial/material-dashboard-react.svg)](https://github.com/vinpro24/NodeJS-Typescript-Express/issues?q=is%0Aopen+is%3Aissue)
[![GitHub issues closed](https://img.shields.io/github/issues-closed-raw/creativetimofficial/material-dashboard-react.svg)](https://github.com/vinpro24/NodeJS-Typescript-Express/issues?q=is%3Aissue+is%3Aclosed)

Template for building NodeJS, Typescript and ExpressJS services. The main goal of this boilerplate is to offer a good Developer Experience (eg: debugging, watch and recompile) by providing the
following features out of the box:

**_Features_**

-   Language - [TypeScript](https://www.typescriptlang.org/)
-   REST API - [ExpressJS](https://expressjs.com/)
-   Graceful Shutdown - [Pattern](https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html)
-   HealthCheck - [Pattern /health](http://microservices.io/patterns/observability/health-check-api.html)
-   MongoDB Database - [Mongoose](https://mongoosejs.com)
-   Authentication and Authorization - [JWT](https://github.com/auth0/node-jsonwebtoken)
-   Validation - [Joi](https://github.com/hapijs/joi)
-   Testing - [Jest](https://jestjs.io) [Supertest](https://github.com/ladjs/supertest) [Coverage](https://istanbul.js.org/)
-   Code Style - [Prettier](https://prettier.io/)
-   Git Hooks - [Husky](https://github.com/typicode/husky)

## Installation & Run

-   _npm install_ - Install dependencies
-   _npm run start_ - Start application (It needs a database)

### Running with Docker

-   _docker-compose up_ (compose and run, it also creates the database)
-   _docker-compose down_ (Destroy application and containers)

## Useful npm commands

-   _npm run build_ - Transpile TypeScript code
-   _npm run clean_ - Remove dist
-   _npm run dev_ - Run application in dev mode (debug & watch). Debug mode is running on port 3000 (open `chrome://inspect/#devices`).
-   _npm run test:ci_ - Run unit tests
-   _npm run test_ - Run Unit and rerun Jest tests when a file changes

## Deploy app to AWS EC2 Ubuntu 22 Server with free SSL and Nginx reverse proxy

### 1. Launch amazon ubuntu server in aws + Attach Elastic IP to the new instance

### 2. ssh to ubuntu to install packages

```sh
ssh -i <key.pem> ubuntu@<ip-address> -v
```

### 3. Update and Upgrade linux machine and install node and nginx

```sh
sudo apt update
```

```sh
sudo apt upgrade
```

```sh
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
```

```sh
sudo apt-get install -y nodejs
```

```sh
sudo apt-get install -y nginx
```

#### 3.1 Config nginx and restart it

```sh
cd /etc/nginx/sites-available
sudo nano default

server_name yourdomain.com www.yourdomain.com;
location / {
	proxy_pass  http://localhost:3000;
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade;
}
sudo systemctl restart nginx
```

#### 3.2 Install pm2

```sh
sudo npm i -g pm2
```

#### 3.3 Starting the app with pm2 (Run nodejs in background and when server restart)

```sh
pm2 start app.js --name=BackendAPI
```

#### 3.4 Saves the running processes. If not saved, pm2 will forget, the running apps on next boot

```sh
pm2 save
```

#### 3.5 IMPORTANT: If you want pm2 to start on system boot

```sh
pm2 startup
```

#### 3.6 Restart the nodejs api server

```sh
pm2 restart BackendAPI
```

#### You should now be able to visit your IP with no port (port 80) and see your app. Now let's add a domain

### 94 Add domain in goDaddy.com

If you have domain, you can add A record to your EC2 instance IP with a new subdomain as I'm going to show you next

#### 4.1 Check that Port 80 redirect to Nodejs server

### 5 Installing Free SSL

#### 5.1 Installing Certbot

```sh
sudo snap install core; sudo snap refresh core
```

```sh
sudo apt remove certbot
```

```sh
sudo snap install --classic certbot
```

```sh
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

#### 5.2 Confirming Nginx’s Configuration

```sh
sudo nano /etc/nginx/sites-available/default
```

let edit this line:

```sh
...
server_name example.com www.example.com;
...
```

```sh
sudo nginx -t
```

```sh
sudo systemctl reload nginx
```

#### 5.3 Obtaining an FREE SSL Certificate

```sh
sudo certbot --nginx -d app.example.com
```

Output:

```
IMPORTANT NOTES:
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/your_domain/fullchain.pem
Key is saved at: /etc/letsencrypt/live/your_domain/privkey.pem
This certificate expires on 2022-06-01.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
* Donating to ISRG / Let's Encrypt: https://letsencrypt.org/donate
* Donating to EFF: https://eff.org/donate-le
```

#### 5.4 Verifying Certbot Auto-Renewal

```sh
sudo systemctl status snap.certbot.renew.service
```

Output:

```
○ snap.certbot.renew.service - Service for snap application certbot.renew
     Loaded: loaded (/etc/systemd/system/snap.certbot.renew.service; static)
     Active: inactive (dead)
TriggeredBy: ● snap.certbot.renew.timer
```

To test the renewal process, you can do a dry run with certbot:

```sh
sudo certbot renew --dry-run
```

### 6. Visit your website HTTPS://<your website>

Enjoy Your free Nodejs server with Free SSL :)

## Support 🙏😃

If you Like the tutorial and you want to support my channel so I will keep releasing amzing content that will turn you to a desirable Developer with Amazing Cloud skills... I will realy appricite if
you:

1.  Subscribe to My youtube channel and leave a comment: http://www.youtube.com/@VinPro24
2.  Buy me A coffee ❤️ : https://www.buymeacoffee.com/vinpro24

Thanks for your support :)

<a href="https://www.buymeacoffee.com/vinpro24"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=vinpro24&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>
