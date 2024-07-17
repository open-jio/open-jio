import TextboxTail from "../assets/text_message.png"
import { theme1 } from "../App";
import { useState, useEffect } from "react";
import { Modal, Form, FormProps, Input, message } from "antd";
import { EditOutlined, EditTwoTone } from "@ant-design/icons";


const Textbox = (props : {id : number , text : string, createdAt : string, updatedAt : string, authorised : boolean}) => {
    const [text, setText] = useState(props.text);
    const [updatedAt, setUpdatedAt] = useState(props.updatedAt)
    const [hover, setHover] = useState(false);
    const [hoverEdit, setHoverEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, setIsPending] = useState<boolean>(false); //not used yet
    const [_, setErr] = useState<any>(null); //error message from server
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
      setText(props.text);
      setUpdatedAt(props.updatedAt);
    }, [props.text, props.updatedAt]); //change the states when the props change.

    const handleEditMouseEnter = () => {
        setHoverEdit(true);
      };
    
      const handleEditMouseLeave = () => {
        setHoverEdit(false);
      };

      const handleEditClick = () => {
        setIsModalOpen(true);
      }

      const handleOk = async () => {
        setIsModalOpen(false);
        form.submit();
        //call backend to delete
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
      };
      type FieldType = {
        content : string;
      };

      //handle updating of textbox
      const onFinish: FormProps<FieldType>["onFinish"] = async (data) => {

        const announcementinfo = {
          Content: data.content,
        };
        try {
          const response = await fetch(
            import.meta.env.VITE_API_KEY + "/events/posts/" + props.id,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(announcementinfo),
              credentials: "include",
            }
          );
          console.log(response);
          
          if (!response.ok) {
            const respjson = await response.json();
            throw respjson.error;
          } else {
            
            const respjson = await response.json();
            setText(data.content);
            setUpdatedAt(respjson.updatedAt);
            
            
          }
        } catch (error: any) {
          setIsPending(false);
          setErr(error);
          console.error(error);
          if (error instanceof SyntaxError) {
            setIsPending(false);
            messageApi.success("Successfully updated announcement.");
          } else {
            messageApi.error("Could not update announcement.");
          }
        }
      };
    
    return (
        
        <div style = {{display : "flex", flexDirection : "row"}}
        onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
                <div style = {{display : "flex", alignItems : "end", paddingBottom : "5px"}}
            >
            <img src = {TextboxTail} height = "10px" width = "20px"></img>
            <div style = {{
                backgroundColor: theme1.token?.colorPrimary, 
                maxWidth : "600px",
                minHeight : "30px",
                borderRadius : "5px",
                color : "#f5f5f5",
                paddingTop : "5px",
                paddingLeft : "10px",
                paddingRight : "10px",
                paddingBottom : "5px",
                boxShadow: '2px 2px 2px rgba(0.20, 0.20, 0.20, 0.20)',
                display : "flex",
                
                }}>
                    <div style = {{maxWidth : "480px",
                        overflowWrap : "break-word",
                        wordBreak : "break-all"
                    }}>
                    {text}
                    </div>
                <div style = {{display : "flex",
                     alignItems : "flex-end", 
                     color : "#f5f5f5", 
                     fontSize : "11px", 
                     minHeight : "35px",
                     minWidth : "50px",
                     overflowWrap : "break-word",
                     paddingLeft : "2px"
                     }}>
                    {updatedAt == props.createdAt ? formatTimestamp(props.createdAt) : "Updated at " + formatTimestamp(props.updatedAt)}
                </div>
            </div>
            
        </div>
        <div style = {{ width : "50px", alignItems:"center" }}>
           {contextHolder}
            <button style = {{border : "none", padding : "5px", backgroundColor : "transparent"}}
            onMouseEnter={handleEditMouseEnter}
            onMouseLeave={handleEditMouseLeave}
            onClick = {handleEditClick}
            >
                {hover && (hoverEdit ? <EditTwoTone/> : <EditOutlined/>)}
               
            </button>
            <Modal
                cancelButtonProps={{ type: "text", color: "ffffff" }}
                title="Edit message"
                okText="Save"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
            <Form
            form={form}
            initialValues={{
                content : props.text
            }}
            onFinish={onFinish}
            >
            {/*Title*/}
            <Form.Item<FieldType>
                label="Content"
                name="content"
                rules={[{ required: true, message: "Input your title" }]}
            >
                <Input placeholder="Input your title" />
            </Form.Item>
           
            </Form>
        </Modal>
        </div>
        
        </div>
        
    )
}


export default Textbox;

function formatTimestamp(timestamp: string): string {
    const inputDate = new Date(timestamp);
    const now = new Date();
    const oneDayInMillis = 24 * 60 * 60 * 1000;

    // Difference in milliseconds
    const diff = now.getTime() - inputDate.getTime();

    if (diff > oneDayInMillis) {
        // Format as "DD Month YYYY"
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return inputDate.toLocaleDateString(undefined, options);
    } else {
        // Format as "HH:MM AM/PM"
        const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
        return inputDate.toLocaleTimeString(undefined, options);
    }
}