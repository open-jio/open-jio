import { Carousel, Typography } from "antd";
import Appbar from "../components/Appbar";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { GrMapLocation } from "react-icons/gr";
import { useParams } from "react-router-dom";
import { Event } from "../types/event";
import { useEffect, useState } from "react";
import Likebutton from "../components/Likebutton";
import Joineventbutton from "../components/Joineventbutton";

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
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [, setIsPending] = useState<boolean>(false); //not used yet
  const [, setErr] = useState<any>(null); //error message from server
  const fetchEvent = async () => {
    console.log("Fetching event");
    setIsPending(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_API_KEY + "/events/" + id,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const respjson = await response.json();
      if (!response.ok) {
        throw respjson.error;
      } else {
        
        setEvent(respjson.event);
      }
    } catch (error: any) {
      setIsPending(false);
      setErr(error);
    }
  };
  useEffect(() => {
    fetchEvent();
  }, []);
  return (
    <>
      <Appbar />
      {event && event.ID != 0 && (
        <>
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
                borderRadius: "30px",
                overflow: "hidden",
              }}
            >
              {event.Imageurls !== undefined && event.Imageurls.length!=0 && event.Imageurls.map((image) => (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <p style={imageStyle(image)}></p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <img
                        alt="example"
                        src={image}
                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {event.Imageurls==null || event.Imageurls.length==0 &&
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <p style={imageStyle("https://picsum.photos/940/470")}></p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <img
                        alt="example"
                        src={"https://picsum.photos/940/470"}
                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                      />
                    </div>
                  </div>
                </div>
              }
            </Carousel>
          </div>
          <div
            className="detailpagecomputerview"
            style={{
              maxWidth: "100%",
              position: "relative",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
              }}
            >
              <div
                style={{
                  flex: 1,
                  maxWidth: "70%",
                  paddingTop: "100px",
                  paddingLeft: "10vw",
                }}
              >
                <div>
                  <Typography
                    style={{
                      fontWeight: 800,
                      fontSize: "3rem",
                      lineHeight: "4rem",
                      color: "#253954",
                    }}
                  >
                    {event.Title}
                  </Typography>
                </div>
                <div>
                  <Typography
                    style={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      lineHeight: "2rem",
                      color: "#253954",
                    }}
                  >
                    {event.Description}
                  </Typography>
                </div>
                <div
                  style={{
                    maxWidth: 50,
                    fontWeight: 600,
                    fontSize: "1rem",
                    lineHeight: "1.5rem",
                    color: "#253954",
                  }}
                >
                  <Likebutton
                    numberOfLikes={event.NumberOfLikes}
                    id={event.ID}
                    initiallyLiked={undefined}
                    eventType={"card"}
                  />
                </div>
              </div>
              <div
                className="detailpagerightbar"
                style={{
                  WebkitFlex: 1,
                  flex: 1,
                  maxWidth: "360px",
                  paddingTop: 64,
                  paddingLeft: 24,
                }}
              >
                <div
                  className="detailpagebox"
                  style={{
                    display: "flex",
                    height: "auto",
                    borderRadius: "20px",
                    border: "1px solid #eae8ed",
                    position: "relative",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      padding: "16px",
                      display: "flex",
                      width: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      className="detailpageorangeborder"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "inset 0 0 0 2px #F2613F",
                        width: "100%",
                        borderRadius: 10,
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        className="detailpagedetails"
                        style={{
                          fontWeight: 500,
                          fontSize: "1.5rem",
                          lineHeight: "4rem",
                          color: "#253954",
                          paddingLeft: 30,
                          paddingRight: 30,
                        }}
                      >
                        <div>
                          <GrMapLocation /> {event.Location}
                        </div>
                        <div>
                          <CalendarOutlined />{" "}
                          {new Date(event.Time).toLocaleDateString()}
                        </div>

                        <div>
                          <ClockCircleOutlined />{" "}
                          {new Date(event.Time).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                        width: "100%",
                        marginTop: 10,
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#F2613F",
                          width: "100%",
                          borderRadius: 10,
                          color: "#fff",
                          fontWeight: 400,
                          fontSize: "1rem",
                        }}
                      >
                        <Joineventbutton
                          eventid={event.ID}
                          initiallyJoined={event.Joined}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="detailpagephoneview">
            <div
              style={{
                display: "flex",
                width: "100%",
              }}
            >
              <div
                style={{
                  maxWidth: "100%",
                  paddingTop: "20px",
                  paddingLeft: "10vw",
                }}
              >
                <div>
                  <Typography
                    style={{
                      fontWeight: 800,
                      fontSize: "3rem",
                      lineHeight: "4rem",
                      color: "#253954",
                    }}
                  >
                    {event.Title}
                  </Typography>
                </div>
                <div>
                  <Typography
                    style={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      lineHeight: "2rem",
                      color: "#253954",
                    }}
                  >
                    {event.Description}
                  </Typography>
                </div>
                <div
                  style={{
                    maxWidth: 50,
                    fontWeight: 600,
                    fontSize: "auto",
                    lineHeight: "1.5rem",
                    color: "#253954",
                  }}
                >
                  <Likebutton
                    numberOfLikes={event.NumberOfLikes}
                    id={event.ID}
                    initiallyLiked={undefined}
                    eventType={"card"}
                  />
                </div>
              </div>
            </div>
            <div style={{ height: 713.6 }}></div>
            <div
              className="detailpagebottombar"
              style={{
                WebkitFlex: 1,
                flex: 1,
                position: "fixed",
                width: "100%",
                bottom: 0,
                zIndex: 90,
              }}
            >
              <div
                className="detailpagebox"
                style={{
                  display: "flex",
                  height: "auto",
                  borderRadius: "20px",
                  border: "1px solid #eae8ed",
                  position: "relative",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    display: "flex",
                    width: "100%",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className="detailpageorangeborder"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "inset 0 0 0 2px #F2613F",
                      width: "100%",
                      borderRadius: 10,
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="detailpagedetails"
                      style={{
                        fontWeight: 500,
                        fontSize: "1.5rem",
                        lineHeight: "4rem",
                        color: "#253954",
                        paddingLeft: 30,
                        paddingRight: 30,
                      }}
                    >
                      <div>
                        <GrMapLocation /> {event.Location}
                      </div>
                      <div>
                        <CalendarOutlined />{" "}
                        {new Date(event.Time).toLocaleDateString()}
                      </div>

                      <div>
                        <ClockCircleOutlined />{" "}
                        {new Date(event.Time).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                      width: "100%",
                      marginTop: 10,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#F2613F",
                        width: "100%",
                        borderRadius: 10,
                        color: "#fff",
                        fontWeight: 400,
                        fontSize: "1rem",
                      }}
                    >
                      <Joineventbutton
                        eventid={event.ID}
                        initiallyJoined={event.Joined}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Eventdetailpage;
