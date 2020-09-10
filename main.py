#presumptions:
    ##all channels are recorded with the same frequency
    ##all channels has the same number of samples
    ##events

## first test for importing the data
import os
import datasets
import pyedflib
import numpy as np

import matplotlib
import matplotlib.pyplot as plt
from pandas import DataFrame, Grouper
ROOT_DIR = os.path.dirname(datasets.__file__)
FILE_NAME = "S001R03.edf"
dataset_path = os.path.join(ROOT_DIR, FILE_NAME)
f = pyedflib.EdfReader(dataset_path)
sampleDeltaTime = 1/f.getSampleFrequency(0)
print("{} ms".format(sampleDeltaTime*1000))
signals = []
time = np.arange(0, sampleDeltaTime*f.getNSamples()[0], sampleDeltaTime)
channels = DataFrame()
idx = 0
for i in f.getSignalLabels():
    channels[i] = f.readSignal(idx, start=0, n=f.getNSamples()[0])
    idx+=1


channels.plot(subplots=True, legend=False)
plt.show()