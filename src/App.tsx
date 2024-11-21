import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "sonner";

export function App() {
  return (
    <Provider store={store}>
      <Toaster richColors />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Provider>
  );
}
