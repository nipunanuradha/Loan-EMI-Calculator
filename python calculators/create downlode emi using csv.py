import csv 
def loan_schedule_with_save():
    print("--- Save to CSV ---")

    try:
        # imput data
        principal = float(input("Principal: "))
        annual_rate = float(input("Annual interest rate (%): "))
        years = float(input("Loan period (years): "))
        
        # save folder name or used 'loan_schedule.csv' name
        filename = input("Save name (ex: my_loan): ")
        if not filename.endswith(".csv"):
            filename += ".csv"

        # calculate EMI
        r = annual_rate / (12 * 100)
        n = years * 12
        emi = (principal * r * ((1 + r) ** n)) / (((1 + r) ** n) - 1)

        print("-" * 50)
        print(f"monthly EMI: $. {emi:,.2f}")
        print(f"data '{filename}' start read file...")
        print("-" * 50)

        # open folder (Write Mode 'w')
        with open(filename, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)

            # tabele Headers
            writer.writerow(["month", "interest (Interest)", "principal (Principal)", "balance (Balance)"])

            remaining_balance = principal

            # loop through each month and calculate data
            for month in range(1, int(n) + 1):
                interest_payment = remaining_balance * r
                principal_payment = emi - interest_payment
                remaining_balance = remaining_balance - principal_payment

                if remaining_balance < 0:
                    remaining_balance = 0

                # calculate and write each row to CSV
                writer.writerow([
                    month, 
                    round(interest_payment, 2), 
                    round(principal_payment, 2), 
                    round(remaining_balance, 2)
                ])

        print(f"scsesfull! '{filename}'saved file.")
        print("you can open it using excel.")

    except ZeroDivisionError:
        print("error:incoorrect interest rate.")
    except ValueError:
        print("error: please enter valid numbers.")
    except Exception as e:
        print(f"Error saving file: {e}")

# run the function
loan_schedule_with_save()