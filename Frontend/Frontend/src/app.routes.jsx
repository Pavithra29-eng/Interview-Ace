import { createBrowserRouter } from "react-router";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/interview/:interviewId",
        element: <Interview />
    }
]);