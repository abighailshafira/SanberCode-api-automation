# SanberCode-api-automation
This repository is part of Sanbercode QA Automation Bootcamp assignment, that contains API automation script for testing ["Kasir Aja" API](https://kasir-api.belajarqa.com) using Supertest, Mocha, and Chai. The script cover Authentication and CRUD operations scenarios, including both positive and negative test cases. The test result are generated using Mochawesome report for clear and detailed reporting.

## Libraries
- **Supertest**: Library that provides high-level abstraction for testing API endpoint response.
- **Mocha**: JavaScript testing framework that makes asynchronous testing simple.
- **Chai**: Assertion library for Node.js that can be paired with any JavaScript testing framework.

## Prerequisites
To run this program, Node.js must be installed. Download it from [here](https://nodejs.org/).

## Getting Started
Clone the repository
```
git clone https://github.com/abighailshafira/SanberCode-api-automation.git
```
Navigate to the project directory
```
cd sanbercode-api-automation
```
Install dependencies
```
npm install
```
Run mocha test
```
npx mocha test.js
```

## Test Report

Run mocha test with Mochawesome reporter
```
npx mocha --reporter mochawesome test.js
```
Navigate to Mochawesome report directory
```
cd mochawesome-report
```
Launch the HTML report in web browser
```
start mochawesome.html
```

## Result
View the test result [here](https://drive.google.com/drive/folders/1P5y5qKMgdMYMZJO63W7UTc1OkAvPnTTB?usp=sharing).
