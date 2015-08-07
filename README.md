# README

## Contents

* **Guess the Movie version 1.0 6/7/15 by Valeria Graffeo**

- This is a single page application.
- The goal is to guess the movie title for movie quotes.
- The app is visible at [http://tuskerette.github.io/MovieQuotesFrontEnd/](http://tuskerette.github.io/MovieQuotesFrontEnd/).
- This is the README file for the front end application. The API is hosted on HEROKU at this address: https://ancient-fortress-5331.herokuapp.com/

* **Overview and Example usage**

- There are two fictional players to choose from.
- Anyone visiting the website can add and delete a movie quote to and from the database, but only players can score points if their guess is correct.
- When a guess matches the title entered originally, the player gets a point and the quote does not accept further guesses (status SOLVED.)

* **Getting started**

- Installation & prerequisites: no installation necessary. Requisites: an internet connection and a browser (Google Chrome preferred.)

* **Detailed Usage and Developer Info**

- The app is linked to the js/app.js file.
- It was built with Bootstrap 3.3.4.
- Limitations and known issues: when reloading the page, the previously solved quotes are open again.
The guess field does not clear after the submission of a guess. The buttons change status in the view when the "reset points" action is called.
- Further development: add authentication for the users. Add Handlebars to managethe dynamic content. Better string interpolation to match the guess to the title and avoid dupicates or blank fileds. Fix the responsive part for mobile view.

* **Colophon**

- This app was developed by Valeria Graffeo as second project assignment in the Web Develoment Immersive Course at General Assembly Boston in June 2015.
- Skrollr by Pinzhorn: https://github.com/Prinzhorn/skrollr


