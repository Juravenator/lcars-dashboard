const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext);

const preloadList = {
  "blip": "./assets/sounds/computerbeep_15.mp3",
  "denied": "./assets/sounds/computerbeep_73.mp3",
  "system_warning": "./assets/sounds/trekcore/computer/critical.mp3",
};
const soundBuffers: {[key in keyof typeof preloadList]: AudioBuffer | null} = {
  "blip": null,
  "denied": null,
  "system_warning": null,
};

const keys = Object.keys(preloadList) as Array<keyof typeof preloadList>;
for (const name of keys) {
  const req = new XMLHttpRequest();
  req.addEventListener("load", function() {
    audioCtx.decodeAudioData(
      this.response,
      buffer => soundBuffers[name] = buffer,
      err => console.error(`Error with decoding audio data: ${err}`)
    );
  });
  req.responseType = "arraybuffer";
  req.open("GET", preloadList[name]!);
  req.send();
}

let lastOnceSource: AudioBufferSourceNode;
export const playOnce = (name: keyof typeof preloadList) => {
  lastOnceSource && lastOnceSource.stop(0);
  const source = lastOnceSource = audioCtx.createBufferSource();
  const buffer = soundBuffers[name];
  if (buffer) {
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0);
  }
}

let lastForeverSource: AudioBufferSourceNode;
export const playForever = (name: keyof typeof preloadList) => {
    lastForeverSource && lastForeverSource.stop(0);
    const source = lastForeverSource = audioCtx.createBufferSource();
    source.buffer = soundBuffers[name]!;
    source.connect(audioCtx.destination);
    source.loop = true;
    source.start(0);
}

// Fix iOS Audio Context by Blake Kus https://gist.github.com/kus/3f01d60569eeadefe3a1
// Audio needs a link to a user event (like a click) to be allowed to start.
// Hence, we kickstart our audiocontext on the very first user interaction
const fixAudioContext = () => {
  document.removeEventListener('click', fixAudioContext);
  document.removeEventListener('touchstart', fixAudioContext);
  document.removeEventListener('touchend', fixAudioContext);
  const source = lastOnceSource = audioCtx.createBufferSource();
  source.buffer = audioCtx.createBuffer(1, 1, 22050);
  source.connect(audioCtx.destination);
  source.start(0);

}
document.addEventListener('click', fixAudioContext);      // desktop
document.addEventListener('touchstart', fixAudioContext); // iOS
document.addEventListener('touchend', fixAudioContext);   // iOS 9