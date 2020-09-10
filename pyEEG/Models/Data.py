import pyedflib
import numpy
import random
import sqlite3
import uuid
def get_freq(_file):
    n_channel = len(_file.getNSamples())
    f_sampler = []
    for i in range(0, 3):
        f_sampler.append(_file.getSampleFrequency(random.randint(0, n_channel-1)))
    for i in range(0, 2):
        if f_sampler[i] != f_sampler[i + 1]:
            raise Exception("Invalid Data: All channels must be recorded with the same frequency!")
        else:
            return f_sampler[i]


def get_n_samples(_file):
    n_channel = len(_file.getNSamples())
    f_sampler = []
    for i in range(0, 3):
        f_sampler.append(_file.getNSamples()[random.randint(0, n_channel-1)])
    for i in range(0, 2):
        if f_sampler[i] != f_sampler[i + 1]:
            raise Exception("Invalid Data: All channels must include same number of data points!")
        else:
            return f_sampler[i]


def prefilter2Dict(prefilter):
    return_dict = {}
    x = prefilter.split()
    for i in x:
        y = i.split(":")
        return_dict[y[0]] = int(y[1][0:-2])
    return return_dict


class Dataset:
    def __init__(self, _name, _file):
        self._id = uuid.uuid4()
        self.name = _name
        self.NChannel = _file.getNSamples()
        self.Freq = get_freq(_file)
        self.NSamples = get_n_samples(_file)
        self.Header = Header(_file.getHeader())




class Header:
    def __init__(self, _header_dict):
        """
        create Header object for storing header data. Header information is given as dictionary.
        (see Header.getEmptyDict() for valid header dict)
        :param _header_dict:
        Header Dictionary
        """
        self.Header = _header_dict
        try:
            self.technician = self.Header['technician']
            self.recording_additional = self.Header["recording_additional"]
            self.patientname = self.Header["patientname"]
            self.patient_additional = self.Header["patient_additional"]
            self.patientcode = self.Header["patientcode"]
            self.equipment = self.Header["equipment"]
            self.admincode = self.Header["admincode"]
            self.gender = self.Header["gender"]
            self.startdate = self.Header["startdate"]
            self.birthdate = self.Header["birthdate"]
        except:
            raise Exception("invalid Header dictionary structure is given as parameter. (see Header.getEmptyDict() for valid header dict)")


    @staticmethod
    def getEmptyDict():
        returnVal = {'technician': '',
                     'recording_additional': '',
                     'patientname': '',
                     'patient_additional': '',
                     'patientcode': '',
                     'equipment': '',
                     'admincode': '',
                     'gender': '',
                     'startdate': None,
                     'birthdate': ''}
        return returnVal

    def getDict(self):
        self.Header = {'technician': self.technician,
                     'recording_additional': self.recording_additional,
                     'patientname': self.patientname,
                     'patient_additional': self.patient_additional,
                     'patientcode': self.patientcode,
                     'equipment': self.equipment,
                     'admincode': self.admincode,
                     'gender': self.gender,
                     'startdate': self.startdate,
                     'birthdate': self.birthdate}
        return self.Header

class Channel:
    def __init__(self, _idx, _channel_dict):
        """
        create Channel object for storing Channel data. Channel information is given as dictionary.Index of the given channel must be provided
        (see Header.getEmptyChannel() for valid channel dict)
        :param _header_dict:
        Header Dictionary
        """
        try:
           self.label = _channel_dict["label"]
           self.dimension = _channel_dict["dimension"]
           self.physical_max = _channel_dict["physical_max"]
           self.physical_min = _channel_dict["physical_min"]
           self.digital_max = _channel_dict["digital_max"]
           self.digital_min = _channel_dict["digital_min"]
           self.prefilter = prefilter2Dict(_channel_dict["prefilter"])
           self.transducer = _channel_dict["transducer"]
        except:
            raise Exception("invalid Header file structure is given as parameter. (see Channel.getEmptyDict() for valid header dict)")


    @staticmethod
    def getEmptyDict():
        return {'label': '',
                'dimension': '',
                'sample_rate': 0,
                'physical_max': 0,
                'physical_min': 0,
                'digital_max': 0,
                'digital_min': 0,
                'prefilter': "HP:0HZ LP:0HZ N:0HZ",
                'transducer': ''}

