import {RouterProvider} from "react-router-dom";
import {router} from "./router.tsx";

function App() {
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
