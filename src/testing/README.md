# How to handle the Cypress tests

Cypress is a JavaScript End to End Testing Framework to automate webapplication testing. 

## Installation / prerequisites

use the node package manager (npm) to install Cypress. Cypress recommends to install itself locally as a dev dependency for the project. 
Therefore, use the command

npm install cypress --save-dev

to install Cypress.

Once Cypress is installed there will be a folder 'examples'. You can delete all files in there and copy the files from the 'testing' folder to see them in the Cypree aplication later. 

Please also replace the 'cypress.json' file. The file contains the screen settings of the testing brwoser.   

## run Cypress

to start the test-overview, run 

npx cypress open

to run Cypress. You can choose the different testscripts in the overview which will open.

## run testscripts

the testscripts will show up. Select one as well as the browser (in the top of the file-picker; all files were tested on Chrome 91)

## more

see [Cypress.io](https://www.cypress.io)
