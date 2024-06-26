import { useState } from "react";
import { Button, Modal , Table} from "antd";

import type { TableProps } from 'antd';
import { UserOutlined } from "@ant-design/icons";

const SeeUsersButton = (props : {title : String, id : number}) => {

    const [users, setUsers] = useState<UserType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, setIsPending] = useState<boolean>(false); //not used yet
    const [err, setErr] = useState<any>(null); //error message from server
    interface UserType {
        Username: string;
        Email: string;
      }
    
    const columns: TableProps<UserType>['columns'] = [
    {
        title: 'Username',
        dataIndex: 'Username',
        key: 'username',
    },
    {
        title: 'Email',
        dataIndex: 'Email',
        key: 'email',
    }];

    const showModal = () => {
        getUserData();
        setIsModalOpen(true);
    };
    const getUserData = async () => {
        //call backend to delete
        try {
            const response = await fetch(import.meta.env.VITE_API_KEY + "/events/seeusers/" 
                + props.id, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });
            const respjson = await response.json();
            if (!response.ok) {
              throw respjson.error;
            } else {
              setIsPending(false);
              console.log(respjson);
              const userlist :UserType[] = respjson.users.map((user : UserType) => ({
                Username: user.Username,
                Email: user.Email
                }));
                setUsers(userlist);
             
            }
          } catch (error: any) {
            setIsPending(false);
            setErr(error);
            console.log(error);
          }
    }


    const handleSave = () => {
        const header = Object.keys(users[0]).join(',') + '\n';
        const rows = users.map(obj => Object.values(obj).join(',')).join('\n');
        const csv_combined = header + rows;
        const filename = "Registered Users for " + props.title + ".csv";

    
        const blob = new Blob([csv_combined], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);


        
    };

    const handleCancel = () => {
        setErr(null);
        setIsModalOpen(false);
    }; //set error = null when closing modal
  
    return (
    <>
        <Button
        style={{ margin: '7px' }}
        type="primary"
        icon={<UserOutlined />}
        size="middle"
        iconPosition="start"
        onClick={showModal}
      >
      </Button>
      <Modal cancelButtonProps={{type : "text", color : "ffffff"}} 
      title={'Users registered for event "'+ props.title + '" :'} 
      footer={[
        <Button key="1" type = "primary" onClick={handleSave}>Save</Button>
      ]}
      open={isModalOpen} onCancel={handleCancel}>
        <br/>
        {err == null ? <Table 
            rowClassName={() => "rowClassName1"} 
            bordered
            columns = {columns}
            dataSource = {users}/> : <>An error has occured</>}
      </Modal>
    </>
      
    );
  };
  
  
export default SeeUsersButton;