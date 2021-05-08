from quart import Quart, flash, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
import os
from Functions import analyse_video
import redis_main
import cv2
import json
import time
from uuid import uuid4 as uuid
from redis_main import create_submissionTable_entry, getUserId
import asyncio
from concurrent.futures import ProcessPoolExecutor

executor = ProcessPoolExecutor(max_workers=5)

UPLOAD_FOLDER = 'video_uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png','mp4'}
print('upload imported')
app = Quart(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyse_sync(filepath, exercise, orientation):
    cap = cv2.VideoCapture(filepath)
    print(filepath, cap)
    fps = cap.get(cv2.CAP_PROP_FPS)      
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(fps, frame_count)
    duration = frame_count/fps

    keypoints = analyse_video_sync(cap, exercise, orientation)['keypoints']
    
    user = 'c'
    submission_id = str(uuid())

    print (list(keypoints))
    os.makedirs(os.path.join('volt', 'data/' + user + '/' + submission_id))
    with open('volt/data/' + user + '/' + submission_id +'/keypoints.json', 'w') as outfile:
        json.dump(list(keypoints), outfile)
    create_submissionTable_entry(str(exercise), user, id = submission_id, orientation = "front", seconds_analysed = duration, keypoints = 'data/' + user + '/'  + submission_id +'/keypoints.json')

async def analyse(filepath, exercise, orientation):
    cap = cv2.VideoCapture(filepath)
    print(filepath, cap)
    fps = cap.get(cv2.CAP_PROP_FPS)      
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(fps, frame_count)
    duration = frame_count/fps

    task = await analyse_video(cap, exercise, orientation)
    keypoints = task['keypoints']
    #print (await asyncio.gather(task))
    
    user = 'c'
    submission_id = str(uuid())

    #print (list(keypoints))
    os.makedirs(os.path.join('volt', 'data/' + user + '/' + submission_id))
    with open('volt/data/' + user + '/' + submission_id +'/keypoints.json', 'w') as outfile:
        json.dump(list(keypoints), outfile)
    print("hello")
    create_submissionTable_entry(str(exercise), user, id = submission_id, orientation = "front", seconds_analysed = duration, keypoints = 'data/' + user + '/'  + submission_id +'/keypoints.json')

@app.route('/upload-image', methods=['GET', 'POST'])
async def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in await request.files:
            flash('No file part')
            return redirect(request.url)
        file = (await request.files)['file']
        print(file)
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            await analyse(UPLOAD_FOLDER+'/' + filename, "squat",'side')
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
async def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],filename)


if __name__ == '__main__':
    app.run(debug = True)