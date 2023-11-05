# atm-machine ATM Machine JavaScript
My special “ATM Machine” which accepts any required amount and returns an optimized response.

# ATM Machine JavaScript

My special “ATM Machine” which accepts any required amount and returns an optimized response.

### Table of Contents
1. [Prerequisites](#prerequisites)
2. [Steps](#steps)
    1. [Clone the Repository](#clone-the-repository)
    2. [Navigate to the Project Directory](#navigate-to-the-project-directory)
    3. [Install Dependencies](#install-dependencies)
    4. [Run the ATM Machine App](#run-the-atm-machine-app)
3. [ATM Machine Menu](#atm-machine-menu)
4. [API Description](#api-description)
    1. [Withdrawal Request](#withdrawal-request)
    2. [Add Different Currency to ATM's Inventory](#add-different-currency-to-atms-inventory)


### Prerequisites:

1. **Node.js and npm**: Make sure you have Node.js and npm (Node Package Manager) installed on your Mac. You can download and install them from [Node.js official website](https://nodejs.org/).

### Steps:

1. **Clone the Repository**:
   Open Terminal on your Mac and navigate to the directory where you want to store the ATM machine app. Then, run the following command to clone the repository:

   ```
   git clone https://github.com/Yaarash/atm-machine.git
   ```

2. **Navigate to the Project Directory**:
   Use the `cd` command to navigate to the cloned repository's directory:

   ```
   cd atm-machine
   ```

3. **Install Dependencies**:
   Inside the project directory, you'll find a `package.json` file. Run the following command to install the project dependencies using npm:

   ```
   npm install
   ```

4. **Run the ATM Machine App**:
   Once the dependencies are installed, you can start the ATM machine app using the following command:

   ```
   npm start
   ```

   This command will run the start script defined in the `package.json` file. The app should now be running, and you can access it through a web browser by visiting `http://localhost:3000` or a similar address specified in the project's configuration.

## ATM Machine Menu

The ATM machine app provides the following options:

1. **Withdraw Money**: Enables users to withdraw money from their account.
2. **Deposit Money**: Allows admin to deposit money into the atm.

This is an API based ATM returns an optimized response (Returning biggest bills or biggest coins it got) 
based on the current money that exists in the ATM.

### Usage

## API Description:
#### Withdrawal Request

Withdrawal request should use POST `/atm/withdrawal` with the following JSON body:

```json
{
  "currency": "ILS",
  "amount": 837.44
}
```

#### Add Different Currency to ATM's Inventory

To add different currency to the ATM's inventory, use POST /admin/currency with the following JSON body: 
```json
{
  "currency": "USD",
  "currency_map": {
    "5": { "type": "coin", "amount": 1 },
    "10": { "type": "coin", "amount": 1 },
    "20": { "type": "bill", "amount": 1 },
    "100": { "type": "bill", "amount": 4 },
    "200": { "type": "bill", "amount": 7 },
    "0.1": { "type": "coin", "amount": 12 },
    "0.01": { "type": "coin", "amount": 21 }
  }
}
```
Make sure to include the appropriate currency code and amounts in the JSON request body when making API calls.

