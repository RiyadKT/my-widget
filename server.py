from flask import Flask, request, jsonify
from flask_cors import CORS


import openai
import pandas as pd
from fuzzywuzzy import process

def recommend_perfume(adjectives):
    perfume_recommendations = {
        "Florale": "Chanel No. 5 – A classic floral scent!",
        "Orientale": "Yves Saint Laurent Opium – A rich, spicy oriental fragrance.",
        "Boisée": "Tom Ford Oud Wood – A warm, woody scent.",
        "Hespéridée": "Acqua di Gio – A fresh citrusy fragrance.",
        "Fougère": "Dior Sauvage – A fresh and masculine scent.",
        "Chyprée": "Guerlain Mitsouko – A sophisticated chypre fragrance.",
        "Gourmande": "Thierry Mugler Angel – A sweet, dessert-like perfume."
    }

    # Find matches
    matched_perfumes = [perfume_recommendations[adj] for adj in adjectives if adj in perfume_recommendations]

    if not matched_perfumes:
        return "No exact match found, but you might like Dior Sauvage – A fresh and versatile perfume!"

    return matched_perfumes[0]  # Return the first match for now






def classify_perfume(adjectives):
    df = pd.read_csv("perfumes.csv")
    
    
    client = openai.AzureOpenAI(
    api_key="",
    api_version="2024-08-01-preview",
    azure_endpoint=""
    )

    prompt = f"""
    You are an expert perfumer. Given these perfume characteristics: {adjectives},
    recommend the best matching perfume from the following dataset:
    
    {" ".join([x[0] for x in df.index])}

    Only return the perfume name.
    """

    response = client.chat.completions.create(
        model="gpt-35-turbo-16k",  # Use your deployed model name (Azure OpenAI users replace this with deployment name)
        messages=[
            {"role": "user", "content": prompt},
        ]
    )
    
    brands = [x[0] for x in df.index]
    sentence = response.choices[0].message.content.strip()
    

    return max([(process.extractOne(brand,sentence.split(),scorer=process.fuzz.partial_ratio)[1],brand) for brand in brands])[1]



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
    data = request.json
    message = data.get("message", "")

    if not message:
        return jsonify({"error": "No message provided"}), 400
    
    recommendation = classify_perfume(message.split(" "))  # Split the message into notes
    return jsonify({"recommendation": recommendation})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)