import { UserOutlined } from "@ant-design/icons";
import { Button } from "antd";

const Signinbutton = () => {
    return ( 
<Button type="default" icon={<UserOutlined />} size="middle" iconPosition="start">Sign in</Button>
     );
}
 
export default Signinbutton;