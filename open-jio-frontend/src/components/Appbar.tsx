import {Typography, Divider } from "antd";
import { Header } from "antd/es/layout/layout";
import Logoutbutton from "./Logoutbutton";
import { DashboardOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Createeventbutton } from "./Createeventbutton";

const headerStyle: React.CSSProperties = {
  display: "flex",
  color: "#F2613F",
  height: 64,
  lineHeight: "64px",
  backgroundColor: "transparent",
  maxWidth: "500px"
};
const headerTextStyle: React.CSSProperties = {
  fontFamily: "unset",
  fontWeight: 700,
  letterSpacing: ".3rem",
  color: "inherit",
  textDecoration: "none",
  fontSize: 40,
  textAlign: "center",
  display: "flex",
  cursor: "pointer",
  maxWidth: "350px",
  justifyContent: "center",
  alignContent: "center"
};

const Dashboardbutton = () => {
  const navigate = useNavigate();

  return (
    <Button
      style={{ marginRight: "10px" }}
      type="primary"
      icon={<DashboardOutlined />}
      size="middle"
      iconPosition="start"
      onClick={() => navigate("/dashboard")}
    >
      Dashboard
    </Button>
  );
};

const Appbar = () => {
  const navigate = useNavigate();
  return (
    <>
    <div style = {{display : "flex", flexDirection : "row"}}>
      <div style = {{display : "flex", justifyContent : "flex-start", width : "90%"}}>
      <Header style={headerStyle}>
            <div className="demo-logo" />
              <Typography style={headerTextStyle} onClick={() => navigate("/")}>
                NUS Open-Jio
              </Typography>
          </Header>
      </div>
      <div style = {{display : "flex", alignItems : "center", justifyContent : "center"}}>
      <Createeventbutton />
          <Dashboardbutton />
          <Logoutbutton />
      </div>
      
    </div >
      
      <Divider orientationMargin={0} />
    </>
  );
};

export default Appbar;
