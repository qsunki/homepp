from flask import Flask, render_template
import threading
import time
import os
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('cam.html')

def run_server():
    app.run(host='0.0.0.0', port=8000, debug=False)

if __name__ == "__main__":
    server_thread = threading.Thread(target=run_server)
    server_thread.start()
    subprocess.Popen(['xdg-open', 'http://127.0.0.1:8000'])
    # threading.Timer(1, open_browser).start()
    # app.run(host='0.0.0.0', port=8000, debug=True)


    # 페이지가 로딩되도록 잠시 대기
    time.sleep(10)

    # Chromium 프로세스 종료
    print('pkill start')
    # os.system("pkill -f 'chromium'")
    os.system("pkill chromium")
    # os.system("pkill -f 'chrome'")
    print('pkill end')
