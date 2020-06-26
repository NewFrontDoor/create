const baseColors = {
  text: '#231F20',
  background: '#fff',
  primary: '#00354e',
  alt: '#8cb8bf',
  accent: '#fbb034',
  none: null,
}

export default {
  ...baseColors,
  // This is a workaround for consuming our own defined values
  active: baseColors.accent
};
