import { MailOutlined } from "@ant-design/icons";
import {
  Form,
  Typography,
  Divider,
  Input,
  FormProps,
  theme,
  ConfigProvider,
  Button,
  notification,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
const { Text } = Typography;
type FieldType = {
  email?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const Forgotpasswordpage = () => {
  const { token } = theme.useToken();
  const [, setIsPending] = useState<boolean>(false); //not used yet
  const [err, setErr] = useState<any>(null); //error message from server
  // Send HTTPS POST to backend
  const onFinish: FormProps<FieldType>["onFinish"] = async (data) => {
    console.log("writing to server");
    const resetpasswordinfo = {
      email: data.email,
    };
    setIsPending(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_API_KEY + "/sendresetpassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resetpasswordinfo),
        }
      );
      if (!response.ok) {
        const respjson = await response.json();
        throw respjson.error;
      } else {
        setIsPending(false);
      }
    } catch (error: any) {
      setIsPending(false);
      setErr(error);
    } finally {
      notification.open({
        message: "Reset password attempt",
        description:
          `If ${data.email} matches the email address on your account, we'll send you a link.`,
        placement: "bottomLeft",
        duration: 0,
      });
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
              Forgot password
            </Typography>
            <Divider orientationMargin={0} />
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
            {/* Reset password button */}
            <Form.Item
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button type="default" htmlType="submit">
                Reset password
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
                Back to
                <Link to={"/login"}>
                  <a> Login page.</a>
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Forgotpasswordpage;
