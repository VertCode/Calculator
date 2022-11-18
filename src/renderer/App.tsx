import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import Calculator from '../views/Calculator';
import History from '../views/History';
import ThemeProvider from '../components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
