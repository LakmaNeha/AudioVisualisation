import React from "react";

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
    decodeAudioFile(file);
  };

  return (
    <div>
      <div>AudioVisualisation</div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default AudioVisualisation;
