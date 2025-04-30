(function () {
    let videoUrl = null;
  
    function injectDownloadUI() {
      if (document.getElementById('yt-download-btn')) return;
  
      let target = document.querySelector('#top-level-buttons-computed');
      if (!target && location.pathname.startsWith('/shorts/')) {
        target = document.querySelector('ytd-reel-player-header-renderer #menu');
      }
      if (!target) return;
  
      // Create download button
      const btn = document.createElement('button');
      btn.id = 'yt-download-btn';
      btn.innerText = '⬇ Download';
      btn.style.cssText = `
        background: rgba(207, 207, 207, 0.33);
        backdrop-filter: blur(10px);
        padding: 8px 14px;
        margin-left: 8px;
        border-radius: 18px;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid rgb(237, 18, 18);
        font-size: 14px;
        color: black;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.63);
        box-shadow: 0 4px 20px rgb(255, 255, 255);
        transition: transform 0.2s ease;
      `;
      btn.onmouseover = () => (btn.style.transform = 'scale(1.05)');
      btn.onmouseleave = () => (btn.style.transform = 'scale(1)');
  
      target.appendChild(btn);
  
      // Modal
      const modal = document.createElement('div');
      modal.id = 'download-modal';
      modal.style.cssText = `
        display:none; position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.4); z-index:99999; justify-content:center; align-items:center;
      `;
      modal.innerHTML = `
        <div style="
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          padding: 24px;
          border-radius: 16px;
          width: 340px;
          position: relative;
          color: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
        ">
          <button id="close-modal" style="position:absolute; right:12px; top:10px; border:none; font-size:22px; cursor:pointer; background:none; color:white;">&times;</button>
          <h3 style="margin-bottom:14px; font-weight:600; font-size:18px;">Download This Video</h3>
          <label style="display:block; margin-bottom:6px;">🎞 Video Quality</label>
          <select id="video-select" style="width:100%;margin-bottom:14px;padding:6px;border-radius:8px;border:none;">
            <option>Loading...</option>
          </select>
          <label style="display:block; margin-bottom:6px;">🎧 Audio Quality</label>
          <select id="audio-select" style="width:100%;margin-bottom:16px;padding:6px;border-radius:8px;border:none;">
            <option>Loading...</option>
          </select>
          <button id="start-download" style="
            width: 100%;
            padding: 10px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            color: white;
            cursor: pointer;
            font-weight: 600;
            transition: transform 0.2s ease;
          ">⬇ Start Download</button>
          <div id="status-message" style="text-align:center; margin-top:12px; font-weight:500;"></div>
        </div>
      `;
      document.body.appendChild(modal);
  
      // Show modal and fetch formats when clicked
      btn.onclick = async () => {
        document.getElementById('download-modal').style.display = 'flex';
        document.getElementById('status-message').textContent = '';
        document.getElementById('video-select').innerHTML = `<option>Loading...</option>`;
        document.getElementById('audio-select').innerHTML = `<option>Loading...</option>`;
        await fetchAndPopulateFormats();
      };
  
      // Close modal
      document.getElementById('close-modal').onclick = () => {
        document.getElementById('download-modal').style.display = 'none';
      };
  
      // Start download
      document.getElementById('start-download').onclick = () => {
        const videoFormatId = document.getElementById('video-select').value || null;
        const audioFormatId = document.getElementById('audio-select').value || null;
        const statusMsg = document.getElementById('status-message');
        const btn = document.getElementById('start-download');
  
        if (!videoFormatId && !audioFormatId) {
          alert('Please select at least one format');
          return;
        }
  
        btn.disabled = true;
        btn.textContent = '⬇ Downloading...';
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
  
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/api/download', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'blob';
  
        xhr.onload = () => {
          if (xhr.status === 200) {
            const blob = xhr.response;
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'video.mp4';
            a.click();
            statusMsg.textContent = '✅ Download complete!';
          } else {
            statusMsg.textContent = '❌ Download failed.';
          }
          btn.disabled = false;
          btn.textContent = '⬇ Start Download';
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';
        };
  
        xhr.onerror = () => {
          statusMsg.textContent = '❌ Network error.';
          btn.disabled = false;
          btn.textContent = '⬇ Start Download';
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';
        };
  
        xhr.send(JSON.stringify({ videoUrl, videoFormatId, audioFormatId }));
      };
    }
  
    async function fetchAndPopulateFormats() {
      try {
        videoUrl = location.href.split('&')[0];
        const res = await fetch('http://localhost:3000/api/formats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoUrl }),
        });
        const formats = await res.json();
  
        const videoSelect = document.getElementById('video-select');
        const audioSelect = document.getElementById('audio-select');
        videoSelect.innerHTML = '';
        audioSelect.innerHTML = '';
  
        formats.filter(f => f.type === 'video-only').forEach(f => {
          const opt = document.createElement('option');
          opt.value = f.format_id;
          opt.textContent = `${f.resolution} - ${f.note}`;
          videoSelect.appendChild(opt);
        });
  
        formats.filter(f => f.type === 'audio-only').forEach(f => {
          const opt = document.createElement('option');
          opt.value = f.format_id;
          opt.textContent = `${f.resolution} - ${f.note}`;
          audioSelect.appendChild(opt);
        });
      } catch (err) {
        document.getElementById('status-message').textContent = '⚠️ Failed to fetch formats.';
      }
    }
  
    const observer = new MutationObserver(() => {
      if (document.querySelector('#top-level-buttons-computed') || location.pathname.startsWith('/shorts/')) {
        injectDownloadUI();
      }
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  
    let lastUrl = location.href;
    setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(injectDownloadUI, 1000);
      }
    }, 1000);
  })();