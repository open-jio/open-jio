import {Typography} from "antd";
import "/src/index.css";
import {
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { GrMapLocation } from "react-icons/gr";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Likebutton from "./Likebutton";

// const SeeUsersButton = () => {
//     const navigate = useNavigate();
  
//     return (
//       <Button
//         style={{ margin: '7px' }}
//         type="primary"
//         icon={<UserOutlined />}
//         size="middle"
//         iconPosition="start"
//         onClick={() => navigate("/dashboard")}
//       >
//       </Button>
//     );
//   };




type likeButtonPositionType = "topright" | "bottom" | "none";
const Eventcolumn = (props: {
  id : number;
  title: String;
  description: String;
  numberOfLikes: number;
  location: String;
  date: String;
  time: String;
  liked : boolean | undefined;
  joined : boolean | undefined;
  likeButtonPosition : likeButtonPositionType
}) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  return (
        <div className = "eventcolumn" onClick={() => navigate("/events/details/" + props.id)}
            onMouseEnter={() => {
                setHover(true);
              }}
              onMouseLeave={() => {
                setHover(false);
              }}
              style={{
                ...(hover
                  ? { boxShadow: "0px 0px 24px 0px rgba(0, 0, 0, 0.2)" }
                  : { boxShadow: "0px 0px 24px 0px rgba(0, 0, 0, 0)" })
              }} >
            <div style={{display: "flex", flexDirection: "row", alignContent: "row", width: "100%"}}>
                <div style = {{marginTop: 7, marginBottom: 7, marginRight : 20, marginLeft : 10}}>
                    <img
                    alt="event image"
                    src="https://picsum.photos/200"
                    height={180}
                    width={180}
                    style={{ borderRadius: '10px' }} 
                    />
                </div>
                <div className = "eventcolumndesc" style = {{
                    flex : 1, marginLeft : "10px"}}>
                    <Typography>
                        <h1 style={{ fontSize: '30px' }}>{props.title}</h1>
                        <p style={{ fontSize: '20px' }}>{props.description}</p>
                    </Typography>
                    <div style = {{justifyContent: "space-between", alignItems: "center"}}>
                        <div >
                        <GrMapLocation /> <span style={{ fontSize: '16px' }}>{props.location}</span>
                        <br />
                        <CalendarOutlined /> <span style={{ fontSize: '16px' }}>{props.date}</span>
                        <br />
                        <ClockCircleOutlined /> <span style={{ fontSize: '16px' }}>{props.time}</span>
                    </div>
                    <div >
                    {props.likeButtonPosition == "bottom" ? <Likebutton numberOfLikes = {props.numberOfLikes} 
                                    id = {props.id} 
                                    initiallyLiked = {props.liked} 
                                    eventType = {"column"}/>
                                    :null}
                    </div>    
                    </div>
                </div>
            </div>
            {props.likeButtonPosition == "topright" ? 
                <div style = {{alignItems : "flex-start"}}>
                <Likebutton numberOfLikes = {props.numberOfLikes} 
                                    id = {props.id} 
                                    initiallyLiked = {props.liked} 
                                    eventType = {"column"}/>
                      </div>
                : null
            }
            
        </div>


  );
};

export default Eventcolumn;
