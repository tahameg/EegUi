from pyEEG.Models.Data import Dataset
from pyEEG.Utils.Extensions import importEdf
import uuid
import pyedflib

class Analysis:
    def __init__(self, _name):
        self.id = uuid.uuid4()
        self.name = _name

    @staticmethod
    def createAnalysis(_name):
        return Analysis(_name)

class FileManager:
    @staticmethod
    def importEdf(path):
        file = pyedflib.EdfReader(path)
        return file

class StateMessages:

    @staticmethod
    def success():
        success = {
            "result" : "success",
            "custom" : ""
        }
        return success

    @staticmethod
    def fail():
        fail = {
            "result" : "fail",
            "custom" : ""
        }
        return fail