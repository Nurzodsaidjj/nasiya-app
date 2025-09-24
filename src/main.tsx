import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// import Layout from "./layout/login-layout.tsx"; // Remove this import
import { lightTheme } from "./theme/light.ts";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ConfigProvider theme={lightTheme}>
			<App />
		</ConfigProvider>
	</React.StrictMode>
);
