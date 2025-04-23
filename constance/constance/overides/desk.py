import frappe

def after_login():
    """Set full width preference in user doc after login"""
    if frappe.session.user:
        # Set the full width preference for the user
        user = frappe.get_doc("User", frappe.session.user)
        if not user.get("full_width"):
            user.db.set_value("User", frappe.session.user, "full_width", 1)
            frappe.db.commit()