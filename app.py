from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)

@app.route("/execute", methods=["POST"])
def execute_code():
    data = request.get_json()
    code = data.get("code", "")

    try:
        result = subprocess.run(
            ['python3', '-c', code],
            text=True,
            capture_output=True,
            check=True
        )
        return jsonify({'output': result.stdout})
    except subprocess.CalledProcessError as e:
        return jsonify({'output': e.stderr})

if __name__ == "__main__":
    app.run(debug=True)