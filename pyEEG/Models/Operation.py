from pyEEG.Models.Data import Dataset
from pyEEG.Utils.Extensions import importEdf
import uuid
import pyedflib, os, pathlib

class Analysis:
    def __init__(self, _name, _dataset):
        self.name = _name
        self.dataset = _dataset

    def getDict(self):
        return self.dataset.getDict()

    def getDictNoSignal(self):
        return self.dataset.getDictNoSignal()

class FileManager:
    last_created = 0
    file_directory = str(pathlib.Path.home())

    @staticmethod
    def importEdf(path):
        return importEdf(path)

    @staticmethod
    def createNewDir():
        path = os.path.join(FileManager.file_directory, "eeg-ui", str(FileManager.last_created))
        if os.path.exists(path):
            return path
        else:
            os.makedirs(path)
            FileManager.last_created += 1
            return path



class StateMessages:

    @staticmethod
    def success():
        success = {
            "result" : "success",
            "msg" : "",
            "custom" : ""
        }
        return success

    @staticmethod
    def fail():
        fail = {
            "result" : "fail",
            "msg" : "",
            "custom" : ""
        }
        return fail