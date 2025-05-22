import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login.tsx";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./lib/firebase.ts";
import { Toaster } from "./components/ui/sonner.tsx";
import Register from "./routes/Register.tsx";
import AuthProvider from "./components/AuthProvider.tsx";
import Quiz from "./routes/Quiz.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthProvider>
                <App />
            </AuthProvider>
        ),
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/quiz",
        element: (
            <AuthProvider>
                <Quiz />
            </AuthProvider>
        ),
    },
]);

initializeApp(firebaseConfig);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
        <Toaster />
    </StrictMode>
);
