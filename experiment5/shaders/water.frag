precision highp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform vec3 baseColor;
uniform vec3 peakColor;
uniform float alph;
uniform float cellSize;
uniform float speedScalar;

vec2 noise2x2(vec2 p){
  float x = dot(p, vec2(123.4, 234.5));
  float y = dot(p, vec2(345.6, 456.7));
  vec2 noise = vec2(x, y);
  noise = sin(noise);
  noise = noise * 43758.5453;
  noise = fract(noise);
  return noise;
}

void main() {
  vec2 uv = vTexCoord;

  uv *= cellSize;
  vec2 currGridCoord = fract(uv);
  vec2 currGridID = floor(uv);

  float ptsOnGrid = 0.0;  // no fuckin clue what this is yet
  float minDist = 500.0;

  for (float i = -1.0; i <= 1.0; i++){
    for (float j = -1.0; j <= 1.0; j++){
      vec2 adjGridCoords = vec2(i, j);
      vec2 pointOnAdjGrid = adjGridCoords;

      // noise transform
      vec2 noise = noise2x2(currGridID + adjGridCoords) * speedScalar;
      pointOnAdjGrid = adjGridCoords + sin(time * noise) * 0.5;

      float dist = length(currGridCoord - pointOnAdjGrid);
      minDist = min(dist, minDist);
    }
  }

  // vec3 color = vec3(0.0, 0.1 + minDist/2.0, 0.75 + minDist);
  float stuff = minDist * minDist;
  // stuff = smoothstep(0.6, 0.8, minDist);
  vec3 color = mix(baseColor, peakColor, stuff);



  gl_FragColor = vec4(color, alph);
  // gl_FragColor = vec4(0.0);
  // gl_FragColor = baseColor;
}
