def calculate_emi_with_schedule():
    print("--- Loan EMI Calculator with Amortization Schedule ---")
try: 
    #input data
    principal = float(input("Principal Amount: "))
    anual_rate = float(input("Annual Interest Rate %: "))
    years = float(input("Tenure in Years: "))

    #bacic formula for EMI calculation
    r = anual_rate / (12 * 100) # monthly interest rate
    n = years * 12 # total number of monthly payments
    # Emi calculation formula
    emi = (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1)

    print("-" * 65)
    print(f"EMI: $. {emi:.2f}")
    print("_" * 65)

    #Amortization Schedule)
    print("\n--- pay time ---")
    print(f"{'month':<10} | {'principal':<15} | {'interest':<15} | {'remaining balance':<15}")
    print("-" * 65)

    remaining_balance = principal
    # run loop for each month
    for month in range(1, int(n) + 1):
    # this month interest payment
                interest_payment = remaining_balance * r
                
    # this month principal payment
                principal_payment = emi - interest_payment
                
    # new remaining balance
                remaining_balance = remaining_balance - principal_payment
    # final month adjustment (Optional fix)
                if remaining_balance < 0:
                    remaining_balance = 0
    # print data row
                print(f"{month:<10} | {interest_payment:<15,.2f} | {principal_payment:<15,.2f} | {remaining_balance:<15,.2f}")

    print("-" * 65)

except ZeroDivisionError:
    print("error: Interest rate cannot be zero.")
except ValueError:
    print("error: Please enter valid numbers.")

# running the function
calculate_emi_with_schedule()   