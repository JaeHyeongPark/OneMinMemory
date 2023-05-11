<div align="center"">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=85E4F8&height=200&section=header&text=일분추억🏞️&fontSize=60&animation=fadeIn&fontAlignY=38&desc=&descAlignY=51&descAlign=62" /><br/>
</div>

## 📖 목차

- [서비스 목적](#-서비스-목적)
- [개발 기간](#%EF%B8%8F-개발기간)
- [시연영상](#%EF%B8%8F-시연영상click)
- [Team members](#-team-members)
- [기술 스택](#%EF%B8%8F-기술-스택)
- [Architecture](#%EF%B8%8F-architecture)
- [기능](#-기능)
  - [WebCam & 실시간 캔버스 공유](#webcam-실시간-캔버스-공유)
  - [사진 공유 공간](#사진-공유-공간)
  - [캔버스 - 사진편집](#캔버스사진-편집)
  - [권한 버](#권한-버튼)
  - [프리셋](#프리셋-불러오기)
  - [재생목록](#재생목록-편집)
  - [랜더링](#랜더링-하기)
- [포스터](#-포스터)

## 🌐 서비스 목적

> 우리는 여행✈️을 다녀온 뒤, 채팅방에서 사진🏞️을 공유하지만,<br>
> 다운 받은 사진을 다시는 열어보지 않거나,<br>
> 다운 유효기간을 넘겨 사진을 받지 못했던 경험이 있을겁니다.<br>
> 이런 사진을 공유하는 경험을 개선하고<br>
> 소중한 공동의 결과물을 만들기 위해 이 서비스를 기획했습니다!<br>

## 🗓️ 개발기간

### **2023.02.08 ~ 2022.03.10**

## 📽️ 시연영상(click!)
<div align="center">
                   
  [![Video Label](https://user-images.githubusercontent.com/95831345/224591636-5caab4de-b386-4e63-8b76-2060ec28dc7d.png)](https://youtu.be/eZOMo9yXRo8?t=0s)
                   
</div>
<br>

## 👥 Team members

|               권정근                |                   이충일                   |                   박재형                   |                   정병휘                    |                 조 민                 |
| :---------------------------------: | :----------------------------------------: | :----------------------------------------: | :-----------------------------------------: | :-----------------------------------: |
| [Github](https://github.com/nuday1) | [Github](https://github.com/ChoongilLee95) | [Github](https://github.com/JaeHyeongPark) | [Github](https://github.com/Byeonghwijeong) | [Github](https://github.com/cmin0717) |

<br />

## 🛠️ 기술 스택

<p>
    <img height=40px src="https://img.shields.io/badge/express-FFFF00?style=flat&logo=express&logoColor=black"/>
    <img height=40px src="https://img.shields.io/badge/React-61DBFB?style=flat&logo=react&logoColor=white"/>
    <img height=40px src="https://img.shields.io/badge/Redis-ff3333?style=flat&logo=redis&logoColor=white"/>
    <img height=40px src="https://img.shields.io/badge/FFmpeg-8AC502?style=flat&logo=ffmpeg&logoColor=white"/><br/>
    <img height=40px src="https://img.shields.io/badge/Socket.io-000000?style=flat&logo=socket.io&logoColor=white"/>
    <img height=40px src="https://img.shields.io/badge/WebRTC-1aa7ec?style=flat&logo=webrtc&logoColor=white"/>    
    <img height=40px src="https://img.shields.io/badge/NGINX-009A01?style=flat&logo=nginx&logoColor=white"/>
    <img height=40px src="https://img.shields.io/badge/PM2-11054E?style=flat&logo=pm2&logoColor=white"/><br>
    <img height=40px src="https://img.shields.io/badge/GCP%20Instance-4285F4?style=flat&logo=google-cloud&logoColor=white"/>
    <img height=40px src="https://img.shields.io/badge/Amazon%20S3-ffa500?style=flat&logo=Amazon%20S3&logoColor=white"/>
    <img height=40px src="https://img.shields.io/badge/Amazon EC2-FF9900?style=flat&logo=Amazon EC2&logoColor=white"/>
</p>

## ⚙️ Architecture

<div align="center">

![Group 11](https://user-images.githubusercontent.com/95831345/224313445-b516a91d-0778-4894-b526-f49c2e280c02.png)

</div>

<br/>

## ⭐ 기능

- 1️⃣ **실시간 상대방 캠 및 캔버스 공유**
  - WebRTC, Html Canvas, Socket.io
- 2️⃣ **사진 편집 기능 제공**
  - 밝기, 흑백, 선명도, 그리기, 텍스트
- 3️⃣ **공유 재생 목록**
  - 트렌지션, 이펙트 효과, 지속시간 : **동기화(Socket.io)**
  - 미리보기 기능지원

<img width="1500" alt="image" src="https://user-images.githubusercontent.com/95831345/223842480-4346dbf2-8abe-48be-8f24-24702ce84678.png">
<br>

### WebCam & 실시간 캔버스 공유

- SFU 방식의 **WebRTC**기반 화상캠 구현
  - 음성 감지로 인한 이벤트 효과
- 캔버스에서 사진편집작업 실시간 공유 by **Socket.io**

<div align="center">

![2_WebCam](https://user-images.githubusercontent.com/95831345/224086597-091a3061-8063-4ecf-9382-04e5646aae90.gif)

</div>

<br>

### 사진 공유 공간

- 같은 방의 사용자간에 사진 실시간 공유 by **Socket.io**
- 편집된 사진은 분리

<div align="center">

![1_EditBox](https://user-images.githubusercontent.com/95831345/224098674-2ee91246-a941-426c-a755-572b1c6bc95a.gif)

</div>
<br>

### 캔버스(사진 편집)

- Ctrl + Z, Ctrl + Y 기능 : 되돌리기, 취소하기
- 사진효과 적용 : 서버에서 처리
- 그림 그리기 : HTML Canvas
- 저장 : 사진공유공간 Edited 탭으로 이동
<div align="center">

![3_Canvas](https://user-images.githubusercontent.com/95831345/224102262-90de152b-f9cf-4358-80ac-911529d0233f.gif)

</div>
<br>

### 권한 버튼

- 재생목록에 편집권한을 얻기 위한 버튼
- 다른 사용자가 클릭시 빨간색버튼으로 변하며 편집권한을 얻을수 없는 상태가 됨
<div align="center">

![5_lockbutton](https://user-images.githubusercontent.com/95831345/224111963-9e25be72-6473-4e17-bf31-1e37bbdafabd.gif)

</div>
<br>

### 프리셋 불러오기

- 플레이 리스트 권한 얻기 (권한버튼)
- 그 음악에 맞는 프리셋 기능
<div align="center">

![4_Preset](https://user-images.githubusercontent.com/95831345/224110874-d779f896-1971-455b-9a34-c04c8f4b0229.gif)

</div>
<br>

### 재생목록 편집

- 플레이 리스트 권한 얻기 (권한버튼)
- 플레이 리스트 목록은 **Socket.io**를 통해 다른 사람들과 동기화
- 드래그&드롭으로 프리셋에 사진넣기
- 미리 보기 기능
  - 음악과 함께 재생
  - `Spacebar` 클릭으로 중지
- 재생 목록 편집
  - 사진 순서바꾸기
  - 사진 지속시간 조절
  - Transition, Effect 넣기
  <div align="center">

![6_Playlist](https://user-images.githubusercontent.com/95831345/224117327-c01d4090-936d-4bfb-a515-0d55be0821f5.gif)

</div>
<br>

### 랜더링 하기

- 플레이 리스트 권한 반납 (권한버튼)
- `Export 버튼` 클릭후 모든 사용자가 Ready버튼 클릭할때까지 기다리기 by Socket.io
- 랜더링 시작
<div align="center">

![7_Rendering](https://user-images.githubusercontent.com/95831345/224255013-f9213a34-77e8-4c2d-9dfa-3dfe21517b2a.gif)

</div>

## 📝 포스터

<div align="center">

![일분추억_포스터_5](https://user-images.githubusercontent.com/95831345/224260765-eb435b56-0469-4e5f-92e7-1f84b2032301.png)

</div>
