const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Get formats
app.post('/api/formats', (req, res) => {
  const url = req.body.videoUrl;
  exec(`yt-dlp -j "${url}"`, (err, stdout) => {
    if (err) return res.status(500).send("Failed to fetch formats");

    try {
      const json = JSON.parse(stdout);
      const formats = json.formats
        .filter(f => f.vcodec !== 'none' || f.acodec !== 'none')
        .map(f => ({
          format_id: f.format_id,
          resolution: f.height ? `${f.height}p` : 'audio',
          note: f.format_note || `${f.ext} ${f.vcodec || ''} ${f.acodec || ''}`.trim(),
          type: f.vcodec === 'none' ? 'audio-only' : (f.acodec === 'none' ? 'video-only' : 'video+audio')
        }));

      formats.sort((a, b) => {
        const rA = parseInt(a.resolution) || (a.resolution === 'audio' ? -1 : 0);
        const rB = parseInt(b.resolution) || (b.resolution === 'audio' ? -1 : 0);
        return rA - rB;
      });

      res.json(formats);
    } catch (e) {
      console.error("Parse error:", e);
      res.status(500).send("Parsing error");
    }
  });
});

// Download with selected video/audio formats
app.post('/api/download', (req, res) => {
  const { videoUrl, videoFormatId, audioFormatId } = req.body;
  const outputPath = path.join(__dirname, 'video.mp4');

  let formatString = '';
  if (videoFormatId && audioFormatId) {
    formatString = `${videoFormatId}+${audioFormatId}`;
  } else if (videoFormatId) {
    formatString = `${videoFormatId}`;
  } else if (audioFormatId) {
    formatString = `${audioFormatId}`;
  } else {
    return res.status(400).send("No format selected");
  }

  const command = `yt-dlp -f "${formatString}" -o "${outputPath}" --merge-output-format mp4 "${videoUrl}"`;
  console.log("Running command:", command);

  const child = exec(command);

  child.stderr.on('data', data => console.log(`stderr: ${data}`));
  child.stdout.on('data', data => console.log(`stdout: ${data}`));

  child.on('close', code => {
    if (code === 0) {
      res.download(outputPath, 'video.mp4', () => {
        fs.unlinkSync(outputPath);
      });
    } else {
      res.status(500).send("Download failed");
    }
  });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));