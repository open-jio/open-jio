import {
  InfoCircleOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
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
import { Link } from "react-router-dom";
type FieldType = {
  email?: string;
  username?: string;
  password?: string;
  confirmpassword?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const Signuppage = () => {
  const { token } = theme.useToken();
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
            <Divider orientationMargin={0} />
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
