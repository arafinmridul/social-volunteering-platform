import React from "react";
import { Outlet } from "react-router-dom";
import MiniDrawer from "./MiniDrawer";

const Layout: React.FC = () => {
    return (
        <MiniDrawer>
            <Outlet />
        </MiniDrawer>
    );
};

export default Layout;
