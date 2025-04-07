from flask import Flask, request, jsonify
from flask_cors import CORS
import docker
import uuid
import time

app = Flask(__name__)
CORS(app)

client = docker.from_env()  # Connect to Docker daemon
timeout = 10  # seconds

@app.route("/execute", methods=["POST"])
def execute_code():
    data = request.get_json()
    code = data.get("code")
    
    if not code or len(code) == 0:
        return jsonify({"output": "No code provided"}), 200

    container_name = f"code-runner-{uuid.uuid4()}"
    
    try:
        print(f"Container {container_name} started with:\n{code}")
        now = time.time()
        container = client.containers.run(
            "python:3.10",
            name=container_name,
            command=f"timeout {timeout}s python3 -c \"{code.replace('"', '\\"')}\"",
            detach=True,
            remove=False,
            mem_limit="128m",
            network_disabled=True,
            stdin_open=False,
            tty=False,
        )
        
        exit_status = container.wait(timeout=timeout)
        duration = time.time() - now

        logs = container.logs(stdout=True, stderr=True).decode()
        container.remove(force=True)

        if exit_status["StatusCode"] == 124:
            return jsonify({"output": f"Exedió el tiempo ({duration:.2f}s)"}), 200

        return jsonify({"output": logs.strip(),
                        "status_code": exit_status["StatusCode"],
                        "duration": duration
                        }), 200

    except docker.errors.ContainerError as e:
        return jsonify({"output": e.stderr.decode() if e.stderr else str(e),
                        "status_code": e.exit_status,
                        "error": "Container Error"
                        }), 400
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"output": str(e)}), 500

if __name__ == "__main__":
    app.run()
