export const isIOS = () => {
  const iOS1to12 = /iPad|iPhone|iPod/.test(navigator.platform);
  const iOS13iPad = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const macOs = navigator.platform.includes('Mac');
  const iOS1to12quirk = () => {
    const audio = new Audio();
    audio.volume = 0.5;
    return audio.volume === 1;
  };

  return !window.MSStream && (iOS1to12 || iOS13iPad || iOS1to12quirk() || macOs);
};
