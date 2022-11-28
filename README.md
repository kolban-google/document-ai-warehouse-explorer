# Document AI Warehouse Explorer
Document AI Warehouse is an offering from Google Cloud that provides document storage, search and a rich array of other services.  The product provides APIs for ingesting documents, creating schemas, searching and more.  While Google provides a first class user interface, it is also possible for enterprises to build their own custom interaction applications.  Following that notion, I wanted to see what would be involved in building such an interface.  The results are contained in this repository.

The user interface technology used here is [REACT](https://reactjs.org/) with the [Material UI](https://mui.com/) set of components.

This project is very much a *work in progress* and isn't yet considered complete.  My own UI design skills are not great and I'm still learning REACT and MUI.  From a function perspective, there is still much that can be added and I look forward to hearing from you on what you like to see added/tweaked.

If you are a developer and are working with Document AI Warehouse, here are some possible reasons you might want to give this project a spin:

* There is a UI for building schemas that includes building properties.  In the current Google UI, one must supply JSON to describe the details of the schema and that is error prone.  The UI in this tool provides clear guidance.
* When creating a document, we can supply direct plain text that is useful for testing.
* When querying documents, there are a variety of options that can be supplied.  At the API level, these can be quite complex.  The project provides a UI for building a search query.
* Most of the parameters (input and output) can be viewed in a JSON dialog and optionally copied to your clipboard.  This means that you can use this tool during development to examine the underlying document and schema data as well as build requests using the UIs.
* Because REACT is UI component driven, one can lift some of the components in this project and leverage in your own UIs.

## Running the project
The project is hosted in Github.  As part of Github, there is a concept called [Github Pages](https://pages.github.com/).  This is the ability to host your own web pages that are served from Github itself.  This project leverages that notion so you can run a build of this project without having to install anything locally.  Simply visit:

https://kolban-google.github.io/document-ai-warehouse-explorer/

... and you should be running.

## Setup for usage
Once the project is launched, you must perform a one-time setup.  Click the settings icon (hamburger button in the menu bar) and you will be prompted for three inputs:

* Client ID - The OAuth2 client ID you created (See below).
* Project ID - The Project ID that you will authenticate against.
* Project Number - The Project Number that is hosting Document AI Warehouse.
* User - The user name (email address) that is used for Document AI Warehouse ACL security.

Once entered, these are saved in the local storage of your browser and will be remembered.

Next, click the `Sign-In` button found on the top menu.  Select a Google Account that has been given the IAM role called:

`Content Warehouse Admin`

You are now ready to play.  You can view documents, schemas, rules.  For documents you can see their details, build queries, run searches and create new ones.  Similar for schemas.

## OAuth2 configuration
Since this application is not a *production* application, you need to create some credentials for OAuth2 configuration.

1. Select your project GCP Console in which you have deployed your Document AI Warehouse
2. Using the hamburger menu, visit APIs & Services > OAuth consent screen
3. Define an Internal application using your own email for owner and developer
4. Using the hamburger menu, visit APIs & Services > Credentials
5. Click `+ CREATE CREDENTIALS`
6. Select OAuth client ID
7. Under application type, select `Web Application`
8. Give the app a name
9. Under `Authorized Javascript origins` click `+ ADD URI` and enter `https://kolban-google.github.io` for the allowed URI
10.Click `SAVE` 

And now you should be able to visit:

https://kolban-google.github.io/document-ai-warehouse-explorer/

and define settings (including the Client ID just created).
