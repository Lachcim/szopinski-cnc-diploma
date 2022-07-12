import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import App from "renderer/app";
import { store } from "renderer/cnc/state";

import "renderer/cnc/serial";

const root = createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <MemoryRouter initialEntries={["/portSelect"]}>
            <App/>
        </MemoryRouter>
    </Provider>
);
