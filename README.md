# Smart Attendance System using Facial Recognition

## About The Project:
<p align = "justify">
At present, attendance marking involves manual attendance on the paper sheet by professors and teachers, but it is a very time-consuming process and chances of proxy are also an issue that arises in such type of attendance marking. Smart attendance management system is designed to solve the issues of existing manual systems. We have used face recognition concept to mark the attendance of student and make the system better. The system will perform satisfactory in different poses and variations Attendance system will prove to recognize images in different angle and light conditions. The faces which are not in our training dataset will bemarked as unknown. The attendance of recognize images of students will be marked in real time and import to excel sheet and saved by the system automatically. 
</p>

<p align = "justify">
This system has a database with the images of all the students of the class with their details like Name, URN, Email ID, Phone No and Branch. It also has the details of all the subjects with the teachers teaching those subjects. Whenever the teacher uploads the image of the class, the model detects all the faces from the image and checks them with the database for their details and then marks the attendance. The student can login into their portal and then check their attendance. If they have any issue they can raise a query and it will be reported to the teacher. The overall accuracy of this project is 85%. All the data of students is stored in MongoDB.
</p>

This project is divided into 3 phases:

1. Collection of real data and setting images for feature extraction. 
2. Once the real data and images are collected, the model is trained on those images and multiple group images are detected and are checked for the accuracy.
3. The students are recognized from the image and are marked present using the URN alloted to them.
4. The student can now check their attendance from their portal and can raise an issue if there is any mistake.

## Challenges Faced:

1. The major challenge in this project is that there must be atleast 3 images of each student so that the accuracy can be more. So, data collection was a major challenge during the making of this project.
2. The group images taken from a distance with a low quality camera are difficult to recognize. So the images should be taken from a lesser distance with max 15 people in a group, to get maximum accuracy.

## Installation:

To get this project locally on your machine, install the requirements.txt file into your system.

**Step 1**: Open this file in VS Code.

**Step 2**: Create a virtual environment in API folder, by following the steps:

  Install virtual environment in your system:
	
    pip install virtualenv
	
  Create the virtual environment of the name 'env'
		
    python -m virtualenv env
	  
  Activate the virtual environment
		
    .\env\Scripts\activate
	
  On the activation of virtual environment (env) will come in start of the file path

  Install all the packages given in the requirements.txt file using the command. If any extra file is to be installed then install those files individually.
		
    pip install -r requirements.txt

**Step 3**: Run the app.py file to start the model using the command

    python app.py
	
  Run the app.js file to start the website using the command
		
    node app.js

**Step 4**: Now the project will be running on your local machine on the address:
		
    localhost:8000/users/login

## Generating the Student database:

1. The student's images are collected and stored in their respective folder with their URN as folder name and image name.
2. Minimum 3 images of each student is collected and then the model is trained using those images.
3. The images are cropped so that they are of square orientation and are focused on their face.

## Model Training:

1. After adding the individual images of every student, the model is trained.
2. The control is then shifted to app.py file.
3. Here the RetinaFace model extracts the faces of the students and mark 62 facial landmarks on the face.
4. On first time operation, it will take 2 to 3 minutes to train the model after which the model will run fast.

## Face Recognition and Attendance Marking:

1. The teacher after login into their portal will have to upload the image of the students present in the class.
2. This image after upload will be sent to an external API which is created using flask.
3. In the API, every face in the group image is detected by the RetinaFace.extractface() function. 
4. All the extracted images are then aligned and then are compared with the database and then detected by the DeepFace.find() function.
5. The cosine value of the image is calculated by the function and checked. If the cosine value of the face is more than 0.31 then a message "No Match Found" is printed else the URN of student is stored in the list.
6. This list is then sent to the database and the attendance of all the students present is marked.

## Student Login:
<p align = "justify">
Whenever the students will login into the portal, they will be able to see all the subjects and can view their attendance. If they have any issue in the attendance, they can click on the issue button and then the teacher will review the issue and can change the attendance.
  </p>
