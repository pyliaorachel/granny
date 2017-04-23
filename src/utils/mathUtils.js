// Improvement in emotions, calculated via the pooled standard deviation formula in pg2 of:
// https://www.uv.es/~friasnav/EffectSizeBecker.pdf

const getEmotionChange = (emotionStart, emotionEnd) => {

  const a = emotionStart.length; // number of starting data points
  const b = emotionEnd.length;   // number of ending data points
  let i = 0;
  let meanStart = 0;       
  let meanEnd = 0;
  let stDevStart = 0;
  let stDevEnd = 0;

  // Get the mean of the starting data points and mean of the ending data points
  for (i=0 ; i<a ; i++){
    meanStart += emotionStart[i];
  }
  meanStart /= a;
  for (i=0 ; i<b ; i++){
    meanEnd += emotionEnd[i];
  }
  meanEnd /= b;

  // Get the standard deviations of the starting data points and ending data points
  // Then use them to calculate change in emotion between Starting and Ending data sets
  for (i=0 ; i<a ; i++){
    stDevStart += Math.pow(emotionStart[i] - meanStart, 2);
  }
  stDevStart = Math.sqrt(stDevStart/a);
  for (i=0 ; i<b ; i++){
    stDevEnd += Math.pow(emotionEnd[i] - meanEnd, 2);
  }
  stDevEnd = Math.sqrt(stDevEnd/b);

  return (meanEnd - meanStart) / (Math.sqrt( ( Math.pow(stDevEnd,2) + Math.pow(stDevStart,2) ) / 2 ));

}

module.exports = {
  getEmotionChange
};
