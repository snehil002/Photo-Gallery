# Photo Gallery
~ By Snehil Kumar  

> See ss/ folder for a screenshot  

## About this app:
Photo Gallery is a web app where we can write  
something, upload photos and view and delete  
them online.  

They can be thought of as a social media post.  

Hosted on Github and completely a front end static  
app.  
Images and data are stored on Firebase.  

This is not a Course or a Team project. This is  
an Individual Project.  

## How this App works
This is a static front end only web app, that  
uses Firebase (Backend as a Service) for the  
backend.  

The Client side is connected with Firebase using the  
Firebase API keys and libraries.

There are 2 portals on this App.
They are - Upload and Gallery.  

In the Upload area, we can write our names, give the  
post a description and upload photos.  
After pressing the Submit button, the images are sent  
to Firebase Storage and Database API.

In the Gallery area, we press the refresh button and  
see the posts that were created and the images in  
them.  
Hence, I call it the Photo Gallery.  

## Challenges and Solutions
PROBLEM:

The images need to be stored on a Data Storage  
solution and the text can be stored on a Database.  

SOLUTION:

I did not know about these, hence I had to read  
documentations to understand these.

PROBLEM:

Another thing was that, there were many posts  
once uploaded.  
When they were viewed in the Gallery, they all  
appeared at the same time.  
But, I did not like the way it looked.  
I thought, only a few posts should be displayed at  
a time.  

SOLUTION:

Hence, I used a strategy called Pagination.  
When the Posts were displayed, I downloaded all of  
them at once.  
However, I only displayed a few of them by iterating  
over all of them and stopping after a specific number.  
This number is the number of Posts per page.

However, this is not so efficient.  
I will try to make it more efficient in the Future if  
I get time.

## App is Live!
https://snehil002.github.io/Photo-Gallery  

## Skills used:
HTML, CSS, JS, Firebase  