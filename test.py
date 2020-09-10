from pyEEG.Utils.Extensions import importEdf
from pyEEG.Models.Data import Dataset

import os
import datasets

ROOT_DIR = os.path.dirname(datasets.__file__)
FILE_NAME = "S001R03.edf"
dataset_path = os.path.join(ROOT_DIR, FILE_NAME)
f = importEdf(dataset_path)

