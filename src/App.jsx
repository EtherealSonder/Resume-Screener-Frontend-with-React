import { Outlet } from "react-router-dom";

function App() {
    return (
        <div className="relative min-h-screen bg-gray-100 font-sans">
            <Outlet />
        </div>
    );
}

export default App;
