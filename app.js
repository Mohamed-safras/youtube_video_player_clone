const video_continer = document.querySelector(".video_continer");
const play_pause_btn = document.querySelector(".play_pause");
const video = document.querySelector("video");
const slider = document.querySelector("#volume-range");
const volumeBtn = document.querySelector(".volume-btn");
const currentTimeEl = document.querySelector("#current-time");
const totalTimeEl = document.querySelector("#total-time"),
  progress_bar = document.querySelector(".progress_bar"),
  progress = document.querySelector(".progress");
const soundProgress = document.querySelector(".progress-input");
const video_lists = document.querySelector(".video_lists");
const btn_next = document.querySelector("#btn_next");
const screen_btn = document.querySelector(".screen_btn");
const controlsBtn = document.querySelectorAll(".controls button");
const settingsBtn = document.querySelector("[data-label=Settings]");
const mini_btn = document.querySelector("#mini_player");
const tag = document.querySelector(".tag");
const current_video_position = document.querySelector(
  "#current_video_position"
);
const total_video = document.querySelector("#total_video");

const [play_or_pause, next_btn, mute_or_unmute] = controlsBtn;

import video_data from "./data.js";

let currentVideo = 0;

let playPromise = video.play();

if (playPromise !== undefined)
  playPromise
    .then((__) => {
      // Automatic playback started!
      // Show playing UI.
      video.play();
    })
    .catch((error) => {
      // Auto-play was prevented
      // Show paused UI.
      video.pause();
    });

const formatNumber = new Intl.NumberFormat("en-IN", {
  minimumIntegerDigits: 2,
});

const formatTime = (time) => {
  const hour = Math.floor(time / 3600);
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);

  if (hour < 1) {
    return `${formatNumber.format(min)}:${formatNumber.format(sec)}`;
  } else {
    return `${formatNumber.format(hour)}:${formatNumber.format(
      min
    )}:${formatNumber.format(sec)}`;
  }
};

const play_pause = () => (video.paused ? video.play() : video.pause());

play_pause_btn.addEventListener("click", play_pause);
video.addEventListener("click", play_pause);
video.addEventListener("play", () => {
  video_continer.classList.remove("paused");
  play_or_pause.dataset.label = "Pause (K)";
});

video.addEventListener("pause", () => {
  video_continer.classList.add("paused");
  play_or_pause.dataset.label = "Play (K)";
  // console.log(controlsBtn.dataset.label);
});

video.addEventListener(
  "loadeddata",
  () => (totalTimeEl.textContent = formatTime(video.duration))
);

video.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(video.currentTime);
  progress.style.width = `${(video.currentTime / video.duration) * 100}%`;
  video?.ended && nextVideo();
});

volumeBtn.addEventListener("click", toggleVolume);

function toggleVolume() {
  video.muted = !video.muted;
  video.muted
    ? (mute_or_unmute.dataset.label = "Unmute(m)")
    : (mute_or_unmute.dataset.label = "Mute(m)");
}

slider.addEventListener(
  "input",
  (e) => {
    video.volume = e.target.value;
    video.muted = e.target.value === 0;
    soundProgress.style.width = `${e.target.value * 100}%`;
  },
  false
);

video.addEventListener("volumechange", () => {
  let type;
  slider.value = video.volume;
  if (video.muted || video.volume === 0) {
    type = "mute";
    slider.value = 0;
  } else if (video.volume < 0.5) {
    type = "low";
  } else type = "high";
  video_continer.dataset.volumeBtn = type;
});

progress_bar.addEventListener("click", changeCurrentTime);

function changeCurrentTime(e) {
  const progressWidth = progress_bar.clientWidth;
  const currentWidth = e.offsetX;
  video.currentTime = (currentWidth / progressWidth) * video.duration;
}

const changeVideo = (currentSong) => {
  video.src = `./src/video/${video_data[currentSong].video}`;
};

