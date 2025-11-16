import streamlit as st

def check_password(key_suffix=""):
    """
    Returns True if the password is correct.
    Uses a key_suffix to ensure unique widget keys across pages.
    """
    try:
        admin_password = st.secrets["admin"]["password"]
    except KeyError:
        st.error("Admin password not set in st.secrets.toml. Please contact the administrator.")
        return False

    # Use a unique session state key for each page's auth status
    session_key = f"password_correct_{key_suffix}"
    if session_key not in st.session_state:
        st.session_state[session_key] = False

    if not st.session_state[session_key]:
        password = st.text_input(
            "Enter Admin Password:",
            type="password",
            key=f"admin_pass_input_{key_suffix}" # Apply suffix
        )
        if st.button("Submit", key=f"admin_pass_button_{key_suffix}"): # Apply suffix
            if password == admin_password:
                st.session_state[session_key] = True
                st.rerun()
            else:
                st.error("The password you entered is incorrect.")
        return False
    else:
        # Password is correct
        return True