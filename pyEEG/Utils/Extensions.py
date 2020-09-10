import pyedflib


def importEdf(path):
    f = None
    try:
        f = pyedflib.EdfReader(path)
    except:
        pyedflib.EdfReader(path).close()
        f = pyedflib.EdfReader(path)
    return f