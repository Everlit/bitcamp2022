# bitcamp2022

My project that I made for bitcamp 2022.
I didn't submit it in time, but I would still like to post it here :)


# What is it?
Basically, it stores your friend's names, numbers, birthdays, and a message that you would like to send them on their birthday.

Whenever you load the page, it tells you if anyone's birthday is today (it was made in a rush, so it's hardcoded to EST timezone for now).
You then type in the passcode to send messages to your friends.


# Environment variables
This project requires some environment variables to be set. To keep your tokens and secrets secure, make sure to not commit the .env file in git. When setting up the project with twilio serverless:init ... the Twilio CLI will create a .gitignore file that excludes .env from the version history.

In your .env file, set the following values:

TWILIO_PHONE_NUMBER -- The Twilio phone number to broadcast your messages from.
PASSCODE	-- A passcode to avoid anyone sending text message

# Setup
In the main directory do:
1. Install the Twilio CLI: https://www.twilio.com/docs/twilio-cli/quickstart#install-twilio-cli
2. Install the serverless toolkit: https://www.twilio.com/docs/labs/serverless-toolkit/getting-started

# Deploy:
Either start the server with:
twilio serverless:start

OR start the server with: 
twilio serverless:deploy
