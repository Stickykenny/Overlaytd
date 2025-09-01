import * as d3 from "d3";
export const tooltipConfig = {
  font: {
    size: 24,
  },
  comment: {
    font: {
      size: 14,
    },
  },
};

export const linkConfig = {
  stroke: {
    width: 1,
    widthHover: 8,
    rainbowLoop: true,
    saturation: 1,
    luminosity: 0.5,
  },
};

export function rainbowLoop(elem: any, attributeName: string, depth: number) {
  var saturationVarianceMax = 0.75;
  var saturationVarianceMin = 0.25;
  var luminosityVarianceMax = 0.75;
  var luminosityVarianceMin = 0.25;

  let i = 0;
  var step = 20;
  const colors = [...Array(Math.floor(361 / step) + 1).keys()].map(
    (i) => i * step
  );

  // Reset to default
  linkConfig.stroke.saturation = 1;
  linkConfig.stroke.luminosity = 0.5;

  function next(elem: any, attributeName: string) {
    if (linkConfig.stroke.rainbowLoop) {
      elem
        .transition()
        .attr(
          attributeName,
          d3
            .hsl(
              colors[i],
              linkConfig.stroke.saturation,
              linkConfig.stroke.luminosity,
              1
            )
            .clamp()
            .formatHex()
        )
        .on("end", () => {
          i = (i + 1) % colors.length;
          if (i == colors.length - 1) {
            console.log("light+saturation changed");
            linkConfig.stroke.saturation =
              Math.random() * (saturationVarianceMax - saturationVarianceMin) +
              saturationVarianceMin;
            linkConfig.stroke.luminosity =
              Math.random() * (luminosityVarianceMax - luminosityVarianceMin) +
              luminosityVarianceMin;
          }
          next(elem, attributeName);
        });
    } else {
      elem
        .transition()
        .attr(
          attributeName,
          d3.hsl(colors[i], 1, 0.5, 1).darker(depth).clamp().formatHex()
        );
    }
  }

  next(elem, attributeName);
}
