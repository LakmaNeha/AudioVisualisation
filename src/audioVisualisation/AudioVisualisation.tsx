import React, { useState, useEffect} from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const AudioVisualisation = () => {
  const [waveformPoints, setWaveformPoints] = useState<Array<any>>([]);
  const [chartOptions, setChartOptions] = useState<any>({});
  const [audioPlayer, setAudioPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1.0);

  const getOptions = () => {
    const generateDownSampledData = () => {
      const originalData = (waveformPoints as any)?.map((point) => [
        point.x,
        point.y,
      ]);
      const desiredDataPoints = 1000;
      const samplingInterval = Math.floor(
        originalData?.length / desiredDataPoints,
      );

      const sampledData: any = [];
      for (let i = 0; i < originalData?.length; i += samplingInterval) {
        sampledData.push(originalData[i]);
      }
      return sampledData;
    };
    return {
      chart: {
        type: "line",  
      },
      title: {
        text: "Waveform",
      },
      xAxis: {
        title: {
          text: "Time",
        },
      },
      yAxis: {
        title: {
          text: "Amplitude",
        },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          data: generateDownSampledData() || [],
          lineWidth: 1,
          color: "green",
        },
      ],
    };
  };

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
  };
}

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioPlayer) {
      audioPlayer.volume = newVolume;
    }
  };

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
  const convertAudioToWaveformPoints = (audioData) => {
    const waveformPoints: any = [];

    for (let i = 0; i < audioData.length; i++) {
      const point = {
        x: i,
        y: audioData[i],
      };
      waveformPoints.push(point);
    }

    return waveformPoints;
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
    const options = getOptions();
    setChartOptions(options);
  }, [waveformPoints]);


  return (
    <div>
      <div>AudioVisualisation</div>
      <input type="file" onChange={handleFileUpload} />
      {audioPlayer && (
        <div>
          <button onClick={isPlaying ? pauseAudio : playAudio}>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      )}
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default AudioVisualisation;
