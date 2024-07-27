import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  FormProps,
  Button,
  message,
  Upload,
  UploadFile,
  UploadProps,
  GetProp,
  Typography,
} from "antd";
import Appbar from "../components/Appbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImgCrop from "antd-img-crop";

type FieldType = {
  title: string;
  description: string;
  location: string;
  date: Date;
  time: Date;
  images: UploadFile[];
};
const Createeventpage = () => {
  const [form] = Form.useForm();
  const [, setIsPending] = useState<boolean>(false); //not used yet
  const [, setErr] = useState<any>(null); //error message from server
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish: FormProps<FieldType>["onFinish"] = async (data) => {
    const datesplit = new Date(data.date).toLocaleDateString().split("/");
    const year = Number(datesplit[2]);
    const monthindex = Number(datesplit[0]) - 1;
    const day = Number(datesplit[1]);
    const timesplit = new Date(data.time);
    const hour = timesplit.getHours();
    const minute = timesplit.getMinutes();
    const second = timesplit.getSeconds();
    const newdate = new Date(year, monthindex, day, hour, minute, second);
    console.log(newdate.toISOString());
    console.log("Creating event");
    console.log(fileList);
    const formData: any = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append("files", fileList[i].originFileObj);
    }
    formData.append("Title", data.title);
    formData.append("Description", data.description);
    formData.append("Location", data.location);
    formData.append("Datetime", newdate.toISOString());
    setIsPending(true);
    // try {
    //   const response = await fetch(import.meta.env.VITE_API_KEY + "/events", {
    //     method: "POST",
    //     headers: {},
    //     body: formData,
    //     credentials: "include",
    //   });
    //   if (response.status == 401) {
    //     localStorage.setItem("isloggedin", "false");
    //     navigate("/");
    //     return;
    //   }
    //   if (!response.ok) {
    //     const respjson = await response.json();
    //     throw respjson.error;
    //   } else {
    //     setIsPending(false);
    //     navigate("/events");
    //     messageApi.success("Successfully created event.");
    //   }
    // } catch (error: any) {
    //   setIsPending(false);
    //   setErr(error);
    // }


    try {
      const response = await fetch(import.meta.env.VITE_RECOMMENDER_API_KEY + "/load_events", {
        method: "GET",
        headers: {},
        credentials: "include",
      });
      
      if (!response.ok) {
        const respjson = await response.json();
        throw respjson.error;
      } else {
      }
    } catch (error: any) {
      setIsPending(false);
      setErr(error);
    }
  };

  function onFinishFailed(): void {
    console.log("failed to upload image");
  }
  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  return (
    <>
      {contextHolder}
      <Appbar />
      <div style={{ margin: 10 }}>
        <Typography>
          <h1>Event Page</h1>
        </Typography>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "1000px",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            layout="horizontal"
            style={{ width: "70vw", margin: "auto" }}
          >
            {/*Title*/}
            <Form.Item<FieldType>
              label="Title"
              name="title"
              rules={[{ required: true, message: "Input your title" }]}
            >
              <Input placeholder="Input your title" />
            </Form.Item>
            {/*Description*/}
            <Form.Item<FieldType>
              label="Description"
              name="description"
              rules={[{ required: true, message: "Input your description" }]}
            >
              <Input.TextArea placeholder="Input your description" />
            </Form.Item>
            {/*Date*/}
            <Form.Item<FieldType>
              label="Date"
              name="date"
              rules={[{ required: true, message: "Input date" }]}
            >
              <DatePicker format={"YYYY-MM-DD"} />
            </Form.Item>
            {/*Time*/}
            <Form.Item<FieldType>
              label="Time"
              name="time"
              rules={[{ required: true, message: "Input time" }]}
            >
              <TimePicker use12Hours={true} />
            </Form.Item>
            {/*Location*/}
            <Form.Item<FieldType>
              label="Location"
              name="location"
              rules={[{ required: true, message: "Input your location" }]}
            >
              <Input placeholder="Input your location" />
            </Form.Item>
            {/*Images*/}
            <Form.Item<FieldType>
              label = "Images">
              <ImgCrop rotationSlider>
                <Upload
                  beforeUpload={() => false}
                  action={undefined}
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                >
                  {fileList.length < 3 && "+ Upload"}
                </Upload>
              </ImgCrop>
            </Form.Item>
            {/*Submit button*/}
            <Form.Item
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "right",
              }}
            >
              <Button type="primary" htmlType="submit">
                Create event
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Createeventpage;
