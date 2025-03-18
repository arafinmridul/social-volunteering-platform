import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./templates/sign-up/SignUp";
import SignIn from "./templates/sign-in/SignIn";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import EventDashboard from "./pages/EventDashboard";
import EventDetails from "./pages/EventDetails";

function App() {
    return (
        <Router>
            <Routes>
                {/* Auth Pages (No MiniDrawer) */}
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Pages (With MiniDrawer) */}
                <Route element={<Layout />}>
                    <Route path="/" element={<EventDashboard />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
