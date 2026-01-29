import tkinter as tk
from tkinter import ttk, messagebox, Menu

# --- වර්ණ පද්ධතිය (Color Palettes) ---
# Dark සහ Light Mode සඳහා වර්ණ කේත මෙතැන නිර්වචනය කර ඇත.
THEMES = {
    "light": {
        "bg": "#ffffff", "fg": "#000000",
        "entry_bg": "#f0f0f0", "entry_fg": "#000000",
        "btn_bg": "#4CAF50", "btn_fg": "#ffffff",
        "card_bg": "#f5f5f5", "card_fg": "#000000",
        "tree_bg": "#ffffff", "tree_fg": "#000000", "tree_field": "#ffffff"
    },
    "dark": {
        "bg": "#2d2d2d", "fg": "#ffffff",
        "entry_bg": "#3e3e3e", "entry_fg": "#ffffff",
        "btn_bg": "#008CBA", "btn_fg": "#ffffff",
        "card_bg": "#3e3e3e", "card_fg": "#ffffff",
        "tree_bg": "#2d2d2d", "tree_fg": "#ffffff", "tree_field": "#2d2d2d"
    }
}

# දැනට පවතින Theme එක (Default = Light)
current_theme = "light"

def apply_theme(mode):
    """තෝරාගත් Mode එකට අදාළව සියලුම Widget වල පාට වෙනස් කිරීම"""
    global current_theme
    current_theme = mode
    colors = THEMES[mode]

    # 1. ප්‍රධාන කවුළුවේ පාට
    root.config(bg=colors["bg"])
    main_frame.config(bg=colors["bg"])
    input_frame.config(bg=colors["bg"])
    btn_frame.config(bg=colors["bg"])
    table_container.config(bg=colors["bg"])
    
    # 2. අකුරු (Labels)
    lbl_title.config(bg=colors["bg"], fg=colors["fg"])
    
    # Input Labels සඳහා Loop එකක්
    for widget in input_frame.winfo_children():
        if isinstance(widget, tk.Label):
            widget.config(bg=colors["bg"], fg=colors["fg"])
        elif isinstance(widget, tk.Entry):
            widget.config(bg=colors["entry_bg"], fg=colors["entry_fg"], insertbackground=colors["fg"])

    # 3. Summary Cards (යටින් ඇති කොටු)
    summary_frame.config(bg=colors["card_bg"])
    for widget in summary_frame.winfo_children():
        widget.config(bg=colors["card_bg"])
        # විශේෂිත අකුරු පාට (EMI = Blue/Cyan, Interest = Red/Orange)
        if widget in [lbl_emi_val, lbl_interest_val, lbl_total_val]:
            # Dark Mode එකේදී පාට ටිකක් දීප්තිමත් කරමු
            if mode == "dark":
                if widget == lbl_emi_val: widget.config(fg="#4fc3f7") # Light Blue
                elif widget == lbl_interest_val: widget.config(fg="#ff8a65") # Light Red
                else: widget.config(fg="white")
            else:
                if widget == lbl_emi_val: widget.config(fg="blue")
                elif widget == lbl_interest_val: widget.config(fg="red")
                else: widget.config(fg="black")
        else:
            widget.config(fg=colors["card_fg"])

    # 4. වගුව (Treeview) Style කිරීම
    style = ttk.Style()
    style.theme_use("clam") # 'clam' theme එක පාට වෙනස් කරන්න ලේසියි
    
    style.configure("Treeview", 
                    background=colors["tree_bg"],
                    foreground=colors["tree_fg"],
                    fieldbackground=colors["tree_field"],
                    rowheight=25)
    
    style.configure("Treeview.Heading", 
                    background=colors["card_bg"], 
                    foreground=colors["card_fg"],
                    font=('Arial', 10, 'bold'))
    
    # Selected Row Color
    style.map("Treeview", background=[('selected', '#3498db')])

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

        lbl_emi_val.config(text=f"රු. {emi:,.2f}")
        lbl_total_val.config(text=f"රු. {total_payment:,.2f}")
        lbl_interest_val.config(text=f"රු. {total_interest:,.2f}")

        # වගුව පිරවීම
        for row in tree.get_children():
            tree.delete(row)

        remaining_balance = principal
        for month in range(1, int(n) + 1):
            interest_payment = remaining_balance * r
            principal_payment = emi - interest_payment
            remaining_balance = remaining_balance - principal_payment
            if remaining_balance < 0: remaining_balance = 0
            
            tree.insert("", "end", values=(month, f"{interest_payment:,.2f}", f"{principal_payment:,.2f}", f"{remaining_balance:,.2f}"))

    except ValueError: messagebox.showerror("Error", "Invalid Input")
    except ZeroDivisionError: messagebox.showerror("Error", "Rate cannot be 0")

def reset_fields():
    entry_principal.delete(0, tk.END)
    entry_rate.delete(0, tk.END)
    entry_years.delete(0, tk.END)
    lbl_emi_val.config(text="---")
    lbl_total_val.config(text="---")
    lbl_interest_val.config(text="---")
    for row in tree.get_children(): tree.delete(row)

