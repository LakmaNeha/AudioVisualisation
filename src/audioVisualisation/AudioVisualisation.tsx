import React from "react";

const AudioVisualisation = () => {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    console.log(file, "##git addfile");
  };

  return (
    <div>
      <div>AudioVisualisation</div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default AudioVisualisation;
