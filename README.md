# 📥 YouTube Downloader Extension with Backend (yt-dlp + ffmpeg)

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org/)
[![yt-dlp](https://img.shields.io/badge/yt--dlp-CLI-blue?logo=python&logoColor=white)](https://github.com/yt-dlp/yt-dlp)
[![ffmpeg](https://img.shields.io/badge/ffmpeg-Media%20Processing-black?logo=ffmpeg)](https://ffmpeg.org/)
[![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-Enabled-yellow?logo=google-chrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)

This project integrates a Chrome browser extension with a Node.js backend to enable downloading YouTube videos and Shorts in various formats. It uses `yt-dlp` for format extraction and downloading, and `ffmpeg` to merge video/audio streams when necessary.

---

## 📁 Folder Structure

```
/Exe
│
├── content.js              # Injects UI & handles DOM
├── manifest.json           # Chrome Extension manifest
├── server.js               # Node backend using yt-dlp + ffmpeg
├── package.json            # Project dependencies
├── package-lock.json       # NPM lock file
├── node_modules/           # Installed libraries
└── assets/                 # Screenshots and preview images
```

---

## ⚙️ Requirements

Make sure you have the following installed on your system:

- ✅ [Node.js](https://nodejs.org/en) (v14+ recommended)
- ✅ [Python](https://python.org/)
- ✅ [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- ✅ [ffmpeg](https://ffmpeg.org/)

---

## 🧩 Step-by-Step Setup

## ⬇️ How to Clone

Clone this repository to your local machine using:

```bash
git clone https://github.com/rajchaudar/Exe.git
cd Exe
```
##
### 🧩 Step 1: Install Node Dependencies

```bash
npm install
```

---

### 🛠️ Step 2: Install yt-dlp and ffmpeg

#### 🔵 macOS (with Homebrew)

```bash
brew install yt-dlp ffmpeg
```

#### 🟢 Ubuntu / Debian

```bash
sudo apt update
sudo apt install yt-dlp ffmpeg
```

#### 🟣 Windows

**Option 1: Using Scoop**
```bash
scoop install yt-dlp ffmpeg
```

**Option 2: Manual Setup**
1. Download `yt-dlp.exe` from the [yt-dlp GitHub Releases](https://github.com/yt-dlp/yt-dlp/releases)  
2. Download FFmpeg from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)  
3. Extract both and add them to your system `PATH`

---

### 🚀 Step 3: Start the Backend Server

```bash
node server.js
```

🔗 The backend will run at:  
`http://localhost:3000`

---

### 🌐 Step 4: Load the Chrome Extension

1. Open Chrome and visit: `chrome://extensions/`
2. Enable `Developer Mode` (top right)
3. Click `Load unpacked`
4. Select the folder `Exe`

---

### 🎬 Step 5: Use the Extension

1. Open any YouTube video or YouTube Short
2. Click the injected `⬇ Download` button
3. A modal will show available video/audio formats
4. Select your preferred quality
5. Click `Start Download`
6. The backend will fetch the file and return it to your browser

---

## ⚙️ How It Works

### Frontend (`content.js`)
- Injects a “Download” button into the YouTube UI
- Handles user interactions and sends fetch requests
- Displays a modal for format selection

### Backend (`server.js`)
- `/api/formats`: Lists available formats using `yt-dlp`
- `/api/download`: Downloads selected streams
- Merges video/audio using `ffmpeg` if both are selected
- Responds with a `.mp4` file

---

## 🧠 Troubleshooting

| Problem             | Solution                                        |
|---------------------|-------------------------------------------------|
| Button not visible  | Reload page or ensure it's a video page         |
| Download fails      | Check `server.js` is running                    |
| yt-dlp not found    | Make sure it’s in your system `PATH`            |
| ffmpeg errors       | Ensure ffmpeg is correctly installed            |
| CORS error          | Disable browser CORS security (dev-only)        |

---

## ✅ Compatibility

| OS      | Extension | yt-dlp | ffmpeg |
|---------|-----------|--------|--------|
| macOS   | ✅         | ✅      | ✅      |
| Windows | ✅         | ✅      | ✅      |
| Linux   | ✅         | ✅      | ✅      |

---

## 📸 Screenshots

Below are some previews of how the extension and backend UI function:

## Download Button
![Download Button](assets/1.png)
## Modal Preview
![Modal Preview](assets/2.png)
## Select Resolutions
![Select Resolutions](assets/3.png)
## Downloading
![Downloading](assets/4.png)
## Script Logs
![Script Logs](assets/5.png)

---

## ⚠️ Disclaimer

This project is intended for **educational and personal use only**.  
Downloading copyrighted material from YouTube:

- May violate YouTube’s terms of service
- Could be illegal under local copyright laws  
**Use responsibly.**

---

## 👨‍💻 Author

**Shivraj Chaudar**  
GitHub: [@rajchaudar](https://github.com/rajchaudar)

---

## 📬 Got Issues?

Create an issue or pull request at:  
👉 [https://github.com/rajchaudar](https://github.com/rajchaudar)