import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  Form,
  Typography,
  Divider,
  Input,
  FormProps,
  theme,
  ConfigProvider,
  Button,
} from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const { Text } = Typography;
type FieldType = {
  email?: string;
  username?: string;
  password?: string;
  confirmpassword?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const Signuppage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [, setIsPending] = useState<boolean>(false); //not used yet
  const [err, setErr] = useState<any>(null); //error message from server
  // Send HTTPS POST to backend
  const onFinish: FormProps<FieldType>["onFinish"] = async (data) => {
    console.log("writing to server");
    const signupinfo = {
      email: data.email,
      username: data.username,
      password: data.password,
    };
    setIsPending(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_KEY + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupinfo),
      });
      if (!response.ok) {
        const respjson = await response.json();
        throw respjson.error;
      } else {
        try {
          const sendemailresponse = await fetch(
            import.meta.env.VITE_API_KEY + "/sendverifyemail",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({email: signupinfo.email})
            }
          );
          if (!sendemailresponse.ok) {
            const respjson = await response.json();
            throw respjson.error;
          } else {
            setIsPending(false);
            navigate("/");
          }
        } catch (error: any) {
          setIsPending(false);
          setErr(error);
        }
      }
    } catch (error: any) {
      setIsPending(false);
      setErr(error);
    }
  };
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="signup-page">
        <div className="signup-page-container">
          <Form
            name="log in"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
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
              Sign Up
            </Typography>
            <Divider orientationMargin={0} />
            {/* Username field */}
            <Form.Item<FieldType>
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
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
            {/* Confirm Password field */}
            <Form.Item<FieldType>
              name="confirmpassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Password does not match"));
                  },
                }),
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
                placeholder="Confirm Password"
                prefix={<LockOutlined style={{ color: token.colorBgBase }} />}
                visibilityToggle={false}
              />
            </Form.Item>
            {/* Confirm Email field */}
            <Form.Item<FieldType>
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
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
                placeholder="NUS Email"
                prefix={<MailOutlined style={{ color: token.colorBgBase }} />}
              />
            </Form.Item>
            {/* Sign up button */}
            <Form.Item
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button type="default" htmlType="submit">
                Sign up
              </Button>
            </Form.Item>
            <Text
              type="danger"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {err}
            </Text>
            <Divider orientationMargin={0} />
            {/* Already have an account? Login here */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>
                Already have an account?{" "}
                <Link to={"/login"}>
                  <a>Login here.</a>
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Signuppage;
