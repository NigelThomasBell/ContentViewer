import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  //<React.StrictMode>
  <App />
  //</React.StrictMode>
);
