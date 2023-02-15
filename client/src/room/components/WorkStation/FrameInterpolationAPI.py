import replicate
import requests
import time
start = time.time()

model = replicate.models.get("google-research/frame-interpolation")
version = model.versions.get("4f88a16a13673a8b589c18866e540556170a5bcb2ccdc12de556e800e9456d3d")


    # https://replicate.com/google-research/frame-interpolation/versions/4f88a16a13673a8b589c18866e540556170a5bcb2ccdc12de556e800e9456d3d#input
inputs = {
    # The first input frame
    'frame1' : open("/Users/johnp/Documents/KJ_final_project/images/KakaoTalk_Photo_2023-02-07-00-41-41 001.jpeg", "rb"),

    # The second input frame
    'frame2': open("/Users/johnp/Documents/KJ_final_project/images/KakaoTalk_Photo_2023-02-07-00-41-41 008.jpeg", "rb"),

    # Controls the number of times the frame interpolator is invoked If
    # set to 1, the output will be the sub-frame at t=0.5; when set to >
    # 1, the output will be the interpolation video with
    # (2^times_to_interpolate + 1) frames, fps of 30.
    # Range: 1 to 8
    'times_to_interpolate': 3,
}

# https://replicate.com/google-research/frame-interpolation/versions/4f88a16a13673a8b589c18866e540556170a5bcb2ccdc12de556e800e9456d3d#output-schema
output = version.predict(**inputs)
print(output)
# path = "/Users/johnp/Documents/KJ_final_project/videos"
response = requests.get(output)
open("output_practice.mp4", "wb").write(response.content)
# 저장 경로: "/Users/johnp/Documents"
end = time.time()
print(end-start)