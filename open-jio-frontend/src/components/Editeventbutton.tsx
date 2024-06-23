import { Button, Modal, message , Form, Input, DatePicker} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
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


    const showModal = () => {
        setIsModalOpen(true);
        console.error(props.date.toString());
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
        {contextHolder}
            <Button
        style={{ margin: '7px' }}
        type="primary"
        icon={<EditOutlined />}
        size="middle"
        iconPosition="start"
        onClick={showModal}
      >

      </Button>
      <Modal cancelButtonProps={{type : "text", color : "ffffff"}} 
          title="Update your event" 
          okText = "Save"
          open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      {/*Title*/}
      <Form.Item<FieldType>
      label="Title"
      name="title"
      rules={[{ required: true, message: 'Input your title' }]}
    >
        <Input placeholder="Input your title" defaultValue = {props.title.toString()}/>
      </Form.Item>
      {/*Description*/}
      <Form.Item<FieldType>
      label="Description"
      name="description"
      rules={[{ required: true, message: 'Input your description' }]}
    >
        <Input placeholder="Input your description" defaultValue = {props.description.toString()}/>
      </Form.Item>

      {/*Date*/}
      <Form.Item label="DatePicker">
        <DatePicker  defaultValue={dayjs(props.date.toString(), 'D/M/YYYY')}/>
      </Form.Item>
      {/*Location*/}
      <Form.Item<FieldType>
      label="Location"
      name="location"
      rules={[{ required: true, message: 'Input your location' }]}
    >
        <Input placeholder="Input your location" defaultValue = {props.location.toString()}/>
      </Form.Item>

      </Modal>
        </>
      
    );
  };
  
export default EditEventButton;