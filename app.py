from flask import Flask, request, jsonify
from flask_cors import CORS
import docker
import uuid
import time

app = Flask(__name__)
CORS(app)

client = docker.from_env()  # Connect to Docker daemon
timeout = 2  # seconds

@app.route("/execute", methods=["POST"])
def execute_code():
    data = request.get_json()
    code = data.get("code", "")

    if not code:
        return jsonify({"error": "No code provided"}), 400

    container_name = f"code-runner-{uuid.uuid4()}"
    
    try:
        print(f"Container {container_name} started")
        now = time.time()
        container = client.containers.run(
            "python:3.10",
            command=["timeout", "-k", "1s", f"{timeout}s", "python3", "-c", f"{code}"],
            detach=False,
            remove=True,
            mem_limit="128m",
            network_disabled=True,
            stdin_open=False,
            tty=True,
        )
        log = container.decode().strip()
        print(f"Container {container_name} stopped after {time.time() - now:.2f} seconds")
        if len(log) == 0:
            return jsonify({"output": "Output vacío"}), 200
        return jsonify({"output": log}), 200

    except docker.errors.ContainerError as e:
        if "124" in f"{e}":
            return jsonify({"output": f"Exedió el tiempo ({time.time() - now:.2f} s)"}), 200
        return jsonify({"error": e.stderr.decode()}), 400
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run()
