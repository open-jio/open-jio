import {useState} from "react";
import { Button, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
const DeleteEventButton = (props : {title : String, id : number}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
  
    return (
    <>
        <Button
            style={{ margin: '7px' }}
            type="primary"
            icon={<DeleteOutlined />}
            size="middle"
            iconPosition="start"
            onClick={showModal}
        >
        </Button>
        <Modal title="Danger!" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>You are about to delete the event {props.title}.</p>
        <p> Would you like to proceed? </p>
        </Modal>
    </>
    );
  };
  
  export default DeleteEventButton;