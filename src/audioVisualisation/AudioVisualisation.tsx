import React, {useState,useEffect} from "react";
import Highcharts, { getOptions } from "highcharts";
import HighchartsReact from "highcharts-react-official";

const AudioVisualisation = () => {

  const [waveformPoints, setWaveformPoints] = useState<Array<any>>([]);
  const [chartOptions, setChartOptions] = useState<any>({});

  const getOptions = () => {
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
      },git add
      series: [
        {
          data: waveformPoints || [],
          lineWidth: 4,
          color: "green",
        },
      ],
    };
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
        console.log('channelData:', channelData);
        const waveformPoints = convertAudioToWaveformPoints(channelData);
        console.log('waveformPoints:', waveformPoints);
        setWaveformPoints(waveformPoints);
      })
      .catch(function (error) {
        console.error("Error decoding audio file:", error);
      });
  };

  useEffect(()=>{
    const options = getOptions();
    setChartOptions(options);
  },[waveformPoints])

  return (
    <div>
      <div>AudioVisualisation</div>
      <input type="file" onChange={handleFileUpload} />
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default AudioVisualisation;
