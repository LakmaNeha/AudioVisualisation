import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { convertAudioToWaveformPoints, getOptions } from "./helpers";
import AudioPlayer from "./audioPlayer/AudioPlayer";

import "./AudioVisualisation.css";


const AudioVisualisation = () => {
  const [waveformPoints, setWaveformPoints] = useState<Array<any>>([]);
  const [chartOptions, setChartOptions] = useState<any>({});
  const [audioPlayer, setAudioPlayer] = useState<any>(null);
  const [volume, setVolume] = useState<number>(1.0);

  const decodeAudioFile = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = function () {
        const arrayBuffer: any = this.result;
        const audioContext = new window.AudioContext();

        audioContext.decodeAudioData(
          arrayBuffer,
          (decodedAudioBuffer) => {
            console.log(decodedAudioBuffer, "#decodedAudioBuffer");
            const audioPlayer = new Audio();
            audioPlayer.src = URL.createObjectURL(file);
            audioPlayer.volume = volume;
            setAudioPlayer(audioPlayer);
            resolve(decodedAudioBuffer);
          },
          (error) => {
            reject(error);
          },
        );
      };

      fileReader.onerror = function (error) {
        reject(error);
      };

      fileReader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    console.log(file, "##file");
    decodeAudioFile(file)
      .then((decodedAudioData) => {
        console.log("Audio file decoded:", decodedAudioData);
        const channelData = (decodedAudioData as any).getChannelData(0);
        console.log("channelData:", channelData);
        const waveformPoints = convertAudioToWaveformPoints(channelData);
        console.log("waveformPoints:", waveformPoints);
        setWaveformPoints(waveformPoints);
      })
      .catch(function (error) {
        console.error("Error decoding audio file:", error);
      });
  };

  useEffect(() => {
    const options = getOptions(waveformPoints);
    setChartOptions(options);
  }, [waveformPoints]);

  return (
    <div className="audioVisualisationApp">
      <h1>AudioVisualisation</h1>
      <div className="audioInput">
        <div>Please upload an audio file here.</div>
        <input type="file" onChange={handleFileUpload} />
      </div>
      {audioPlayer && (
        <AudioPlayer
          volume={volume}
          setVolume={setVolume}
          audioPlayer={audioPlayer}
        />
      )}
      <div className="highchart">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};

export default AudioVisualisation;
