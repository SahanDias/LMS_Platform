import './App.css';
import VideoLessonPage from './pages/VideoLessonPage';

function App() {
  return (
    <div className="App">
      <VideoLessonPage videoId={5} studentId={500} />
    </div>
  );
}

export default App;
