import easyocr
import argparse
import cv2


def getOCR(url):
    reader = easyocr.Reader(['en'])

    Lresult = reader.readtext(
        url, detail=0, paragraph=True)

    result = ' '.join(Lresult)

    return result
