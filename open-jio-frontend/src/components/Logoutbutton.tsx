import { UserOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Logoutbutton = () => {
  const navigate = useNavigate();
  const [, setIsPending] = useState<boolean>(false); //not used yet
  const [, setErr] = useState<any>(null); //error message from server
  const Logout = async () => {
    console.log("Logging out");
    setIsPending(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_KEY + "/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        const respjson = await response.json();
        throw respjson.error;
      } else {
        setIsPending(false);
      }
    } catch (error: any) {
      setIsPending(false);
      setErr(error);
    } finally{
        localStorage.setItem("isloggedin", "false"); //logs user out of frontend private route
        localStorage.removeItem('activeSection')
        navigate("/");
    }
  };
  return (
    <Button
      type="primary"
      icon={<UserOutlined />}
      size="middle"
      iconPosition="start"
      onClick={Logout}
    >
      Log out
    </Button>
  );
};

export default Logoutbutton;
