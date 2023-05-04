# GameLib

![Image 1](/screenshots/gamelib.png?raw=true "gamelib1")
![Image 2](/screenshots/gamelib2.png?raw=true "gamelib2")

View This Project [Live](http://18.169.51.114:8080)
View This Project In [GitHub](https://github.com/DomDevs2000/GameLib)

## What is this project?

In this project, I created a video game library in which users can search for their favourite games, developers, genres
or platforms.

## Why I made this project

I created this site using Vanilla Javascript and standard CSS. Pug(formerly known as Jade) was used as the template
engine that was
being served from the back end, which itself was created with Node & Express. The app fetches data from a 3rd-party API
called [RAWG](https://rawg.io/apidocs). Once the data has been fetched, I used pug templates to render the data
in the DOM.

As I am currently learning multiple AWS services such as EC2, ECS, API Gateway and S3, i decided to create a hands-on
project where I would deploy this site to an EC2 instance.

I decided to use [Pulumi](https://www.pulumi.com/) as I wanted to create an EC2 instance but wanted to use IaC instead
of manually creating an
instance inside the AWS console. I decided to use Pulumi as I had already used Terraform in a previous project as IaC
to create an S3 bucket to store a static react app. Pulumi was great to use and different to Terraform as Pulumi is
written using the programming language of your choice. As this was a vanilla Javascript project, I wrote the pulumi code
in Javascript as well, but Pulumi allows the choice of multiple languages such as Typescript, Python and Go to name a
few. Once the instance was created I SSH'd into the instance and downloaded necessary packages such as Node and Git. I
cloned this projects' repository, created a BASH script to run the app's server with the correct environment variables and created a
systemd service so that the run command would always work even when I was no longer connected to the EC2 instance.

### To do for the future / work in progress

In the future i would like users to be able to create an account and add games to their wishlist and mark each game as
"Currently playing", "Played" or "Want to play".
