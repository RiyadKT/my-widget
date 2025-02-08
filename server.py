from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)  # ✅ Allow all origins

@app.before_request
def handle_options():
    """Handle CORS preflight requests properly"""
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight successful"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response, 200

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    
    if not data or "message" not in data:
        return jsonify({"error": "Missing 'message' field in JSON body"}), 400

    user_input = data["message"].lower()
    print(f"this is user input {user_input}")
    recommendations = {
        "floral": "Chanel No. 5 – A classic floral scent!",
        "woody": "Tom Ford Oud Wood – A warm, woody fragrance."
    }
    recommendation = recommendations.get(user_input, "Dior Sauvage – A fresh and versatile perfume!")

    return jsonify({"recommendation": recommendation})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)