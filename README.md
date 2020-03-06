# SoStatic.xyz

[![SoStatic](https://app.sostatic.xyz/GithubPreview.png "SoStatic")](https://app.sostatic.xyz "SoStatic")
# About

SoStatic is a form processing backend meant for static websites, like the ones hosted with github pages, google's firebase, netlify etc.
I created it because while managing some static websites for multiple clients, with no backend at all, the need for a contact forms that would email the clients arised.
At the time - 2016/2017 there were no services for such a basic task, especially not for clients that wanted near 0 hosting cost.

# History
SoStatic evolved with my skills.

#### v0.1 Serverless Function 

My first aproach was a serverless function, I decided to go with Firebase Functions, since all websites I was building were hosted on with Firebase Hosting (Free).
It was a single function, that on a POST request would send a response imediately, and then proceed to process the message and email it as a json string (Horrible I know), with the keys being the name of the form input, and the value well... the value.

It worked great, I didn't have to manage any backend, for the low volume of requests, the free tier offered by firebase was enough, I could just have the firebase function code in the client's repo as a git submodule. 

At that time I wanted to become better at web development, and more and more things had to be tailored to each client besides the target email, such as recaptcha validation, multiple forms for a single website, multiple target emails etc. So I decided to write an admin panel to configure these parameters. I knew it was overkill to do so, but It was a simple enough project that I could use as practice for new technologies that I wanted to learn.

#### v0.2 Classic frontend (HTMl,CSS,JS+jQuery) with Firebase Functions, Hosting, Database and Authentication

What functions would the admin panel provide to the users:
* Create an account
* Add multiple websites to their account
* Configure whether requests with different origin than their websites should be dropped
* Add a recaptcha site-key and and secret-key to do server side checking of the recaptcha
* Configure to what emails to forward the message

At that point, I didnt want to use a pre-made admin panel template, instead I wanted to use a CSS framework to ensure consistency. I decided to go with Materialize.css
Also I still was not willing to write and maintain my own server, so I went ahead with a serverless architecture, built on firebase's offerings:
* Firebase Authentication allows me to seamlessly and transparently integrate new authentication providers.
* Cloud functions still provided the endpoint for all form submissions, but now with a wildcard path ex: https://sostatic.xyz/e/:formUUID
* Firebase's real time database for storing all user information and configurations
Using firebase also came with HTTPS certification by default. 

Even with this relatively small number of functions, it was very cumbersome to manipulate the DOM in order to do what I needed using the classic method with jQuery.
I ended up writing my own small two way data binding library, but there was still too much boilerplate code. Even so I managed to implement all the features that I wanted and released an MVP version of SoStatic and migrated all my client's websites. 

If for some reason you want to torture yourself by checking the code at that moment, I archived the repo at the MVP stage at https://github.com/ColinearProductions/SoStatic

At this time I started looking into the "new" javascript frameworks, At the moment 

#### v0.3 SPA Vue + Vuetify, same serverless backend
#### v0.4 SPA Vue+Vuex+Vuetify, NodeJS + Mongo & Mongoose backend
#### v0.5 Static landing page for SEO
#### Future - migrate to NuxtJs 