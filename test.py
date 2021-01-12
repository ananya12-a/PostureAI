import cv2
import sys
sys.path.append('build/python')
from openpose import pyopenpose as op

cap = cv2.VideoCapture(0)

cv2.startWindowThread()
cv2.namedWindow("preview")

opWrapper = op.WrapperPython()
opWrapper.configure({"model_pose": "BODY_25"})
opWrapper.start()

datum = op.Datum()
if not cap.isOpened():
    print("Cannot open camera")
    exit()
while True:
    # Capture frame-by-frame
    ret, datum.cvInputData = cap.read()
    # if frame is read correctly ret is True
    if not ret:
        print("Can't receive frame (stream end?). Exiting ...")
        break
    # Our operations on the frame come here
    opWrapper.emplaceAndPop(op.VectorDatum([datum]))
    # Display the resulting frame
    cv2.imshow("OpenPose Test", datum.cvOutputData)
    if cv2.waitKey(1) == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()