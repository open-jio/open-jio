import { PlusCircleFilled } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export const Createeventbutton = () => {
    const navigate = useNavigate();
  
    return (
      <Button
        style={{ marginRight: "10px" }}
        type="primary"
        icon={<PlusCircleFilled />}
        size="middle"
        iconPosition="start"
        onClick={() => navigate("/createevent")}
      >
        Create event
      </Button>
    );
  };