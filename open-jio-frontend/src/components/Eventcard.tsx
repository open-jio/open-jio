import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import '/src/index.css';
import { CalendarOutlined, ClockCircleOutlined, HeartOutlined } from "@ant-design/icons";
import { FaMapLocation } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";


const Eventcard = (props: {title: String, description: String, numberOfLikes: String, location: String, date: String, time: String}) => {
    return ( 
        <Card
              hoverable
              cover={<img alt="example" src="https://picsum.photos/200" height={300} />}
            >
              <Meta title={props.title} description={props.description} style={{}}/>
              <br/>
              <HeartOutlined /> {props.numberOfLikes}
              <br/>
              <GrMapLocation/> {props.location}
              <br/>
              <CalendarOutlined/> {props.date}
              <br/>
              <ClockCircleOutlined/> {props.time}

            </Card>
     );
}
 
export default Eventcard;