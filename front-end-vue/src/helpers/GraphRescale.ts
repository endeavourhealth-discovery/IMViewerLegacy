export function setTooltips(counts: number[]) {
  const tooltipOptions = {
    callbacks: {
      label: function(t: any, d: any) {
        const realData = counts;
        const label = d.labels[t.index];
        const value = realData[t.index];
        return label + "test:" + value;
      }
    }
  }
  return tooltipOptions;
}

export function rescaleData(data: number[]) {
  const sum = data.reduce((a, b) => a + b, 0);
  const minPercent = 0.5;
  const min = sum * (minPercent / 100);
  const percents = data.map(d => (Math.round((d / sum) * 100)));
  let countZero = 0;
  const modPercents = percents.map(num => {
    if(num === 0) {
      countZero ++;
      return minPercent;
    } else {
      return num;
    };
  });
  modPercents[0] = modPercents[0] - countZero;
  const corrected = modPercents.map(num => num * min);
  console.log(data);
  console.log(sum);
  console.log(min);
  console.log(percents);
  console.log(modPercents);
  console.log(corrected);
  return corrected;
}
