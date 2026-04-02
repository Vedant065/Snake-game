from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow frontend to connect

scores = []

# Save score
@app.route('/save_score', methods=['POST'])
def save_score():
    data = request.json
    score = data.get("score", 0)
    scores.append(score)
    return jsonify({"message": "Score saved!"})

# Get leaderboard
@app.route('/get_scores', methods=['GET'])
def get_scores():
    return jsonify(sorted(scores, reverse=True)[:10])

if __name__ == '__main__':
    app.run(debug=True)
