def calculate_emi():
    print("--- Loan EMI Calculator ---")

    try:
        # 1. User Inputs 
        principal = float(input("Principal Amount: "))
        annual_rate = float(input("Annual Interest Rate %: "))
        years = float(input("Tenure in Years: "))

        # 2. Data Conversion 
        r = annual_rate / (12 * 100)

        # converting years to months
        n = years * 12

        # 3. Applying the Formula
        # EMI = (P * R * (1+R)^N) / ((1+R)^N - 1)
        
        numerator = principal * r * ((1 + r) ** n)
        denominator = ((1 + r) ** n) - 1
        
        emi = numerator / denominator

        # 4. Output Display 
        print("-" * 30)
        print(f"EMI: $. {emi:.2f}")
        print(f"month: {int(n)}")
        print("-" * 30)

    except ZeroDivisionError:
        print("Error: Interest rate cannot be zero.")
    except ValueError:
        print("Error: Please enter valid numbers only.")

# Running the function
calculate_emi()