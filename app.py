import streamlit as st

# Streamlit Page Configuration
st.set_page_config(page_title="Nerolia Perfume Assistant", layout="wide")

# Hide Streamlit Default UI Elements
hide_st_style = """
    <style>
        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        header {visibility: hidden;}
    </style>
"""
st.markdown(hide_st_style, unsafe_allow_html=True)

# Title
st.markdown("<h3 style='text-align: center;'> Nerolia Perfume Assistant</h3>", unsafe_allow_html=True)

# User Input (Using `st.text_area`)
user_input = st.text_area("Describe your perfume preference:", placeholder="Example: A fresh floral scent with vanilla...")

# Recommendation Logic
def get_recommendation(text):
    text = text.lower()
    if "floral" in text:
        return "🌺 Chanel No. 5 – A classic floral scent!"
    elif "woody" in text:
        return "🌳 Tom Ford Oud Wood – A warm, woody fragrance."
    else:
        return "✨ Dior Sauvage – A fresh and versatile perfume!"

# Button to Submit Input
if st.button("🔍 Find Recommendations"):
    if user_input.strip():
        recommendation = get_recommendation(user_input)
        st.success(f"✅ Recommended Perfume: {recommendation}")
    else:
        st.warning("⚠️ Please enter a description before searching.")