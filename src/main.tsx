import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/global.scss'
import './styles/reset.scss'
import App from './App.tsx'
import {Provider} from "react-redux";
import store from "./app/store.ts";

const root = document.getElementById('root');
if (!root) {
  throw new Error('Не удалось загрузить приложение');
}
createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </StrictMode>

)
