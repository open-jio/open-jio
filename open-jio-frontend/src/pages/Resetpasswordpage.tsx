import { LockOutlined } from "@ant-design/icons";
import {
  ConfigProvider,
  theme,
  Form,
  Typography,
  Divider,
  Input,
  Button,
  FormProps,
  notification,
} from "antd";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
const { Text } = Typography;
type FieldType = {
  password?: string;
  confirmpassword?: string;
};
const Resetpasswordpage = () => {
  const { token } = theme.useToken();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const temppassword = searchParams.get("temp");
  const navigate = useNavigate();
  const [, setIsPending] = useState<boolean>(false); //not used yet
  const [err, setErr] = useState<any>(null); //error message from server
  const onFinish: FormProps<FieldType>["onFinish"] = async (data) => {
    console.log("trying to reset password");
    const resetpasswordinfo = {
      password: data.password,
    };
    setIsPending(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_API_KEY +
          "/resetpassword?id=" +
          id +
          "&temp=" +
          temppassword,
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
        navigate("/");
        notification.info({
          message: "Password Reset Successful",
          description:
            "Your password has been resetted. Please login again.",
          placement: "bottomLeft",
          duration: 0,

        });
      }
    } catch (error: any) {
      setIsPending(false);
      setErr(error);
    }
  };
  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
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
              Reset password
            </Typography>
            <Divider orientationMargin={0} />
            {/* Password field */}
            <Form.Item<FieldType>
              name="password"
              rules={[
                { required: true, message: "Please input your new password!" },
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
                placeholder="New Password"
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

export default Resetpasswordpage;
