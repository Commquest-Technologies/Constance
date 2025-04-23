// custom_fullwidth/public/js/custom_fullwidth.js

$(document).ready(function() {
    // Wait for Frappe to be fully loaded
    frappe.after_ajax(function() {
        applyFullWidthSettings();
    });
});

// Separate function for full width settings
function applyFullWidthSettings() {
    // Apply full width class immediately
    $('body').addClass('full-width');
    
    // Store in localStorage without triggering any save operations
    localStorage.setItem('frappe-full-width-mode', '1');
    
    // Hide toggle button for non-administrators - using the exact selector
    if (frappe.session && frappe.session.user !== "Administrator") {
        // Target the specific dropdown item by text and onclick attribute
        $('button.dropdown-item[onclick*="toggle_full_width"]').hide();
        $('.dropdown-item:contains("Toggle Full Width")').hide();
    }
    
    // Also modify the toggle_full_width function to ensure full width stays on
    if (frappe.ui && frappe.ui.toolbar) {
        const originalToggle = frappe.ui.toolbar.toggle_full_width;
        frappe.ui.toolbar.toggle_full_width = function() {
            // Always ensure we end up in full width mode
            if (frappe.session.user === "Administrator") {
                // Allow admin to toggle
                originalToggle();
                // But make sure we're in full width mode 
                setTimeout(() => $('body').addClass('full-width'), 100);
            } else {
                // For non-admins, just ensure full width
                $('body').addClass('full-width');
                return false; // Prevent default action
            }
        };
    }
}

// Need to run again after route changes to catch any newly rendered buttons
$(document).on('page:change route-change', function() {
    setTimeout(function() {
        // Keep full width mode
        $('body').addClass('full-width');
        
        // Hide toggle button again
        if (frappe.session && frappe.session.user !== "Administrator") {
            $('button.dropdown-item[onclick*="toggle_full_width"]').hide();
            $('.dropdown-item:contains("Toggle Full Width")').hide();
        }
    }, 300);
});

// Special handling for when the dropdown menu is opened
$(document).on('click', '.navbar .dropdown', function() {
    // After dropdown opens, hide the button if needed
    setTimeout(function() {
        if (frappe.session && frappe.session.user !== "Administrator") {
            $('button.dropdown-item[onclick*="toggle_full_width"]').hide();
            $('.dropdown-item:contains("Toggle Full Width")').hide();
        }
    }, 100);
});


$(document).ready(function() {
    // Set the default view for Item list in localStorage
    localStorage.setItem('_doctype:Item:list_view', 'Image');
    
    // Handle route changes to ensure it applies on navigation
    $(document).on('route_change', function() {
        // If we're on the Item list
        if (frappe.get_route()[0] === 'List' && frappe.get_route()[1] === 'Item') {
            // Give the page time to render
            setTimeout(function() {
                // Force click the image view button if it exists and we're not already in image view
                if ($('.list-image-view').length && !$('.image-view').length) {
                    $('.list-image-view').trigger('click');
                }
            }, 200);
        }
    });
});