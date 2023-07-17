import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const AudioVisualisation = () => {
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    console.log(file, "##file");
    decodeAudioFile(file)
      .then((decodedAudioData) => {
        console.log("Audio file decoded:", decodedAudioData);
      })
      .catch(function (error) {
        console.error("Error decoding audio file:", error);
      });
  };

  return (
    <div>
      <div>AudioVisualisation</div>
      <input type="file" onChange={handleFileUpload} />
      <HighchartsReact highcharts={Highcharts} options={{}} />
    </div>
  );
};

export default AudioVisualisation;
