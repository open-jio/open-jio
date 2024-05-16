import { UserOutlined } from "@ant-design/icons";
import { Button } from "antd";

const Signupbutton = () => {
    return ( 
<Button type="default" icon={<UserOutlined />} size="middle" iconPosition="start">Sign up</Button>
     );
}
 
export default Signupbutton;