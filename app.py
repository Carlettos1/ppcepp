from flask import Flask, request, jsonify
from flask_cors import CORS
import docker
import uuid
import time
import base64
import io
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt

image_name = "python-code-runner12:latest"
app = Flask(__name__)
CORS(app)

client = docker.from_env()  # Connect to Docker daemon
timeout = 10  # seconds

# Build the custom image if it doesn't exist
try:
    client.images.get(image_name)
except docker.errors.ImageNotFound:
    print("Building custom Python image...")
    client.images.build(
        path='./backend',
        tag=image_name,
        dockerfile='Dockerfile',
    )

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
        
        # Add code to save plot to a file if matplotlib is used
        plot_code = """
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
import io

# Your code here
{}

# If there's a plot, save it to a file
if plt.get_fignums():
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    print('PLOT_START')
    print(base64.b64encode(buf.getvalue()).decode())
    print('PLOT_END')
    plt.close('all')
""".format(code)

        container = client.containers.run(
            image_name,
            name=container_name,
            command=f"timeout {timeout}s python3 -c \"{plot_code.replace('"', '\\"')}\"",
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

        # Check if there's a plot in the output
        if 'PLOT_START' in logs and 'PLOT_END' in logs:
            plot_data = logs.split('PLOT_START')[1].split('PLOT_END')[0].strip()
            return jsonify({
                "output": logs.split('PLOT_START')[0].strip(),
                "plot": plot_data,
                "status_code": exit_status["StatusCode"],
                "duration": duration
            }), 200

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
