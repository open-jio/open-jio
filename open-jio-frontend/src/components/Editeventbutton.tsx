import { Button, Modal, message , Form, Input} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const EditEventButton = (props: {
    id : number;
    title: String;
    description: String;
    location: String;
    date: String;
    time: String;
  }) => {


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, setIsPending] = useState<boolean>(false); //not used yet
    const [err, setErr] = useState<any>(null); //error message from server
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();


    const modalstyle = {
        groupBorderColor : "#000000"
    }
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


    //form stuff
    type FieldType = {
        title?: string;
        description?: string;
        location?: string;
      };
  
    return (
        <>
            <Button
        style={{ margin: '7px' }}
        type="primary"
        icon={<EditOutlined />}
        size="middle"
        iconPosition="start"
        onClick={showModal}
      >

      </Button>
      <Modal cancelButtonProps={{type : "text", color : "ffffff"}} title="Update your event" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <Form.Item<FieldType>
      label="Title"
      name="title"
      rules={[{ required: true, message: 'Input your title!' }]}
    >
      <Input />
    </Form.Item>
      </Modal>
        </>
      
    );
  };
  
export default EditEventButton;