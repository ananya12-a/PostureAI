from flask import Flask, flash, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
import os
from Functions import analyse_video, squatSideView, get_exercise_function
import redis_main
import cv2
import json
import time
from redis_main import create_submissionTable_entry, getUserId

UPLOAD_FOLDER = 'video_uploads'
ALLOWED_EXTENSIONS = {'mp4', 'mov'}
print('upload imported')
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyse(filepath, exercise, orientation):
    cap = cv2.VideoCapture(filepath)
    print(filepath, cap)
    fps = cap.get(cv2.CAP_PROP_FPS)      
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(fps, frame_count)
    duration = frame_count/fps

    keypoints = analyse_video_sync(cap, exercise, orientation)['keypoints']
    
    user = 'c'
    current_time = str(int(time.time()))

    print (list(keypoints))
    os.makedirs(os.path.join('volt', 'data/' + user + '/' + current_time))
    with open('volt/data/' + user + '/' + current_time +'/keypoints.json', 'w') as outfile:
        json.dump(list(keypoints), outfile)
    create_submissionTable_entry(str(exercise), user, getUserId(user), orientation = "front", seconds_analysed = duration, keypoints = 'data/' + user + '/'  + current_time +'/keypoints.json')

@app.route('/upload-test', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        print(file)
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            analyse_sync(UPLOAD_FOLDER+'/' + filename, "squat",'side')
            return redirect(url_for('uploaded_file',
                                    filename=filename))
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

@app.route('/video_uploads/<filename>', methods=['GET', 'POST'])
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],filename)



"""@app.route('/schedule', methods=['POST', 'GET'])
def home():
    error = None
    if request.method == 'POST':
        os.mkdir(os.path.join("video_uploads", ))
        request.form['filepath']
        
    return render_template('index.html', error=error)"""
if __name__ == '__main__':
    app.run(debug = True)