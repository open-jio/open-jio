import { Row, Col, Typography, Divider } from "antd";
import { Header } from "antd/es/layout/layout";
import Logoutbutton from "./Logoutbutton";
import { DashboardOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Createeventbutton } from "./Createeventbutton";

const headerStyle: React.CSSProperties = {
  display: "flex",
  textAlign: "center",
  color: "#F2613F",
  height: 64,
  lineHeight: "64px",
  backgroundColor: "transparent",
  alignContent: "center",
  maxWidth: "500px",
  alignItems: "center",
  justifyContent: "center"
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
      <Row>
        <Col span={19}>
          <Header style={headerStyle}>
            <div className="demo-logo" />
              <Typography style={headerTextStyle} onClick={() => navigate("/")}>
                NUS Open-Jio
              </Typography>
          </Header>
        </Col>
        <Col
          span={1.5}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Createeventbutton />
          <Dashboardbutton />
          <Logoutbutton />
        </Col>
      </Row>
      <Divider orientationMargin={0} />
    </>
  );
};

export default Appbar;
