import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "renderer/app";
import { store } from "renderer/cnc/state";

import "renderer/cnc/feedback";

const root = createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);
