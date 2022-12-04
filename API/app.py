from flask import Flask
from deepface import DeepFace
from retinaface import RetinaFace
import matplotlib.pyplot as plt
from flask import request, make_response, jsonify
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
from deepface.basemodels import VGGFace
from PIL import Image
from numpy import asarray

from flask_cors import CORS

model = VGGFace.loadModel()

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
  
  data = "hello world"
  return jsonify({'data': data}), 201


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
      faces = RetinaFace.extract_faces(numpydata, align=True)
      print("There are ", len(faces), " faces in the image")
      list_of_students = []
      cosine_check = {}
      # if(len(faces) == 0):
      #       print(list_of_students)
      #       data={"number":list_of_students}
      #       return jsonify(data) 
      for face in faces:
        df = DeepFace.find(face, db_path = "./static/jpg2", enforce_detection=False, distance_metric='cosine', model = model, model_name='VGG-Face')
        df = df.rename(columns = {'VGG-Face_cosine':'distance'})
        if df.shape[0] > 0:
            matched = df.iloc[0].identity
            cosine = df.iloc[0].distance
            string = matched
            string = string.encode("unicode_escape")
            string = string[15:22]
            string = string.decode()
            if(cosine < 0.298):
              print(matched)
              if(string not in cosine_check.keys()):
                    cosine_check[string] = cosine
                    list_of_students.append(string)
              if(cosine_check[string] >= cosine):
                cosine_check[string] = cosine
              # else:
              #   print("No Match Found")
            # else:
                # print("No Match Found")
            # print(cosine)
            # print("URN: ",string)
            # print("------------------------\n")
        # print("------------------------")
      print(list_of_students)
      data={"number":list_of_students}
      return jsonify(data)


if __name__ == "__main__":
  app.run()

