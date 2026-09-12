import { Routes, Route } from "react-router-dom";
import MyTeam from "./pages/team/MyTeam";
import Mentor from "./pages/mentor/Mentor";
import "./App.css";

const HomePage = () => {
    return (
        <div>
            <h1>Hackathon Management System</h1>
            <p>Welcome to the home page.</p>
        </div>
    );
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/my-team" element={<MyTeam />} />
            <Route path="/mentor" element={<Mentor />} />
        </Routes>
    );
}

export default App;