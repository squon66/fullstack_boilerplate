# Solution

By Peter Richter/petey.richter@gmail.com

## Notes on implementation

Hello.

I attempted to implement the first 3 stories.  I added some placeholder code for some of the server logic that isn't fully functional but is there for illustration purposes

I know there are some logical things wrong with state, particularly on test retake but didn't have time to address.


I did not get to the AI part nor a results page


DB NOTES

- since we most likely will have users that might log in to different devices, ideally we would save users state to a db instead to just localstorage

- being such a small scale project, sqllite seems adequate for our purposes over more robust dbs like postgres or mysql.  Not sure of the volume of users where concurrency might be an issue. I have did have and issue with returning nested answers in an object format so had to parse as json string.

- didn't like the fact that answers were in a delimited format.  To prone to error and more challeging to track answer state

- I thought that perhaps a more intuitive schema would be to intead of including quizId with each question in quiz_questions table, we could have the quizzes table include an array of question ids associated with that quiz.  That way you can user certain questions on multiple quizzes.  I did not implement this.

- Perhaps a csv file would be better to separate data from schema logic

SERVER NOTES

-I'm used to working with NextJS but obviously that is overkill for this small project and server side rendering doesn't seem critical.

- For caching I choose to user localStorage as opposed to a server memory cache which would still take a server hit.  Although still could be advantageous. Perhaps using an indexDB wold be better given the formatting challenges I had with localStorage

- I tried sharing types on the server with a shared folder but couldn't get it to work.

FRONTEND NOTES

- Would have liked to be able to more granularly define components but didn't have the time.

- I never got around to AI question story.  If I did, that would have required a different type of questio so adding questionType to the schema might be appropriate

- I have logic for saving/retrieving cached data in localStorage but it's commented out.

- I decided to cache the quiz data in localStorage to avoid hitting the server everytime.  Given it's not that big of a payload, perhaps that was overkill.  

- a data store like redux seems overkill so just used context

- I chose localStorage over Cookies because it can hold more data.  I would need to add some kind of expiry logic so data didn't stick around too long and force a refresh.

- I attempted to save quiz data and status for multiple quizzes which seemed necessary and allows more "quiz status" UI.

- Edge cases
    - There's a chance that a user goes directly to quiz page before root page so perhaps better to get quiz data on app load instead on root page so it's availabel everywhere


## (If you didn't go with the boilerplate) Notes on design/architecture and rationale
_Please leave notes for what languages / frameworks you chose, and why._
_Please leave instructions for how to run your solution locally._

## Feedback for Stepful
_Please feel free to share feedback with us! What you liked or didn't like, how this takehome compares to others you've taken in the past_

## Anything else you'd like us to know?
Not required, but we love learning about what you're passionate about, so if you link us a personal blog or website, or anything else that you've written, we'd love to check them out!
