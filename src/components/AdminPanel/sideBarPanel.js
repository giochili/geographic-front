import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import "../../Styles/AdminPanel/SidebarPanel.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";
function SideBarPanel() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div id="app" style={{ height: "100vh", display: "flex" }}>
      <Sidebar
        style={{ height: "100vh" }}
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        {/* <Menu>
          <MenuItem
            icon={<MenuOutlinedIcon />}
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            style={{ textAlign: "center" }}
          >
            {" "}
            <h2>Sidebar</h2>
          </MenuItem>
          <NavLink to="/SideBarPanel/Varjisfarti">
            <MenuItem icon={<HomeOutlinedIcon />}>ვარჯის ფართები</MenuItem>
          </NavLink>
          <NavLink className={"navLink"} to={"/SideBarPanel/ExcelExport"}>
            <MenuItem icon={<PeopleOutlinedIcon />}>Excel </MenuItem>
          </NavLink>
          <MenuItem icon={<ContactsOutlinedIcon />}>Contacts</MenuItem>
          <MenuItem icon={<ReceiptOutlinedIcon />}>Profile</MenuItem>
          <MenuItem icon={<HelpOutlineOutlinedIcon />}>FAQ</MenuItem>
          <MenuItem icon={<CalendarTodayOutlinedIcon />}>Calendar</MenuItem>
        </Menu> */}
        <Menu>
          <MenuItem
            icon={<MenuOutlinedIcon />}
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            style={{ textAlign: "center" }}
          >
            <h2>Sidebar</h2>
          </MenuItem>
          <NavLink className="navLink" to="/">
            <MenuItem icon={<HomeOutlinedIcon />}>მთავარი</MenuItem>
          </NavLink>

          <NavLink className="navLink" to="/SideBarPanel/ExcelExport">
            <MenuItem icon={<PeopleOutlinedIcon />}>Excel </MenuItem>
          </NavLink>
          <NavLink className="navLink" to="/SideBarPanel/Varjisfarti">
            <MenuItem icon={<ContactsOutlinedIcon />}>ვარჯის ფართები</MenuItem>
          </NavLink>
        </Menu>
      </Sidebar>
    </div>
  );
}

export default SideBarPanel;
