# EMI Calculator

A modern, responsive Loan EMI Calculator built with React and Tailwind CSS.

## Features
- Calculate monthly EMI payments
- View total interest and total amount payable
- Clean and intuitive user interface
- Input validation
- Sample test cases included

## Installation

1. Clone or download this project
2. Open terminal in project folder
3. Run: `npm install`
4. Run: `npm install -D tailwindcss`
5. Run: `npx tailwindcss init`

## Running the Application
```bash
npm start
```

The application will open at `http://localhost:3000` or `http://localhost:3001`

## Building for Production
```bash
npm run build
```

## Formula Used

EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]

Where:
- P = Principal loan amount
- R = Monthly interest rate (Annual rate / 12 / 100)
- N = Loan tenure in months

## Technologies Used
- React 18
- Tailwind CSS
- Lucide React (Icons)
- JavaScript (ES6+)