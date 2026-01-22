import tkinter as tk
from tkinter import messagebox, filedialog
import csv

def get_inputs():
    """check and get user inputs from the GUI."""
    try:
        p = float(entry_principal.get())
        r_annual = float(entry_rate.get())
        y = float(entry_years.get())
        return p, r_annual, y
    except ValueError:
        return None

def calculate_emi_action():
    """Show EMI calculation result in the GUI."""
    data = get_inputs()
    
    if data:
        principal, annual_rate, years = data
        
        # calculate EMI
        r = annual_rate / (12 * 100)
        n = years * 12
        
        try:
            emi = (principal * r * ((1 + r) ** n)) / (((1 + r) ** n) - 1)
            # Show result in the label
            lbl_result.config(text=f"Monthly rent (EMI): $. {emi:,.2f}", fg="blue")
        except ZeroDivisionError:
             messagebox.showerror("Error", "Interest rate cannot be 0.")
    else:
        messagebox.showerror("Error", "Please enter valid numbers.")

def save_schedule_action():
    """Save loan schedule to a CSV file."""
    data = get_inputs()
    
    if data:
        principal, annual_rate, years = data
        r = annual_rate / (12 * 100)
        n = years * 12
        emi = (principal * r * ((1 + r) ** n)) / (((1 + r) ** n) - 1)
        
        # Save File Dialog
        file_path = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV Files", "*.csv")],
            title="Save Loan Schedule"
        )
        
        if file_path:
            try:
                with open(file_path, mode='w', newline='', encoding='utf-8') as file:
                    writer = csv.writer(file)
                    writer.writerow(["month", "interest", "principal", "balance"])
                    
                    remaining_balance = principal
                    for month in range(1, int(n) + 1):
                        interest_payment = remaining_balance * r
                        principal_payment = emi - interest_payment
                        remaining_balance = remaining_balance - principal_payment
                        
                        if remaining_balance < 0: remaining_balance = 0
                        
                        writer.writerow([month, round(interest_payment, 2), 
                                         round(principal_payment, 2), round(remaining_balance, 2)])
                
                messagebox.showinfo("Success", "saved pament successfully!")
                
            except Exception as e:
                messagebox.showerror("Error", f"can't save: {e}")

# create GUI window

window = tk.Tk()
window.title("Loan EMI Calculator")
window.geometry("400x350")  # window size
window.config(padx=20, pady=20)

# Principal
tk.Label(window, text="Principal:").grid(row=0, column=0, sticky="w", pady=5)
entry_principal = tk.Entry(window)
entry_principal.grid(row=0, column=1, pady=5)

# 2. interest Rate
tk.Label(window, text="Annual interest rate (%):").grid(row=1, column=0, sticky="w", pady=5)
entry_rate = tk.Entry(window)
entry_rate.grid(row=1, column=1, pady=5)

# 3. Years
tk.Label(window, text="Years:").grid(row=2, column=0, sticky="w", pady=5)
entry_years = tk.Entry(window)
entry_years.grid(row=2, column=1, pady=5)

# 4. Calculate Buttton
btn_calc = tk.Button(window, text="Calculate EMI", command=calculate_emi_action, bg="#4CAF50", fg="white")
btn_calc.grid(row=3, column=0, columnspan=2, pady=20, ipadx=50)

# 5. Show Result
lbl_result = tk.Label(window, text="EMI value will appear here", font=("Arial", 12, "bold"))
lbl_result.grid(row=4, column=0, columnspan=2, pady=10)

# 6. Save Schedule Button
btn_save = tk.Button(window, text="Save Schedule as CSV", command=save_schedule_action, bg="#2196F3", fg="white")
btn_save.grid(row=5, column=0, columnspan=2, pady=5, ipadx=40)

# Keep window open (Main Loop)
window.mainloop()