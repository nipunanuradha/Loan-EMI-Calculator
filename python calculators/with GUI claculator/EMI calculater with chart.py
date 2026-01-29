import tkinter as tk
from tkinter import messagebox, filedialog
import csv
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# calcualte EMI function
def get_inputs():
    try:
        p = float(entry_principal.get())
        r_annual = float(entry_rate.get())
        y = float(entry_years.get())
        return p, r_annual, y
    except ValueError:
        return None

def calculate_emi_action():
    data = get_inputs()
    
    if data:
        principal, annual_rate, years = data
        
        # calculate EMI
        r = annual_rate / (12 * 100)
        n = years * 12
        
        try:
            emi = (principal * r * ((1 + r) ** n)) / (((1 + r) ** n) - 1)

            # total payment and interest calculation
            total_payment = emi * n
            total_interest = total_payment - principal

            # results display
            lbl_emi.config(text=f"Monthly payment: /= {emi:,.2f}", fg="blue")
            lbl_total.config(text=f"Total Payment: /= {total_payment:,.2f}")
            lbl_interest.config(text=f"Total Interest: /= {total_interest:,.2f}", fg="red")

            # pie chart drawing
            draw_chart(principal, total_interest)

        except ZeroDivisionError:
             messagebox.showerror("Error", "cannot interest rate be zero.")
    else:
        messagebox.showerror("Error", "please enter valid numeric inputs.")

def draw_chart(principal, total_interest):
    """drows a pie chart of principal vs interest"""
    
    # Clear previous chart
    for widget in chart_frame.winfo_children():
        widget.destroy()

    # chart data
    labels = ['Principal', 'Total Interest']
    sizes = [principal, total_interest]
    colors = ['#4CAF50', '#FF5722'] # green and orange colors

    # Matplotlib pie chart creation
    fig, ax = plt.subplots(figsize=(4, 3)) # size
    ax.pie(sizes, labels=labels, autopct='%1.1f%%', colors=colors, startangle=90)
    ax.axis('equal')  # set circle aspect ratio

    # Tkinter inside chart
    canvas = FigureCanvasTkAgg(fig, master=chart_frame)
    canvas.draw()
    canvas.get_tk_widget().pack()

def clear_inputs():
    """reset button action"""
    entry_principal.delete(0, tk.END)
    entry_rate.delete(0, tk.END)
    entry_years.delete(0, tk.END)
    lbl_emi.config(text="...")
    lbl_total.config(text="...")
    lbl_interest.config(text="...")
    # clrear chart
    for widget in chart_frame.winfo_children():
        widget.destroy()

# Design gui

window = tk.Tk()
window.title("Professional EMI Calculator")
window.geometry("500x650") # increes window size
window.config(padx=20, pady=20)

# Input Section
tk.Label(window, text="Principal amount:").grid(row=0, column=0, sticky="w", pady=5)
entry_principal = tk.Entry(window)
entry_principal.grid(row=0, column=1, pady=5)

tk.Label(window, text="Annual interest rate (%):").grid(row=1, column=0, sticky="w", pady=5)
entry_rate = tk.Entry(window)
entry_rate.grid(row=1, column=1, pady=5)

tk.Label(window, text="time (years):").grid(row=2, column=0, sticky="w", pady=5)
entry_years = tk.Entry(window)
entry_years.grid(row=2, column=1, pady=5)

# Buttons
btn_frame = tk.Frame(window)
btn_frame.grid(row=3, column=0, columnspan=2, pady=15)

tk.Button(btn_frame, text="Calculate", command=calculate_emi_action, bg="green", fg="white", width=15).pack(side="left", padx=5)
tk.Button(btn_frame, text="Reset", command=clear_inputs, bg="gray", fg="white", width=10).pack(side="left", padx=5)

# Results Section
lbl_emi = tk.Label(window, text="...", font=("Arial", 12, "bold"))
lbl_emi.grid(row=4, column=0, columnspan=2, pady=2)

lbl_total = tk.Label(window, text="...", font=("Arial", 10))
lbl_total.grid(row=5, column=0, columnspan=2, pady=2)

lbl_interest = tk.Label(window, text="...", font=("Arial", 10))
lbl_interest.grid(row=6, column=0, columnspan=2, pady=2)

# Chart Area (pie chart area)
chart_frame = tk.Frame(window)
chart_frame.grid(row=7, column=0, columnspan=2, pady=20)

window.mainloop()