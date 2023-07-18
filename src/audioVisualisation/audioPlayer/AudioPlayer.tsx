import React, { FC, ReactElement, useState } from "react";

type AudioPlayerProps = {
  volume: number;
  setVolume: (x) => void;
  audioPlayer: any;
};

const AudioPlayer: FC<AudioPlayerProps> = ({
  audioPlayer,
  volume,
  setVolume,
}: AudioPlayerProps): ReactElement => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const playAudio = () => {
    if (audioPlayer) {
      audioPlayer.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioPlayer) {
      audioPlayer.volume = newVolume;
    }
  };

  return (
    <div className="audioPlayer">
      <button onClick={isPlaying ? pauseAudio : playAudio}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div className="inputWrapper">
        {" "}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
        <div>Volume</div>
      </div>
    </div>
  );
};

export default AudioPlayer;
