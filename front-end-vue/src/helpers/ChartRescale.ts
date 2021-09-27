export function setTooltips(counts: number[]): { callbacks: { label(t: any, d: any): string } } {
  const tooltipOptions = {
    callbacks: {
      label: function(t: any, d: any) {
        const realData = counts;
        const label = d.labels[t.index];
        const value = realData[t.index];
        return label + ":" + value;
      }
    }
  } as { callbacks: { label(t: any, d: any): string } };
  return tooltipOptions;
}

export function rescaleData(data: number[]): number[] {
  const sum = data.reduce((a, b) => a + b, 0);
  const minPercent = 0.75;
  const min = sum * (minPercent / 100);
  const percents = data.map(d => Math.round((d / sum) * 100));
  let countZero = 0;
  const modPercents = percents.map(num => {
    if (num === 0) {
      countZero++;
      return minPercent;
    } else {
      return num;
    }
  });
  modPercents[0] = modPercents[0] - countZero * minPercent;
  const corrected = modPercents.map(num => num * min);
  return corrected;
}
