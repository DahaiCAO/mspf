from pathlib import Path

def createPath(self, path) :
    p = Path(path)
    try:
        p.mkdir()
    except FileExistsError as e:
        print(e)