import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App";
import PageNotFound from "./pages/404";
import UserAgreement from "./pages/UserAgreement";
import JoinPage from "./pages/JoinPage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="agreement" element={<UserAgreement />} />
            <Route path="join/:id" element={<JoinPage />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    </BrowserRouter>
);
