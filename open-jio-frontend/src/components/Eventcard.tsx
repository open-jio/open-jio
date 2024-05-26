import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import "/src/index.css";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { GrMapLocation } from "react-icons/gr";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Eventcard = (props: {
  title: String;
  description: String;
  numberOfLikes: String;
  location: String;
  date: String;
  time: String;
}) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  return (
    <Card
    onClick={()=> navigate("/events/:id")}
      bordered={true}
      cover={
        <img
          alt="example"
          src="https://picsum.photos/200"
          height={400}
          width={400}
        />
      }
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      style={{
        ...(hover
          ? { boxShadow: "0px 0px 24px 0px rgba(0, 0, 0, 0.9)" }
          : { boxShadow: "0px 0px 24px 0px rgba(0, 0, 0, 0.3)" }),
      }} //makes more shadow when we hover
    >
      <Meta title={props.title} description={props.description} style={{}} />
      <br />
      <HeartOutlined /> {props.numberOfLikes}
      <br />
      <GrMapLocation /> {props.location}
      <br />
      <CalendarOutlined /> {props.date}
      <br />
      <ClockCircleOutlined /> {props.time}
    </Card>
  );
};

export default Eventcard;
