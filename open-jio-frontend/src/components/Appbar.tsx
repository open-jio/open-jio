import { Typography, Divider, Drawer, Row, Col } from "antd";
import { Header } from "antd/es/layout/layout";
import Logoutbutton from "./Logoutbutton";
import { DashboardOutlined, MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Createeventbutton } from "./Createeventbutton";
import { useState } from "react";

const headerStyle: React.CSSProperties = {
  display: "flex",
  color: "#F2613F",
  height: 64,
  lineHeight: "64px",
  backgroundColor: "transparent",
  maxWidth: "500px",
};
const headerStylePhone: React.CSSProperties = {
  display: "flex",
  color: "#F2613F",
  height: 64,
  lineHeight: "64px",
  backgroundColor: "transparent",
  maxWidth: "300px",
  padding: "0"
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
  alignContent: "center",
};
const headerTextStylePhone: React.CSSProperties = {
  fontFamily: "unset",
  fontWeight: 700,
  letterSpacing: ".3rem",
  color: "inherit",
  textDecoration: "none",
  fontSize: 35,
  textAlign: "center",
  display: "flex",
  cursor: "pointer",
  
  justifyContent: "center",
  alignContent: "center",
};

const Dashboardbutton = () => {
  const navigate = useNavigate();

  return (
    <Button
      style={{}}
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
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div className="computer-navbar">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "90%",
            }}
          >
            <Header style={headerStyle}>
              <div className="demo-logo" />
              <Typography style={headerTextStyle} onClick={() => navigate("/")}>
                NUS Open-Jio
              </Typography>
            </Header>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{marginRight: 10}}>
            <Createeventbutton />
            </div>
            <div style={{marginRight: 10}}>
            <Dashboardbutton />
            </div>
            <div style={{marginRight: 10}}>
            <Logoutbutton />
            </div>
          </div>
        </div>

        <Divider orientationMargin={0} />
      </div>
      <div className="phone-navbar">
        <Row>
          <Col flex="5vw" style={{display: "flex", justifyContent: "center", alignSelf: "center"}}>
            <div>
              <Button type="text" onClick={showDrawer} size="large">
              <MenuOutlined />
              </Button>

              <Drawer
                title="Menu"
                onClose={onClose}
                open={open}
                style={{ backgroundColor: "white" }}
                placement="left"
              >
                <div
                  style={{
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Createeventbutton />
                  <br />
                  <Dashboardbutton />
                  <br />
                  <Logoutbutton />
                </div>
              </Drawer>
            </div>
          </Col>
          <Col flex="auto">
            <div>
              <Header style={headerStylePhone}>
                <div className="demo-logo" />
                <Typography
                  style={headerTextStylePhone}
                  onClick={() => navigate("/")}
                >
                  NUS Open-Jio
                </Typography>
              </Header>
            </div>
          </Col>
        </Row>
        <Divider orientationMargin={0} />
      </div>
    </>
  );
};

export default Appbar;
