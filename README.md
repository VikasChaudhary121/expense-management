# expense-management

This project is a web application for recording and managing daily expenses. It includes features for adding, viewing, and exporting expenses to a balance sheet.

## Features

- Add new expenses with details such as description, amount, payer, participants, and split method.
- View all expenses.
- Download a balance sheet as a CSV file.
- Authentication and authorisation

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- express-validator
- json2csv

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm.\

## Setup Instructions

1. **Clone the repository:**

   git clone https://github.com/VikasChaudhary121/expense-management.git

2. Navigate to the project directory:

   cd daily-expense-record

3. Install dependencies:

   npm install

4. Set up environment variables:

   MONGO_URI="mongodb+srv://vikas121:vikas121@cluster0.tqka9hw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
   PORT = "3000"
   JWT_SECRET = "Vikas@12100"

5. start server:

   npm start
