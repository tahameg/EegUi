from pyEEG.Models import Data
from pyEEG.Utils.Extensions import importEdf
import uuid
import pyedflib, os, pathlib, datasets

class Analysis:
    def __init__(self, _name, _dataset):
        _dataset.Name = _name
        self.dataset = _dataset

    def getDict(self):
        return self.dataset.getDict()

    def getDictNoSignal(self):
        return self.dataset.getDictNoSignal()

    @staticmethod
    def createTestAnalysis(): #just for development
        ROOT_DIR = os.path.dirname(datasets.__file__)
        FILE_NAME = "S001R03.edf"
        dataset_path = os.path.join(ROOT_DIR, FILE_NAME)
        f = FileManager.importEdf(dataset_path)
        d = Data.Dataset(f)
        d.initialize()
        return Analysis("test_set", d)

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
    def success(msg="", data={}):
        success = {
            "result" : "success",
            "msg" : msg,
            "custom" : data
        }
        return success

    @staticmethod
    def fail(msg="", data={}):
        fail = {
            "result" : "fail",
            "msg" : msg,
            "custom" : data
        }
        return fail