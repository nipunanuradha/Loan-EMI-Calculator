import tkinter as tk
from tkinter import ttk, messagebox

def calculate_loan():
    try:
        principal = float(entry_principal.get())
        annual_rate = float(entry_rate.get())
        years = float(entry_years.get())

        r = annual_rate / (12 * 100)
        n = years * 12

        emi = (principal * r * ((1 + r) ** n)) / (((1 + r) ** n) - 1)
        
        total_payment = emi * n
        total_interest = total_payment - principal

        lbl_emi_val.config(text=f"/= {emi:,.2f}")
        lbl_total_val.config(text=f"/= {total_payment:,.2f}")
        lbl_interest_val.config(text=f"/= {total_interest:,.2f}")

        # table update
        for row in tree.get_children():
            tree.delete(row)

        remaining_balance = principal
        
        for month in range(1, int(n) + 1):
            interest_payment = remaining_balance * r
            principal_payment = emi - interest_payment
            remaining_balance = remaining_balance - principal_payment
            
            if remaining_balance < 0: remaining_balance = 0
            
            tree.insert("", "end", values=(
                month,
                f"{interest_payment:,.2f}",
                f"{principal_payment:,.2f}",
                f"{remaining_balance:,.2f}"
            ))

    except ValueError:
        messagebox.showerror("Error", "Please enter valid numeric values.")
    except ZeroDivisionError:
        messagebox.showerror("Error", "interest rate cannot be 0%.")

def reset_fields():
    entry_principal.delete(0, tk.END)
    entry_rate.delete(0, tk.END)
    entry_years.delete(0, tk.END)
    lbl_emi_val.config(text="---")
    lbl_total_val.config(text="---")
    lbl_interest_val.config(text="---")
    for row in tree.get_children():
        tree.delete(row)

# GUI (Responsive Layout) ---

root = tk.Tk()
root.title("Advanced Loan EMI System")
# start with full screen
root.state('zoomed')

# Grid Configuration
# row and column set with Flexible
root.columnconfigure(0, weight=1)
root.rowconfigure(0, weight=1)

# Main Container
main_frame = tk.Frame(root, padx=20, pady=20)
main_frame.grid(row=0, column=0, sticky="nsew") # nsew = all directions

# devide Main Frame 
main_frame.columnconfigure(0, weight=1)
# Row 4 set more space (weight=1) for table expansion
main_frame.rowconfigure(4, weight=1) 

# topic label
lbl_title = tk.Label(main_frame, text="EMI Calculator", font=("Helvetica", 20, "bold"), fg="#333")
lbl_title.grid(row=0, column=0, pady=(0, 20))

#Input Section
input_frame = tk.Frame(main_frame)
input_frame.grid(row=1, column=0, pady=10)

tk.Label(input_frame, text="Principal:", font=("Arial", 11)).grid(row=0, column=0, padx=10, pady=5, sticky="e")
entry_principal = tk.Entry(input_frame, font=("Arial", 11), width=20)
entry_principal.grid(row=0, column=1, padx=10, pady=5)

tk.Label(input_frame, text="Annual Interest Rate (%):", font=("Arial", 11)).grid(row=1, column=0, padx=10, pady=5, sticky="e")
entry_rate = tk.Entry(input_frame, font=("Arial", 11), width=20)
entry_rate.grid(row=1, column=1, padx=10, pady=5)

tk.Label(input_frame, text="Time Period (Years):", font=("Arial", 11)).grid(row=2, column=0, padx=10, pady=5, sticky="e")
entry_years = tk.Entry(input_frame, font=("Arial", 11), width=20)
entry_years.grid(row=2, column=1, padx=10, pady=5)

# Buttons
btn_frame = tk.Frame(main_frame)
btn_frame.grid(row=2, column=0, pady=15)

tk.Button(btn_frame, text="Calculate", command=calculate_loan, bg="#4CAF50", fg="white", font=("Arial", 11, "bold"), width=15).pack(side="left", padx=10)
tk.Button(btn_frame, text="Reset", command=reset_fields, bg="#f44336", fg="white", font=("Arial", 11, "bold"), width=10).pack(side="left", padx=10)

# Result Summary Cards
summary_frame = tk.Frame(main_frame, bg="#f5f5f5", bd=1, relief="solid", padx=10, pady=10)
summary_frame.grid(row=3, column=0, pady=15, sticky="ew") # sticky="ew" row wise expand

# divide summary frame into 3 columns
summary_frame.columnconfigure(0, weight=1)
summary_frame.columnconfigure(1, weight=1)
summary_frame.columnconfigure(2, weight=1)

tk.Label(summary_frame, text="Monthly payment (EMI)", bg="#f5f5f5").grid(row=0, column=0)
lbl_emi_val = tk.Label(summary_frame, text="---", font=("Arial", 14, "bold"), fg="blue", bg="#f5f5f5")
lbl_emi_val.grid(row=1, column=0, pady=5)

tk.Label(summary_frame, text="Total Interest", bg="#f5f5f5").grid(row=0, column=1)
lbl_interest_val = tk.Label(summary_frame, text="---", font=("Arial", 14, "bold"), fg="red", bg="#f5f5f5")
lbl_interest_val.grid(row=1, column=1, pady=5)

tk.Label(summary_frame, text="Total Payment", bg="#f5f5f5").grid(row=0, column=2)
lbl_total_val = tk.Label(summary_frame, text="---", font=("Arial", 14, "bold"), fg="black", bg="#f5f5f5")
lbl_total_val.grid(row=1, column=2, pady=5)

# Responsive Table
# table frame with scrollbar
table_container = tk.Frame(main_frame)
table_container.grid(row=4, column=0, sticky="nsew") # nsew fill all directions

scrollbar = tk.Scrollbar(table_container)
scrollbar.pack(side="right", fill="y")

columns = ("Month", "Interest", "Principal", "Balance")
tree = ttk.Treeview(table_container, columns=columns, show="headings", yscrollcommand=scrollbar.set)

tree.heading("Month", text="Month")
tree.heading("Interest", text="Interest")
tree.heading("Principal", text="Principal")
tree.heading("Balance", text="Balance")

# Column widths and alignment
tree.column("Month", width=80, anchor="center")
tree.column("Interest", width=150, anchor="center")
tree.column("Principal", width=180, anchor="center")
tree.column("Balance", width=150, anchor="center")

tree.pack(side="left", fill="both", expand=True) # Table expands
scrollbar.config(command=tree.yview)

root.mainloop()