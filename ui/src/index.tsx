import ReactDOM from 'react-dom/client';
import App from './App';
import theme from './contexts/Theme';
import { ThemeProvider } from '@mui/material';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
