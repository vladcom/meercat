import MarkerIcon from 'src/static/img/yellow.svg';

const SplashScreen = () => (
  <div className='splash'>
    <div
      className='mb-4'
      style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translate(-50%, -20%)' }}
    >
    </div>
    <div className='splash-container-item'>
      <div className='marker'>
        <img src={MarkerIcon} alt={MarkerIcon} />
      </div>
      <div className='circle' style={{ animationDelay: '-3s' }} />
      <div className='circle' style={{ animationDelay: '-2s' }} />
      <div className='circle' style={{ animationDelay: '-1s' }} />
      <div className='circle' style={{ animationDelay: '0s' }} />
    </div>
  </div>
);

export default SplashScreen;
