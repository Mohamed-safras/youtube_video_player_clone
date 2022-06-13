const play__pause = document.querySelector("#play-pause");
const video__container = document.querySelector(".video__container");
const video = document.querySelector("video");
const volume_control = document.querySelector(".volume-control");
const slider = document.querySelector("#slider");
const theater_btn = document.querySelector(".theater-btn");
const full_screen_btn = document.querySelector(".full-screen-btn");
const currenTimeEl = document.querySelector(".current-time");
const totalTimeEl = document.querySelector(".total-time");
const miniPlayerBtn = document.querySelector(".mini-player-btn");
const captions = document.querySelector(".captions-btn");
const speed = document.querySelector(".speed-btn");

play__pause.addEventListener("click", togglePlayPause);
video.addEventListener("click", togglePlayPause);
volume_control.addEventListener("click", toggleMuted);
function toggleMuted() {
  video.muted = !video.muted;
}
slider.addEventListener(
  "input",
  function (e) {
    video.volume = e.target.value;
    video.muted = e.target.value === 0;
  },
  false
);

video.addEventListener("volumechange", () => {
  slider.value = video.volume;
  let volumeLevel;
  if (video.muted || video.volume === 0) {
    slider.value = 0;
    volumeLevel = "muted";
  } else if (video.volume >= 0.5) {
    volumeLevel = "high";
  } else {
    volumeLevel = "low";
  }
  video__container.dataset.volumeBtn = volumeLevel;
});

function togglePlayPause() {
  video.paused ? video.play() : video.pause();
}

video.addEventListener("play", () => {
  video__container.classList.remove("paused");
});
video.addEventListener("pause", () => {
  video__container.classList.add("paused");
});

// keyborad events

document.addEventListener("keydown", (e) => {
  const tagName = document.activeElement.tagName.toLowerCase();
  if (tagName === "input") return;
  switch (e.key.toLowerCase()) {
    case " ":
      if (tagName === "button") return;
    case "k":
      togglePlayPause();
      break;
    case "m":
      toggleMuted();
      break;
    case "i":
      miniplayMode();
      break;
    case "t":
      theaterMode();
      break;
    case "f":
      fulscreenMode();
      break;
    case "c":
      toggleCaptions();
      break;
    case "arrowright":
    case "j":
      skip(5);
      break;
    case "arrowleft":
    case "l":
      skip(-5);
      break;
  }
});

slider.addEventListener("mousemove", function () {
  let value = slider.value * 100;
  slider.style.background = `linear-gradient(
    90deg,
    white ${value}%,
    rgb(122, 122, 122) ${value}%
  )`;
});

const theaterMode = () => {
  video__container.classList.toggle("theater");
};
const fulscreenMode = () => {
  if (document.fullscreenElement == null) {
    video__container.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
video.addEventListener("dblclick", fulscreenMode);

const miniplayMode = () => {
  if (video__container.classList.contains("mini-player")) {
    document.exitPictureInPicture();
  } else {
    video.requestPictureInPicture();
  }
};
document.addEventListener("fullscreenchange", () => {
  video__container.classList.toggle("fullscreen", document.fullscreenElement);
});

video.addEventListener("enterpictureinpicture", () => {
  video__container.classList.add("mini-player");
});

video.addEventListener("leavepictureinpicture", () => {
  video__container.classList.remove("mini-player");
});
theater_btn.addEventListener("click", theaterMode);
full_screen_btn.addEventListener("click", fulscreenMode);
miniPlayerBtn.addEventListener("click", miniplayMode);
const leadingZeroFormat = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});
video.addEventListener("loadeddata", () => {
  totalTimeEl.textContent = formatDuration(video.duration);
});

video.addEventListener("timeupdate", () => {
  currenTimeEl.textContent = formatDuration(video.currentTime);
});

function formatDuration(time) {
  const sec = Math.floor(time % 60);
  const min = Math.floor(time / 60) % 60;
  const hour = Math.floor(time / 3600);

  if (hour === 0) {
    return `${leadingZeroFormat.format(min)}:${leadingZeroFormat.format(sec)}`;
  } else {
    return `${hour}:${leadingZeroFormat.format(min)}:${leadingZeroFormat.format(
      sec
    )}`;
  }
}

// captions
let caption = video.textTracks[0];
caption.mode = "disabled";

captions.addEventListener("click", toggleCaptions);

function toggleCaptions() {
  const isHidden = caption.mode === "disabled";
  caption.mode = isHidden ? "showing" : "disabled";
  video__container.classList.toggle("caption", isHidden);
}

function skip(duration) {
  video.currentTime += duration;
}

// playbackspeed

function playbackSpeed() {
  let newPlaybackSpeed = video.playbackRate + 0.25;
  if (newPlaybackSpeed > 2) newPlaybackSpeed = 0.25;
  video.playbackRate = newPlaybackSpeed;
  speed.textContent = `${newPlaybackSpeed}x`;
}

speed.addEventListener("click", playbackSpeed);
