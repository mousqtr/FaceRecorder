import recognitionReducer from './features/recognition';
import { configureStore } from '@reduxjs/toolkit';

var devTools_ = false;
switch (process.env.REACT_APP_ENV) {
  case 'developpement':    // DEV
    devTools_ = true;
    break;
  case 'recette':          // RECETTE
    devTools_ = false;
    break;
  default:                 // LOCAL
    devTools_ = true;
    break; 
}


export default configureStore({
  reducer: {
    recognition: recognitionReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false
  }),
  devTools: devTools_
})