
# SnackSelector
An elementary website using Nodejs, Express, Bootstrap, and SocketIO.

![Image of Main page](/screenshots/mainpage.PNG)

## Todo
+ sort snacklist by alphabetical order
+ add filtering options for snacklist
+ add option to suggest a snack not on the snacklist
+ add link to nutritional data on results page, snacklist
+ add more snacks to the database, perhaps change to an SQL database

## Site Layout and Features
#### Survey
The survey poses the users three basic questions and a "check all" question that helps the site identify the user's snack preferences.

![Image of Survey Page](/screenshots/survey3.png)
One of three basic questions: Calorie, Flavor, Texture

![Image of Final Check All](/screenshots/survey4.PNG)
Final question for specific preferences.

Each response is sent to the server using the websocket created by SocketIO (node package).  After completing the survey, the server goes through each of the prefences and score the database of snacks based on matching attributes.  It then totals up those scores and sends a list of the top five matches to the client, which are presented on the page (same page).

The website quickly describes each snack, detailing its type and a link to purchase the recommended snacks on Amazon.
![Image of Final Check All](/screenshots/surveyresult.PNG)
The top and second best recommendations based on this user's survey responses.


#### Snacklist
Users are also able to view the full list of snacks by clicking on the snacklist button in the navbar, which will then present all the snacks on a scrollable page.  This page will hopefully receive some updates in the near future.

![Image of Final Check All](/screenshots/snacklist.PNG)
A partial view of the snacklist page.
