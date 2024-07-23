import {
  InfoCircleOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  ConfigProvider,
  Divider,
  Form,
  FormProps,
  Input,
  Typography,
  theme,
} from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const { Text } = Typography;
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};


const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Loginpage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [, setIsPending] = useState<boolean>(false); //not used yet
  const [err, setErr] = useState<any>(null); //error message from server
  // Send HTTPS POST to backend
  const onFinish: FormProps<FieldType>["onFinish"] = async (data) => {
    console.log("Logging in");
    const logininfo = {
      username: data.username,
      password: data.password,
    };
    setIsPending(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_KEY + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logininfo),
        credentials: "include",
      });
      console.log(response)
      if (!response.ok) {
        const respjson = await response.json();
        throw respjson.error;
      } else {
        setIsPending(false);
        localStorage.setItem("isloggedin", "true") //allows user to be authorized during operations
        localStorage.removeItem('activeSection')
        navigate("/events");
      }
    } catch (error: any) {
      setIsPending(false);
      setErr(error);
    }
  };
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="login-page">
        <div className="login-page-position-left"></div>
        <div className="login-page-position-right">
          {/*credits to https://procomponents.ant.design/~demos/loginform,pageform-demo-login-form-page*/}
          <div></div>
          <div className="login-page-container">
            <Form
              name="log in"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: false }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="on"
            >
              {/* Title */}
              <Typography
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  marginBlockEnd: 10,
                }}
              >
                <img
                  src="./NUS-Open-Jio-logo-temp.jpg"
                  alt="NUS OPEN JIO"
                  width={50}
                  height={50}
                  style={{
                    marginRight: 15,
                    alignSelf: "center",
                    alignItems: "center",
                  }}
                />
                <span />
                <h3>NUS OPEN JIO</h3>
              </Typography>
              {/* Subtitle */}
              <Typography
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBlockEnd: 20,
                }}
              >
                For all your activities
              </Typography>
              <Divider orientationMargin={0} />
              {/* Username field */}
              <Form.Item<FieldType>
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
                tooltip={{
                  title: "Tooltip with customize icon",
                  icon: <InfoCircleOutlined />,
                  color: "gold",
                }}
              >
                <Input
                  style={{
                    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
                    color: token.colorBgBase,
                    borderRadius: 8,
                    backgroundColor: "rgba(255,255,255,0.25)",
                    backdropFilter: "blur(4px)",
                    width: "300px",
                  }}
                  placeholder="Username"
                  prefix={<UserOutlined style={{ color: token.colorBgBase }} />}
                />
              </Form.Item>
              {/* Password field */}
              <Form.Item<FieldType>
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  style={{
                    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
                    color: token.colorBgBase,
                    borderRadius: 8,
                    backgroundColor: "rgba(255,255,255,0.25)",
                    backdropFilter: "blur(4px)",
                    width: "300px",
                  }}
                  placeholder="Password"
                  prefix={<LockOutlined style={{ color: token.colorBgBase }} />}
                />
              </Form.Item>
              {/* Remember me checkbox and Forgot password*/}
              <Form.Item<FieldType>
                name="remember"
                valuePropName="checked"
                wrapperCol={{ span: 24 }}
              >
                <Checkbox style={{ float: "left", width: "auto" }}>
                  Remember me
                </Checkbox>
                <a
                  style={{
                    float: "right",
                  }}
                ><Link to={"/forgotpassword"}>
                <a>Forgot password</a>
              </Link>
                  
                </a>
              </Form.Item>
              {/* Log in Button */}
              <Form.Item
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button type="default" htmlType="submit">
                  Log in
                </Button>
                
              </Form.Item>
              {/* Error message */}
              <Text
                  type="danger"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: "300px",
                  }}
                >
                  {err}
                </Text>
              <Divider orientationMargin={0} />
              {/* Don't have an account? Sign up here */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p>
                  Don't have an account?{" "}
                  <Link to={"/signup"}>
                    <a>Sign up here.</a>
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Loginpage;
