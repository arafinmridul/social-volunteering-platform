import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./templates/sign-up/SignUp";
import SignIn from "./templates/sign-in/SignIn";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </Router>
    );
}

export default App;
