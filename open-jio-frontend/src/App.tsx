import { useState } from "react";
import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Layout,
  Row,
  ThemeConfig,
  Typography,
} from "antd";
import EventPage from "./pages/Eventpage";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { UserOutlined } from "@ant-design/icons";
import Signinbutton from "./components/Signinbutton";
import Signupbutton from "./components/Signupbutton";
import Loginpage from "./pages/Loginpage";

function App() {
  const [count, setCount] = useState(0);
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
  const theme1: ThemeConfig = {
    token: {
      // Seed Token
      colorPrimary: "#F2613F",
      borderRadius: 4,

      // Alias Token

      colorBgElevated: "#9B3922",
    },
    components: {
      Typography: {},
      Button: {
        colorPrimary: "#9B3922",
        colorBgBase: "#F2613F",
        algorithm: true, // Enable algorithm
      },
    },
  };
  return (
    <ConfigProvider theme={theme1}>
      <Layout>
        <Row>
          <Col span={20}>
            <Header style={headerStyle}>
              <div className="demo-logo" />
              <Typography style={headerTextStyle}>NUS Open-Jio</Typography>
            </Header>
          </Col>
          <Col span={2} style={{ display:"flex", alignItems: "center", justifyContent:"center"}}>
            <Signinbutton />
          </Col>
          <Col span={1.5} style={{ display:"flex", alignItems: "center", justifyContent:"center"}}>
            <Signupbutton />
          </Col>
        </Row>
        <Divider orientationMargin={0} />
        <Content
          style={{
            minHeight: "auto",
            paddingLeft: 24,
            paddingRight: 24,
            borderRadius: "#0C0C0C",
          }}
        >
          <Loginpage />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          NUS-Open-Jio ©2024 Created by Eventopia
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
