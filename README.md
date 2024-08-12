# Jobmatch

Jobmatch is an innovative application built using the Gemini API to enhance the job application process by matching your resume to job descriptions. As a recent graduate, I wanted to streamline the job application process, which led to the development of this application.

## Key Features

- **Preloaded Questions**: Easily preload questions you want to address by adding them to the questions tab.
- **Comprehensive Answers**: Each question runs individually, printing all answers at once without limiting the length.
- **Improved User Interface**: A more intuitive and user-friendly design.
- **Preset Questions**: Includes features like calculating the percentage of resume match with job descriptions and identifying missing skill sets.

## Problems Addressed

1. **Tedious Repetition**: Avoid the need to copy and paste each question repeatedly.
2. **Answer Length Limitations**: Overcome restrictions on answer lengths imposed by some platforms.
3. **Readability Issues**: Enhance readability on the Gemini platform.

### Backend

The backend of this application is built using Flask and must run in parallel with the Angular frontend.

- The `backend.py` file contains the Flask backend code, which needs to run alongside the Angular application.
- Install any necessary dependencies using the `pip` command.
- Check the port number on which Flask is running and modify the service configuration files in the Angular application accordingly.
- To run the GEMINI model, you need access to an API key, which can be obtained by registering for the Google Developer Program.
- Once you receive the API key, set it as an environment variable using the following command:
  ```bash
  export GOOGLE_API_KEY="yourapikey"


## MongoDB database
- You need to create a collection and a database on mongodb atlas and provide your credentials in line 104 of backend.py file
- atlas_uri = "mongodb+srv://username:password@cluster0.aptdng7.mongodb.net/?retryWrites=true&w=majority&ssl_ca_certs=/path/to/cafile.pem"
  
## Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.9.

### Development Server

To start the development server, run:

ng serve

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
