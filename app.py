from flask import Flask, redirect, url_for, render_template, jsonify, Markup
from pyEEG.Models.Operation import Analysis, FileManager, StateMessages
from pyEEG.Utils.Extensions import importEdf
app = Flask(__name__)


analysis=None
welcome = False

welcome_message = """
EEG-UI, <strong>Taha Mert Gökdemir</strong> tarafından, Elektrik Mühendisliği Bitirme Projesi Kapsamında,
 <strong>Doç. Dr. Tahir Çetin Akıncı</strong> gözetmenliğinde geliştirilmiştir.
 <br><br>
  EEG-UI, önceden kaydedilmiş EEG verisinin analizini kolaylaştırmak amacıyla geliştirilmiştir.
"""

@app.route('/')
@app.route('/welcome')
def home():
    if not welcome:
        return render_template('starter.html', title="Welcome", msg=Markup(welcome_message))
    else:
        return {"response" : "empty"}

@app.route('/bad-req')
def invalid():
    return redirect(url_for("home"))

@app.route('/start_analysis/<name>', methods = ['GET'])
def startAnalysis(name):
    global analysis
    analysis = Analysis.createAnalysis(name)
    return_msg = StateMessages.success()
    return_msg["custom"] = {
        "id" : analysis.id,
        "msg" : "successfully created {}".format(analysis.name)
    }
    print(return_msg)
    return jsonify(return_msg)


app.run(port=5000)