from flask import Flask, request
from nlp_service import analyze_ner

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.post("/ner")
def ner():
    json = request.get_json()
    result = analyze_ner(json['data'])
    return result
