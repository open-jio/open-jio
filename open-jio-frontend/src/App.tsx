import { ConfigProvider, Layout, ThemeConfig } from "antd";
import { Content } from "antd/es/layout/layout";
import Loginpage from "./pages/Loginpage";
import "./index.css";
import EventPage from "./pages/Eventlistpage";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import Signuppage from "./pages/Signuppage";
import Eventdetailpage from "./pages/Eventdetailpage";
import Emailverifiedpage from "./pages/Emailverifiedpage";
import Privateroute from "./components/Privateroute";
import Publicroute from "./components/Publicroute";
import Forgotpasswordpage from "./pages/Forgotpasswordpage";
import Resetpasswordpage from "./pages/Resetpasswordpage";
import Dashboardpage from "./pages/Dashboardpage"
import Createeventpage from "./pages/Createeventpage";

export const theme1: ThemeConfig = {
  token: {
    // Seed Token
    colorPrimary: "#F2613F",
    borderRadius: 4,
    // Alias Token
    colorBgElevated: "#9B3922",
    
  },
  components: {
    Typography: {fontFamily: "Arial"},
    Button: {
      colorPrimary: "#F2613F",
      colorBgBase: "#9B3922",
      algorithm: true, // Enable algorithm
      borderColorDisabled : "#d9d9d9"
    },
    Menu: {
      colorBgContainer: "#f5f5f5",
      colorBgElevated: "#f5f5f5",
      colorPrimaryBg: "#f5f5f5",
      colorHighlight: "#f5f5f5",
    },
    Modal :{
      contentBg : "#f5f5f5",
      headerBg : "#f5f5f5",
      colorIcon : "#f5f5f5",
      titleColor : "#F2613F"
    },
    Message : {
      contentBg : "#f5f5f5"
    },
    DatePicker : {
      colorBgElevated : "#f5f5f5"
    },
    Table : {
      
      headerBg : "#f5f5f5",
    }
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
                <Route element={<Privateroute />}>
                  <Route path="/" element={<Navigate to={"/login"} />} />
                  <Route path="/events" element={<EventPage />} />
                  <Route path="/events/details/:id" element={<Eventdetailpage />} />
                  <Route path="/createevent" element = {<Createeventpage/>}/>
                  <Route path="/dashboard" element = {<Dashboardpage/>}/>
                </Route>
                <Route element={<Publicroute />}>
                  <Route path="/login" element={<Loginpage />} />
                  <Route path="/signup" element={<Signuppage />} />
                  <Route path="/forgotpassword" element={<Forgotpasswordpage />} />
                  <Route path="/verifyemail" element={<Emailverifiedpage />} />
                  <Route path="/resetpassword" element={<Resetpasswordpage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </Content>
        </Layout>
      </ConfigProvider>
    </>
  );
}

export default App;
