from flask import Flask, redirect, url_for, render_template, jsonify, Markup, request
from pyEEG.Models.Operation import Analysis, FileManager, StateMessages
from pyEEG.Utils.Extensions import importEdf
from pyEEG.Models import Data
import os

app = Flask(__name__)


CURRENT_ANALYSIS=None

welcome_message = """
EEG-UI, <strong>Taha Mert Gökdemir</strong> tarafından, Elektrik Mühendisliği Bitirme Projesi Kapsamında,
 <strong>Doç. Dr. Tahir Çetin Akıncı</strong> gözetmenliğinde geliştirilmiştir.
 <br><br>
  EEG-UI, önceden kaydedilmiş EEG verisinin analizini kolaylaştırmak amacıyla geliştirilmiştir.
"""

@app.route('/')
@app.route('/index')
@app.route('/welcome')
def home():
    return render_template('welcome.html', title="Welcome", msg=Markup(welcome_message))

@app.route('/bad-req')
def invalid():
    return redirect(url_for("home"))


@app.route('/test')
def test():
    return render_template("test.html", title="test");

@app.route('/file_upload')
def file_upload():
   return render_template('fileupload.html', title="Yeni Analiz Yarat", script="data-upload.js")

@app.route('/handle_file_upload', methods=["POST"])
def handleFileUpload():
    name = request.form['name']
    file = request.files['file']
    filename = file.filename
    if filename == "":
        msg = StateMessages.fail()
        msg["msg"] = "Henüz bir dosya yüklemediniz!"
        return jsonify(msg)
    else:
        path = FileManager.createNewDir()
        file_path = os.path.join(path, file.filename)
        file.save(file_path)
        try:
            f = FileManager.importEdf(file_path)
            d = Data.Dataset(name, f)
            d.initialize()
            global CURRENT_ANALYSIS
            CURRENT_ANALYSIS = Analysis(name, d)
            msg = StateMessages.success()
            msg["msg"] = "Dosya Başarıyla Yüklendi"
            msg["custom"] = CURRENT_ANALYSIS.getDictNoSignal()
            return jsonify(msg)
        except Exception as e:
            msg = StateMessages.fail()
            msg["msg"] = str(e)
            return jsonify(msg)






app.run(port=5000)