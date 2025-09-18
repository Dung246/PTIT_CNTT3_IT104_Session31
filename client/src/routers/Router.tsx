import { createBrowserRouter } from "react-router-dom";
import ListPost from "../pages/ListPost";

export const routers=createBrowserRouter([
    {
        path:"/list-post",
        element:<ListPost></ListPost>
    }
])