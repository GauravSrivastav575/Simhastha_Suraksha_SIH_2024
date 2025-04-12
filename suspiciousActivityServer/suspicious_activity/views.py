from django.shortcuts import render
from django.http import StreamingHttpResponse
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from collections import deque


def crime_detection_stream():
    print('hitteddd.....')

    model = load_model('crime-(a)15.h5')
    video_capture = cv2.VideoCapture('http://192.168.79.18:4747/video')

    if not video_capture.isOpened():
        return StreamingHttpResponse("Error: Could not open webcam.", content_type="text/plain")

    frame_buffer = deque(maxlen=150)
    crime_clip_count = 0
    video_writer = None
    fps = int(video_capture.get(cv2.CAP_PROP_FPS))
    frame_width = int(video_capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(video_capture.get(cv2.CAP_PROP_FRAME_HEIGHT))

    def preprocess_and_predict(frame):
        resized_frame = cv2.resize(frame, (224, 224))
        processed_frame = np.expand_dims(np.array(resized_frame, dtype='float32') / 255.0, axis=0)
        predictions = model.predict(processed_frame)
        return "Crime" if np.mean(predictions) > 0.5 else "Non-Crime"

    def generate_frames():
        nonlocal video_writer, crime_clip_count

        while True:
            ret, frame = video_capture.read()
            if not ret:
                break

            prediction = preprocess_and_predict(frame)

            if prediction == "Crime":
                if video_writer is None:
                    crime_clip_count += 1
                    output_path = f"crime_clips/crime_clip_{crime_clip_count}.mp4"
                    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
                    video_writer = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

                for buffered_frame in list(frame_buffer):
                    video_writer.write(buffered_frame)

                frame_buffer.clear()
            elif video_writer is not None:
                video_writer.release()
                video_writer = None

            frame_buffer.append(frame)

            label = f"Prediction: {prediction}"
            color = (0, 0, 255) if prediction == "Crime" else (0, 255, 0)
            cv2.putText(frame, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

            _, jpeg_frame = cv2.imencode('.jpg', frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg_frame.tobytes() + b'\r\n')

        video_capture.release()
        if video_writer:
            video_writer.release()

    return StreamingHttpResponse(generate_frames(), content_type='multipart/x-mixed-replace; boundary=frame')
