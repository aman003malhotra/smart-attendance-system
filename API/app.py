from flask import Flask
from deepface import DeepFace
from retinaface import RetinaFace
import matplotlib.pyplot as plt
from flask import request, render_template
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
from deepface.basemodels import VGGFace
from PIL import Image
from numpy import asarray


model = VGGFace.loadModel()

app = Flask(__name__)

@app.route("/")
def hello():
  return "Hello World!"


@app.route("/sampletext", methods=["GET", "POST"])
def text():
   data = request.get_data()
   print(data.sampletext)
   return data

@app.route("/predict", methods=["GET", "POST"])
def predict():
   if request.method == 'POST':
      f = request.files['image']
      img = Image.open(f)
      numpydata = asarray(img)
      # to save the file in the same folder
      # f.save(secure_filename(f.filename))
      faces = RetinaFace.extract_faces(numpydata, align=True)
      print("There are ", len(faces), " faces in the image")
      for face in faces:
        # plt.imshow(face)
        # plt.axis('off')
        # plt.show()
        df = DeepFace.find(face, db_path = "./static/jpg2", enforce_detection=False, distance_metric='cosine', model = model, model_name='VGG-Face')
        df = df.rename(columns = {'VGG-Face_cosine':'distance'})
        if df.shape[0] > 0:
            matched = df.iloc[0].identity
            cosine = df.iloc[0].distance
            if(cosine < 0.31):
                print(matched)
            else:
                print("No Match Found")
            print(cosine)
            print("------------------------\n")
        print("------------------------")
      return str(len(faces))


if __name__ == "__main__":
  app.run()

