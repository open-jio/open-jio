import { Carousel } from "antd";
import Appbar from "../components/Appbar";
import { HeartOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { GrMapLocation } from "react-icons/gr";

const imageStyle: (image: string) => React.CSSProperties = (image: string) => ({
  width: "80vw",
  height: "100%",
  position: "absolute",
  backgroundSize: "100%",
  backgroundPosition: "center",
  backgroundImage: "url(" + image + ")",
  filter: "blur(20px)",
  zIndex: -1,
});
const Eventdetailpage = () => {
  return (
    <>
      <Appbar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Carousel
          autoplay
          arrows
          infinite={false}
          style={{
            width: "80vw",
          }}
        >
          <div>
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p style={imageStyle("https://picsum.photos/300")}></p>
              <img alt="example" src="https://picsum.photos/300" height={400} />
            </p>
          </div>
          <div>
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p style={imageStyle("https://picsum.photos/400")}></p>
              <img alt="example" src="https://picsum.photos/400" height={400} />
            </p>
          </div>
        </Carousel>
      </div>
      <div>
        Title:
        <br />
        Description:
        <br />
        <HeartOutlined /> 1
        <br />
        <GrMapLocation /> NUS CS
        <br />
        <CalendarOutlined /> 24/05/2024
        <br />
        <ClockCircleOutlined /> 3:38PM
      </div>
    </>
  );
};
export default Eventdetailpage;