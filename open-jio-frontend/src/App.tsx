import { ConfigProvider, Layout, ThemeConfig } from "antd";
import { Content } from "antd/es/layout/layout";
import Loginpage from "./pages/Loginpage";
import "./index.css";
import EventPage from "./pages/Eventlistpage";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import Signuppage from "./pages/Signuppage";
import Eventdetailpage from "./pages/Eventdetailpage";
import Emailverifiedpage from "./pages/Emailverifiedpage";

export const theme1: ThemeConfig = {
  
  token: {
    // Seed Token
    colorPrimary: "#F213F",
    borderRadius: 4,
    // Alias Token
    colorBgElevated: "#9B3922",
  },
  components: {
    Typography: {},
    Button: {
      colorPrimary: "#F2613F",
      colorBgBase: "#9B3922",
      algorithm: true, // Enable algorithm
    },
  },
};

function App() {
  
  return (
    <>
      <ConfigProvider theme={theme1}>
        <Layout>
          <Content
            style={{
              minHeight: "auto",
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <BrowserRouter>
              <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Loginpage />} />
                <Route path="/signup" element={<Signuppage />} />
                <Route path="/events" element={<EventPage />} />
                <Route path="/verifyemail" element={<Emailverifiedpage />} />
                <Route path="/events/:id" element={<Eventdetailpage />} />
              </Routes>
            </BrowserRouter>
          </Content>
        </Layout>
      </ConfigProvider>
    </>
  );
}

export default App;