# --- GUI Setup ---

root = tk.Tk()
root.title("EMI Calculator Pro")
root.state('zoomed')

# Grid Configuration for Responsiveness
root.columnconfigure(0, weight=1)
root.rowconfigure(0, weight=1)

main_frame = tk.Frame(root, padx=20, pady=20)
main_frame.grid(row=0, column=0, sticky="nsew")

main_frame.columnconfigure(0, weight=1)
main_frame.rowconfigure(4, weight=1)

# 1. Title
lbl_title = tk.Label(main_frame, text="ණය වාරික ගණක යන්ත්‍රය", font=("Helvetica", 20, "bold"))
lbl_title.grid(row=0, column=0, pady=(0, 20))

# 2. Input Section
input_frame = tk.Frame(main_frame)
input_frame.grid(row=1, column=0, pady=10)

tk.Label(input_frame, text="ණය මුදල (Principal):", font=("Arial", 11)).grid(row=0, column=0, padx=10, pady=5, sticky="e")
entry_principal = tk.Entry(input_frame, font=("Arial", 11), width=20)
entry_principal.grid(row=0, column=1, padx=10, pady=5)

tk.Label(input_frame, text="වාර්ෂික පොලිය (%):", font=("Arial", 11)).grid(row=1, column=0, padx=10, pady=5, sticky="e")
entry_rate = tk.Entry(input_frame, font=("Arial", 11), width=20)
entry_rate.grid(row=1, column=1, padx=10, pady=5)

tk.Label(input_frame, text="කාලය (අවුරුදු):", font=("Arial", 11)).grid(row=2, column=0, padx=10, pady=5, sticky="e")
entry_years = tk.Entry(input_frame, font=("Arial", 11), width=20)
entry_years.grid(row=2, column=1, padx=10, pady=5)

# 3. Buttons
btn_frame = tk.Frame(main_frame)
btn_frame.grid(row=2, column=0, pady=15)
tk.Button(btn_frame, text="ගණනය කරන්න", command=calculate_loan, bg="#4CAF50", fg="white", font=("Arial", 11, "bold"), width=15).pack(side="left", padx=10)
tk.Button(btn_frame, text="Reset", command=reset_fields, bg="#f44336", fg="white", font=("Arial", 11, "bold"), width=10).pack(side="left", padx=10)

# 4. Summary
summary_frame = tk.Frame(main_frame, bd=1, relief="solid", padx=10, pady=10)
summary_frame.grid(row=3, column=0, pady=15, sticky="ew")
summary_frame.columnconfigure(0, weight=1)
summary_frame.columnconfigure(1, weight=1)
summary_frame.columnconfigure(2, weight=1)

tk.Label(summary_frame, text="මාසික වාරිකය (EMI)").grid(row=0, column=0)
lbl_emi_val = tk.Label(summary_frame, text="---", font=("Arial", 14, "bold"))
lbl_emi_val.grid(row=1, column=0, pady=5)

tk.Label(summary_frame, text="මුළු පොලිය").grid(row=0, column=1)
lbl_interest_val = tk.Label(summary_frame, text="---", font=("Arial", 14, "bold"))
lbl_interest_val.grid(row=1, column=1, pady=5)

tk.Label(summary_frame, text="මුළු ගෙවීම").grid(row=0, column=2)
lbl_total_val = tk.Label(summary_frame, text="---", font=("Arial", 14, "bold"))
lbl_total_val.grid(row=1, column=2, pady=5)

# 5. Table
table_container = tk.Frame(main_frame)
table_container.grid(row=4, column=0, sticky="nsew")
scrollbar = tk.Scrollbar(table_container)
scrollbar.pack(side="right", fill="y")
columns = ("Month", "Interest", "Principal", "Balance")
tree = ttk.Treeview(table_container, columns=columns, show="headings", yscrollcommand=scrollbar.set)
tree.heading("Month", text="මාසය")
tree.heading("Interest", text="පොලිය")
tree.heading("Principal", text="ණය පියවෙන මුදල")
tree.heading("Balance", text="ඉතිරි ණය")
tree.column("Month", width=80, anchor="center")
tree.column("Interest", width=150, anchor="center")
tree.column("Principal", width=180, anchor="center")
tree.column("Balance", width=150, anchor="center")
tree.pack(side="left", fill="both", expand=True)
scrollbar.config(command=tree.yview)

# --- Menu Bar (Mode මාරු කිරීම සඳහා) ---
menubar = Menu(root)
root.config(menu=menubar)

# View මෙනුව සෑදීම
view_menu = Menu(menubar, tearoff=0)
menubar.add_cascade(label="Themes (View)", menu=view_menu)

# මෙනු අයිතම එකතු කිරීම
view_menu.add_command(label="Light Mode", command=lambda: apply_theme("light"))
view_menu.add_command(label="Dark Mode", command=lambda: apply_theme("dark"))
view_menu.add_separator()
view_menu.add_command(label="System Default (Reset)", command=lambda: apply_theme("light"))

# වැඩසටහන පටන් ගන්නා විට Light Mode එක යෙදීම
apply_theme("light")

root.mainloop()