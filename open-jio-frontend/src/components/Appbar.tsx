import { Row, Col, Typography, Divider } from "antd";
import { Header } from "antd/es/layout/layout";
import Signinbutton from "./Signinbutton";
import Signupbutton from "./Signupbutton";
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
const Appbar = () => {
  return (
    <>
      <Row>
        <Col span={20}>
          <Header style={headerStyle}>
            <div className="demo-logo" />
            <Typography style={headerTextStyle}>NUS Open-Jio</Typography>
          </Header>
        </Col>
        <Col
          span={2}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Signinbutton />
        </Col>
        <Col
          span={1.5}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Signupbutton />
        </Col>
      </Row>
      <Divider orientationMargin={0} />
    </>
  );
};

export default Appbar;
