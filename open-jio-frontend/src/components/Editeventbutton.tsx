import {
  Button,
  Modal,
  message,
  Form,
  Input,
  DatePicker,
  TimePicker,
  FormProps,
} from "antd";

import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import dayjs from "dayjs";
import { Event } from "../types/event";

const EditEventButton = (props: {
  id: number;
  title: String;
  description: String;
  location: String;
  date: String;
  time: String;
  events: Array<any> | any;
  setEvents: React.Dispatch<any>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setIsPending] = useState<boolean>(false); //not used yet
  const [_, setErr] = useState<any>(null); //error message from server
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
    console.log(props.date);
    console.log(dayjs(props.date.toString(), "M/D/YYYY"));
    console.log(
      dayjs(props.time.toString(), "hh:mm:ss A")
        .format("h:mm a")
        .replace(/\s/g, "")
    );
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    form.submit();
    //call backend to delete
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

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
    const eventinfo = {
      title: data.title,
      description: data.description,
      location: data.location,
      datetime: newdate.toISOString(),
    };
    try {
      const response = await fetch(
        import.meta.env.VITE_API_KEY + "/events/" + props.id,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventinfo),
          credentials: "include",
        }
      );
      console.log(response);
      if (response.status == 401) {
        localStorage.setItem("isloggedin", "false");
        navigate("/");
        return;
      }
      if (!response.ok) {
        const respjson = await response.json();
        throw respjson.error;
      } else {
        setIsPending(false);
        //show notif that it is deleted
        //now, update the event
        const updatedEvent = props.events.find(
          (event: Event) => event.ID === props.id
        ) as Event;
        updatedEvent.Title = eventinfo["title"];
        updatedEvent.Description = eventinfo["description"];
        updatedEvent.Location = eventinfo["location"];

        updatedEvent.Time = eventinfo.datetime

        props.setEvents(props.events);
        messageApi.success("Successfully updated event.");
        //navigate back to dashboard
        navigate("/dashboard");
      }
    } catch (error: any) {
      setIsPending(false);
      setErr(error);
      console.error(error);
      if (error instanceof SyntaxError) {
        setIsPending(false);
        messageApi.success("Successfully updated event.");
        navigate("/dashboard");
      } else {
        messageApi.error("Could not update event.");
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  //form stuff
  type FieldType = {
    title: string;
    description: string;
    location: string;
    date: Date;
    time: Date;
  };

  return (
    <>
      {contextHolder}
      <Button
        style={{ margin: "7px" }}
        type="primary"
        icon={<EditOutlined />}
        size="middle"
        iconPosition="start"
        onClick={showModal}
      ></Button>
      <Modal
        cancelButtonProps={{ type: "text", color: "ffffff" }}
        title="Update your event"
        okText="Save"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          initialValues={{
            title: props.title.toString(),
            description: props.description.toString(),
            location: props.location.toString(),
            date: dayjs(props.date.toString(), "M/D/YYYY"),
            time: dayjs(props.time.toString(), "hh:mm:ss A"),
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
            <Input placeholder="Input your description" />
          </Form.Item>

          {/*Date*/}
          <Form.Item label="Date" name="date">
            <DatePicker />
          </Form.Item>

          {/*Time*/}
          <Form.Item label="Time" name="time">
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
        </Form>
      </Modal>
    </>
  );
};

export default EditEventButton;
