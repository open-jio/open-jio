import { CalendarOutlined, ClockCircleOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import Meta from "antd/es/card/Meta";
import { GrMapLocation } from "react-icons/gr";
import Joineventbutton from "./Joineventbutton";
import Likebutton from "./Likebutton";

const Eventcardphone = (props: {
  id: number;
  title: String;
  description: String;
  numberOfLikes: number;
  location: String;
  date: String;
  time: String;
  liked: boolean | undefined;
  joined: boolean | undefined;
  imageurls: String[];
  fontsize?: number;
}) => {
  return (
    <Card
      style={{ width: "100vw", marginLeft: 15}}
      actions={[
        <Likebutton
          numberOfLikes={props.numberOfLikes}
          id={props.id}
          initiallyLiked={props.liked}
          eventType={"card"}
        />,
        <Joineventbutton
          eventid={props.id}
          initiallyJoined={props.joined}
          darkbackground={false}
        />,
        <EllipsisOutlined
          key="ellipsis"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "44px",
          }}
        />,
      ]}
    >
      <Meta
        avatar={
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=13" />
        }
        title={props.title}
        description={
          <div style={{ fontSize: props.fontsize }}>
            <div style={{}}>
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
            </div>
            <div style={{ height: "15vh" }}>
              <br />
              <div
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                <GrMapLocation /> {props.location}
              </div>
              <div
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                <CalendarOutlined /> {props.date}
              </div>
              <div
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                <ClockCircleOutlined /> {props.time}
              </div>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default Eventcardphone;
