import { Row, Col, Typography, Divider } from "antd";
import { Header } from "antd/es/layout/layout";
import Logoutbutton from "./Logoutbutton";
import { DashboardOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#F2613F",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "transparent",
  alignContent: "center",
};
const headerTextStyle: React.CSSProperties = {
  fontFamily: "unset",
  fontWeight: 700,
  letterSpacing: ".3rem",
  color: "inherit",
  textDecoration: "none",
  fontSize: 40,
  textAlign: "left",
  margin: "auto",
  display: "flex",
};



const Dashboardbutton = () => {
  const navigate = useNavigate();

  return (
    <Button
      style={{ marginRight: '10px' }}
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
  return (
    <>
      <Row>
        <Col span={19}>
          <Header style={headerStyle}>
            <div className="demo-logo" />
            <Typography style={headerTextStyle}>NUS Open-Jio</Typography>
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
          <Dashboardbutton/>
          <Logoutbutton />
          
        </Col>
      </Row>
      <Divider orientationMargin={0} />
    </>
  );
};

export default Appbar;
