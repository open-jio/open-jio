import { Avatar, Card } from "antd";
import Meta from "antd/es/card/Meta";
import "/src/index.css";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { GrMapLocation } from "react-icons/gr";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Likebutton from "./Likebutton";
import Joineventbutton from "./Joineventbutton";

const Eventcard = (props: {
  id : number;
  title: String;
  description: String;
  numberOfLikes: number;
  location: String;
  date: String;
  time: String;
  liked : boolean | undefined;
  joined : boolean | undefined;
  imageurls : String[];
  fontsize? : number;
}) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  return (
    <Card
      onClick={() => navigate("/events/details/" + props.id)}
      bordered={true}
      cover={
        <img
          alt="example"
          src={props.imageurls.length == 0 ? "https://picsum.photos/200" : props.imageurls[props.imageurls.length - 1].toString()}
          height={250}
          width={400}
        />
      }
      actions={[
        <Likebutton numberOfLikes = {props.numberOfLikes} id = {props.id} initiallyLiked = {props.liked} eventType = {"card"}/>,
        <Joineventbutton eventid = {props.id} initiallyJoined = {props.joined} darkbackground = {false}/>,
        <EllipsisOutlined key="ellipsis" style={{display: "flex", justifyContent: "center", alignItems:"center", height: "44px",}}/>,
      ]}
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
      <Meta
        avatar={
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=13" />
        }
        title={props.title}
        description={
          <div style = {{fontSize : props.fontsize}}>
            <div
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {props.description}
            </div>
            <br />
            <GrMapLocation /> {props.location}
            <br />
            <CalendarOutlined /> {props.date}
            <br />
            <ClockCircleOutlined /> {props.time}
          </div>
        }
      />
    </Card>
  );
};

export default Eventcard;
