from fastapi import FastAPI
from fastapi.responses import JSONResponse, HTMLResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import numpy as np
import io
import json
import requests
from transformers import VisionEncoderDecoderModel, ViTFeatureExtractor, AutoTokenizer
import torch
import easyocr
from PIL import Image

# Load models and tokenizer
model = VisionEncoderDecoderModel.from_pretrained(
    "nlpconnect/vit-gpt2-image-captioning")
feature_extractor = ViTFeatureExtractor.from_pretrained(
    "nlpconnect/vit-gpt2-image-captioning")
tokenizer = AutoTokenizer.from_pretrained(
    "nlpconnect/vit-gpt2-image-captioning")

if torch.cuda.is_available():
    print("Using CUDA")
else:
    print("Not using CUDA")


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model.to(device)

max_length = 16
num_beams = 4
gen_kwargs = {"max_length": max_length, "num_beams": num_beams}


def predict_step(image):
    images = []
    #response = requests.get(image_url)
    #image = Image.open(io.BytesIO(response.content))
    if image.mode != "RGB":
        image = image.convert(mode="RGB")
    images.append(image)

    pixel_values = feature_extractor(
        images=images, return_tensors="pt").pixel_values
    pixel_values = pixel_values.to(device)

    output_ids = model.generate(pixel_values, **gen_kwargs)

    preds = tokenizer.batch_decode(output_ids, skip_special_tokens=True)
    preds = [pred.strip() for pred in preds]
    return preds[0]


reader = easyocr.Reader(['en'])


def getOCR(url):
    Lresult = reader.readtext(
        url, detail=0, paragraph=True)

    result = ' '.join(Lresult)

    return result


app = FastAPI(title="Image Captioning API",
              description="An API for generating captions for images.")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ImageRequest(BaseModel):
    url: str


class ImageCaption(BaseModel):
    url: str
    caption: str
    ocr: str


@app.post("/predict/", response_model=list[ImageCaption])
def predict(image_request: list[ImageRequest]):
    captions = []

    for item in image_request:
        image_url = item.url
        response = requests.get(image_url)

        try:
            image = Image.open(io.BytesIO(response.content))
            cv_im = cv2.cvtColor(
                np.array(image), cv2.COLOR_RGB2BGR)

        except:
            print("Error")
            continue

        print("Image URL:", image_url)

        caption = predict_step(image)
        ocr = getOCR(cv_im)

        caption_entry = ImageCaption(url=image_url, caption=caption, ocr=ocr)
        captions.append(caption_entry)

        print("\nCaption:", caption)
        print("OCR:", ocr)
        print()

    return captions

# Redirect the user to the documentation


@app.get("/", include_in_schema=False)
def index():
    return RedirectResponse(url="/docs")
