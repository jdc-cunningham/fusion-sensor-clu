import './App.scss';
import LeftPanel from './layout/left-panel/LeftPanel';
import RightPanel from './layout/right-panel/RightPanel';

function App() {
  return (
    <div className="WebInterface">
      <LeftPanel />
      <RightPanel />
    </div>
  );
}

export default App;
