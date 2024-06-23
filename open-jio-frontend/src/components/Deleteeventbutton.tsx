import {useState} from "react";
import { Button, Modal , message } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const DeleteEventButton = (props : {title : String, id : number}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, setIsPending] = useState<boolean>(false); //not used yet
    const [err, setErr] = useState<any>(null); //error message from server
    const [messageApi, contextHolder] = message.useMessage();
    let navigate = useNavigate();
    const showModal = () => {
        setIsModalOpen(true);
    };


    

    const handleOk = async () => {
        setIsModalOpen(false);
        //call backend to delete
        try {
            const response = await fetch(import.meta.env.VITE_API_KEY + "/events/" 
                + props.id, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });
            if (!response.ok) {
              const respjson = await response.json();
              throw respjson.error;
            } else {
              setIsPending(false);
              //show notif that it is deleted
              messageApi.success('Successfully deleted event.');
              //navigate back to dashboard
              navigate("/dashboard");
            }
          } catch (error: any) {
            setIsPending(false);
            setErr(error);
            messageApi.error('Could not delete event.');
            //show notif that theres an error
          }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
  
    return (
    <>
    {contextHolder}
        <Button
            style={{ margin: '7px' }}
            type="primary"
            icon={<DeleteOutlined />}
            size="middle"
            iconPosition="start"
            onClick={showModal}
        >
        </Button>
        <Modal cancelButtonProps={{type : "text", color : "ffffff"}} 
        title="Danger!" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>You are about to delete the event <strong>{props.title}</strong>.</p>
        <p> Would you like to proceed? </p>
        </Modal>
    </>
    );
  };
  
  export default DeleteEventButton;