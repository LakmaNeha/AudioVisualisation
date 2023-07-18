export const convertAudioToWaveformPoints = (audioData) => {
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

 export const getOptions = (waveformPoints) => {
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
