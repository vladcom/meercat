import useWindowSize from './hooks/useWindowSize';
import './scss/style.scss';
import Routing from './view/router';

function App() {
  useWindowSize();
  return <Routing />;
}

export default App;