const displayVideo = function () {
  const items = video_data
    .map(({ title, tumblrImage, id, youtubecannel }, index) => {
      return `<li class="video_list" data-id=${id}>
      <div class="video_list_left">
        <div class="order">
          <span></span>
        </div>
        <div class="video_tumnail">
          <img src="./src/image/${tumblrImage}" alt="" />
        </div>
      </div>
      <div class="video_details">
        <h4>${title.length > 50 ? title.substring(0, 100) + "..." : title}</h4>
        <p class="category">${youtubecannel}</p>
      </div>
    </li>`;
    })
    .join("");
  video_lists.insertAdjacentHTML("afterbegin", items);
};
displayVideo();

function nextVideo() {
  currentVideo === video_data.length - 1 ? (currentVideo = 0) : currentVideo++;
  changeVideo(currentVideo);
  activeList(currentVideo);
  video.play();
}

btn_next.addEventListener("click", nextVideo);

/**/
window.addEventListener("load", () => {
  total_video.textContent = video_data.length;
  changeVideo(currentVideo);
  activeList(currentVideo);
});

const video_tumnail = document.querySelectorAll(".video_tumnail");

function changeThumbnail(e, ishoverd) {
  const id = +e.target.closest(".video_list").dataset.id - 1;
  const [img] = e.target.children;
  ishoverd
    ? (img.src = "./src/image/" + video_data[id]?.tumbnail)
    : (img.src = "./src/image/" + video_data[id]?.tumblrImage);
}

video_tumnail.forEach((item) => {
  item.addEventListener("mouseenter", (e) => changeThumbnail(e, true));
  item.addEventListener("mouseleave", (e) => changeThumbnail(e, false));
});

const video_list = document.querySelectorAll(".video_list");
const order = document.querySelectorAll(".order span");

function activeList(id) {
  current_video_position.textContent = currentVideo + 1;
  video_list.forEach((item) => {
    item.classList.remove("active");
  });
  video_list[id].classList.add("active");
  order.forEach((item, index) => {
    index !== currentVideo
      ? (item.innerHTML = index + 1)
      : (item.innerHTML = `
              <svg
                  class="play"
                  height="100%"
                  version="1.1"
                  viewBox="0 0 36 36"
                  width="100%"
                >
                  <use class="ytp-svg-shadow" xlink:href="#ytp-id-46"></use>
                  <path
                    class="ytp-svg-fill"
                    d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"
                    id="ytp-id-46"
                  ></path>
              </svg>`);
  });
}

video_lists.addEventListener("click", (e) => {
  const target = e.target;
  const closest = target.closest(".video_list").dataset.id - 1;
  currentVideo = Number.parseInt(closest);
  activeList(currentVideo);
  changeVideo(currentVideo);
  video.play();
});

document.addEventListener("fullscreenchange", () => {
  video_continer.classList.toggle("fullscreen", document.fullscreenElement);
});

// document.addEventListener("enterpictureinpicture", () => {});

screen_btn.addEventListener("click", changeScreen);
video.addEventListener("dblclick", changeScreen);

function changeScreen() {
  if (document.fullscreenElement == null) {
    video_continer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

const miniplayMode = () => {
  if (video_continer.classList.contains("mini-player")) {
    document.exitPictureInPicture();
  } else {
    video.requestPictureInPicture();
  }
};
video.addEventListener("enterpictureinpicture", () => {
  video_continer.classList.add("mini-player");
});

video.addEventListener("leavepictureinpicture", () => {
  video_continer.classList.remove("mini-player");
});
mini_btn.addEventListener("click", miniplayMode);

controlsBtn.forEach((item) => {
  item.addEventListener("mouseenter", (e) => {
    const target = e.target;

    target.setAttribute("data-label", target.dataset.label);

    target.dataset.label === "undefined"
      ? target.classList.remove("show_label")
      : target.classList.add("show_label");
  });
  item.addEventListener("mouseleave", (e) => {
    e.target.classList.remove("show_label");
  });
});
