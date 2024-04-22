# app.py
import numpy as np
from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)
model = pickle.load(open('C:\\Users\\simon\\Downloads\\sunhacks\\node-flask-inti\\model.pkl', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    height = float(request.json['height'])

    # Predict weight based on height using the loaded model
    prediction = model.predict([[height]])
    predicted_weight = np.round(prediction[0], 2)

    return jsonify({'prediction_text': f'Weight prediction: {predicted_weight} kg'})

if __name__ == "__main__":
    app.run(debug=True)


