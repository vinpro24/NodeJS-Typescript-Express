# [CI/CD with Node.js and a GitHub Actions Runner Hosted on AWS EC2](https://github.com/vinpro24/NodeJS-Typescript-Express) [![Github](https://fidisys.com/static/284833aec60836a86aff7e88d2e20b8b/39351/cicd.png)](https://github.com/vinpro24)

### 1. Create an AWS EC2 Instance

#### 1.1 Login to AWS console and create EC2 instance

![Sign in to AWS Management Console and go to the EC2 dashboard](https://reflectoring.io/images/posts/cicd-aws-nodejs/aws-console_hu09565dcf3de3673470d3b251e2447fcb_135266_2880x0_resize_box_3.png)

#### 1.2 Login to AWS console and create EC2 instance

![Set up the instances and configure it to meet the needs of our application](https://reflectoring.io/images/posts/cicd-aws-nodejs/ec2-name-os_hu6d8f8f833523098d9ff530ebf4f818d9_116569_2880x0_resize_box_3.png)
![Instance type: t2.micro (Free tier)](https://reflectoring.io/images/posts/cicd-aws-nodejs/t2-aws-micro_hu76d9b2a49ca75d9f6738f6276cad7a45_116960_2880x0_resize_box_3.png)
![Create Key Pair: cicd-key](https://reflectoring.io/images/posts/cicd-aws-nodejs/aws-pem-key_hu4b6bf17657653dac6ad40d49596ebf4a_116911_2880x0_resize_box_3.png)
![Create Key Pair: cicd-key](https://reflectoring.io/images/posts/cicd-aws-nodejs/aws-pem-key2_hu5cf604649ac844d68f4c915aaeb4a228_88830_2879x0_resize_box_3.png)
![Launch instance button to create our EC2 virtual machine](https://reflectoring.io/images/posts/cicd-aws-nodejs/ec2-instance-launch_huc0aa3fe8e2f01c444ca0c1f2cc03e732_124770_2880x0_resize_box_3.png)

#### 1.3 Set up a security group for our instance

![security group](https://reflectoring.io/images/posts/cicd-aws-nodejs/security-group_hu840c57a72f40532a659da9beb8b2d6bf_113920_2880x0_resize_box_3.png)
![security group](https://reflectoring.io/images/posts/cicd-aws-nodejs/security-group2_hu76d9b2a49ca75d9f6738f6276cad7a45_108760_2880x0_resize_box_3.png)
![security group](https://reflectoring.io/images/posts/cicd-aws-nodejs/security-group3_hufd696b0f27af144c338b2b63edbd2179_64719_2880x0_resize_box_3.png)

### 2. Create a Node.Js Github Actions Workflow

To set up a workflow for our Node.js application, follow these steps: - Access the GitHub repository where the Node.js application resides. - In the repository, navigate to the Actions tab. - Search
for node.js action workflow. - Click on the Configure button.

![security group](https://reflectoring.io/images/posts/cicd-aws-nodejs/github-action_hu3c2958a6e88541e6c655661121217bb2_117757_2880x0_resize_box_3.png)

This will generate a .github/workflows directory to store all our application’s workflows. It will also create a .yml file within this directory where we can define our specific workflow
configurations.

Replace the generated .yml file content with the commands below:

```sh
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

name: Node.js CI

on:
  push:
    branches: [ "main" ]

jobs:
  build:

    runs-on: self-hosted

    strategy:
      matrix:
        node-version: [18.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    #- run: npm run build --if-present
    #- run: npm test
    - run: |
       touch .env
       echo "${{ secrets.PRO_ENV }}" > .env
    - run: pm2 restart backendserver
```

In the YAML file above:

Our workflow is named “Node.js CI/CD”. It triggers when there is a push event to the main branch. The build job is defined to run on a self-hosted runner. A self-hosted runner is a computing
environment that allows us to run GitHub Actions workflows on our own infrastructure instead of using GitHub’s shared runners. With a self-hosted runner, we have more control over the environment in
which our workflows are executed. The steps section lists individual tasks to be executed in sequence. actions/checkout@v3 fetches the source code of our repository into the runner environment.
actions/setup-node@v3 simplifies Node.js setup on the runner environment for our workflow. npm ci installs project dependencies. This command performs a clean installation, ensuring consistency for
our CI server. npm test runs tests for our application. pm2 restart backendserver restarts our server using the PM2 library, which acts as a production process manager. PM2 ensures our Express
application runs as a background service and automatically restarts in case of failures or crashes. The above workflow performs both Continuous Integration (CI) tasks (clean installation, caching,
building, testing) and Continuous Deployment (CD) tasks (restarting the server using PM2).

Now, Click the Commit changes button. This will save the modified YAML file to our repository.

Next, return back to the Actions tab on GitHub. Here, we can monitor the workflow in real time and observe logs as each step is been executed on the server.

However, it’s important to note that the above workflow job will fail because we haven’t connected our AWS EC2 instance to the Git repository.

To use our GitHub Actions workflow with an AWS EC2 instance, we must establish a connection between the GitHub repository and the AWS EC2 instance. This connection can be achieved by setting up Git
Action Runner on the AWS EC2 instance. This Runner acts as a link between the repository and the instance, enabling direct workflow execution.

To resolve the failed workflow, we’ll connect to our EC2 instance via SSH, locally download and configure the Git Action Runner, and then set up our Node.js application environment on the EC2
instance.

### 3. Create GitHub Secrets for managing environment variables

![Create GitHub Secrets for managing environment variables](https://snyk.io/_next/image/?url=https%3A%2F%2Fres.cloudinary.com%2Fsnyk%2Fimage%2Fupload%2Fv1671633572%2Fwordpress-sync%2Fblog-github-actions-env-var-new-secret.jpg&w=1240&q=75)

### 4. Download and Configure Git Action Runner

![New self-hosted runner button](https://reflectoring.io/images/posts/cicd-aws-nodejs/git-action-runner_hu5056eabdb02d8a662b2254017c7d300b_71719_2880x0_resize_box_3.png)

![Configure Git Action Runner](https://reflectoring.io/images/posts/cicd-aws-nodejs/git-action-runner2_huad66a7d299f2243c37e38014671e1a95_100464_2880x0_resize_box_3.png)

Note: While running the command, it may prompt some setup questions, we can simply press Enter to skip to the default options.

After running the ./run.sh command, If the agent returns a ✅ Connected to GitHub message, it indicates a successful installation.

Next, we’ll install a service to run our runner agent in the background:

```sh
sudo ./svc.sh install
sudo ./svc.sh start
```

#### 5. Setting up a Node.Js Application Environment on an AWS EC2 Instance

We have successfully integrated our application on GitHub with the EC2 instance server using GitHub Actions Runner.

To ensure the smooth execution and operation of our Node.js application on the EC2 machine, we need to install essential libraries and dependencies for our application such as Node.js, NPM, and PM2.

To install NPM and Node.js, run the following command in the local SSH terminal:

```sh
sudo apt update
curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

To install PM2, run the following command:

```sh
sudo npm install -g pm2
```

#### 3.2 Install pm2

```sh
sudo npm i -g pm2
```

#### 6. Starting the app with pm2 (Run nodejs in background and when server restart)

To start our application’s server, we need to navigate into the application’s folder in the EC2 instance.

To do this run the following command on the local SSH terminal

```sh
cd ~
cd /home/ubuntu/actions-runner/_work/{{repos-name}}/{{repos-name}}
```

Once we are inside the application’s folder, we can start the server in the background using pm2:

```sh
pm2 start src/index.js --name=backendserver
```

Using pm2 to start the server with a specified --name enables our Node.js server to be managed as a background service. This means our server will continue running even after we exit the SSH session.
Additionally, pm2 provides continuous monitoring and ensures our application remains active and responsive at all times. This is very handy in production environments where we want our program to be
available at all times.

Our Node.js application is now successfully up and running on the EC2 instance, and our CI/CD workflow has been configured.

The application will now be running and listening on the specified port 3000.

To ensure that the server is functioning correctly, we can easily check it through a web browser. Simply enter the server’s URL or IP address followed by the specified port.

For example, if our server’s IP address is 34.227.158.102, we would enter 34.227.158.102:3000 in the browser’s address bar.

If all configurations are correct, we’ll be greeted with the Products Page version 1.0 of our demo application.

Finally, we can proceed to test our CI/CD pipeline process. We will create an event that will act as a trigger to initiate a new workflow.

## Support 🙏😃

If you Like the tutorial and you want to support my channel so I will keep releasing amzing content that will turn you to a desirable Developer with Amazing Cloud skills... I will realy appricite if
you:

1.  Subscribe to My youtube channel and leave a comment: http://www.youtube.com/@VinPro24
2.  Buy me A coffee ❤️ : https://www.buymeacoffee.com/vinpro24

Thanks for your support :)

<a href="https://www.buymeacoffee.com/vinpro24"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=vinpro24&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>
