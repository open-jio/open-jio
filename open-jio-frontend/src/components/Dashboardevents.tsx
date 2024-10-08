import {Col, Divider, Row, Skeleton } from "antd";
import { Event } from "../types/event";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEventsDashboard } from "../components/useEventsSearch";
import SkeletonImage from "antd/es/skeleton/Image";
import Eventcolumn from "./Eventcolumn";
import DeleteEventButton from "./Deleteeventbutton";
import EditEventButton from "./Editeventbutton";
import SeeUsersButton from "./Seeusersbutton";
import Likebutton from "./Likebutton";

type ActionType = 'liked' | 'joined' | 'created';
interface FetchEventsProps {
  action: ActionType;
}


const Dashboardevents = ({action} : FetchEventsProps) => {

  //infinite scroll logic
  const [data, setData] = useState<Array<any> | any>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [firstTime, setFirstTime] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);



  const {
    data: events,
    isPending: isLoading,
    hasMore,
  } = useEventsDashboard(
    import.meta.env.VITE_API_KEY + "/" + action + "events?" +
      "pageSize=5&page=",  pageNumber, firstTime, data, setData
  );

  useEffect(() => {
    setPageNumber(1);
    setFirstTime(true);
  }, [action]);
  
  const lastEventElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
          setFirstTime(false);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, action]
  );

  return (
    <div style={{ width: "100%", overflowX: "hidden", marginBottom : "20px" }}>
      <div style={{ margin: 20 }}>


        <Row gutter={[30, 25]}>
          {events.map((event: Event, index: number) => {
            if (events.length == index + 1) {
              return (
                <Col span={24} key={event.ID} ref={lastEventElementRef}>
                  {
                    <Eventcolumn
                    id = {event.ID}
                    title={event.Title}
                    description={event.Description}
                    numberOfLikes={event.NumberOfLikes}
                    location={event.Location}
                    date={new Date(event.Time).toLocaleDateString()}
                    time={new Date(event.Time).toLocaleTimeString()}
                    liked = {event.Liked}
                    joined = {event.Joined}
                    imageurls={event.Imageurls}
                    likeButtonPosition= {"topright"}
                  />
                  }
                </Col>
              );
            } else {
              return (
                <Col span={24}>
                  {
                    <Eventcolumn
                      id = {event.ID}
                      title={event.Title}
                      description={event.Description}
                      numberOfLikes={event.NumberOfLikes}
                      location={event.Location}
                      date={new Date(event.Time).toLocaleDateString()}
                      time={new Date(event.Time).toLocaleTimeString()}
                      liked = {event.Liked}
                      joined = {event.Joined}
                      imageurls={event.Imageurls}
                      likeButtonPosition={"topright"}
                    />
                  }
                </Col>
              );
            }
          })}
          {isLoading &&
            Array.from({ length: 5 }, (_, index) => (
              <Col span={6} key={index}>
                <>
                  <SkeletonImage
                    active
                    style={{
                      width: 450,
                      height: 450,
                    }}
                  />{" "}
                  <Skeleton loading={isLoading}></Skeleton>
                </>
              </Col>
            ))}
        </Row>
      </div>
      <Divider/>
      <br/>

    </div>
  );
};

export default Dashboardevents;


export const DashboardCreatedEvents = () => {

  //infinite scroll logic
  const [data, setData] = useState<Array<any> | any>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [firstTime, setFirstTime] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const {
    data: _,
    isPending: isLoading,
    hasMore,
  } = useEventsDashboard(
    import.meta.env.VITE_API_KEY + "/createdevents?" +
      "pageSize=5&page=",  pageNumber, firstTime, data, setData
  );

  
  const lastEventElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
          setFirstTime(false);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <div style={{ margin: 20 }}>


          {data.map((event: Event, index: number) => {
            if (data.length == index + 1) {
              return (
                <Col span={24} key={event.ID} ref={lastEventElementRef}>
                  {
                    <div>
                    <div style = {{display : "flex", justifyContent: "space-between" }}>
                    <Eventcolumn
                      id = {event.ID}
                      title={event.Title}
                      description={event.Description}
                      numberOfLikes={event.NumberOfLikes}
                      location={event.Location}
                      date={new Date(event.Time).toLocaleDateString()}
                      time={new Date(event.Time).toLocaleTimeString()}
                      liked = {event.Liked}
                      joined = {event.Joined}
                      imageurls={event.Imageurls}
                      likeButtonPosition= {"none"}
                    />
                    <div style = {{alignContent : "flex-end"}}>
                      <SeeUsersButton title = {event.Title} id = {event.ID}/>
                      <EditEventButton 
                          id = {event.ID}
                          title={event.Title}
                          description={event.Description}
                          location={event.Location}
                          date={new Date(event.Time).toLocaleDateString()}
                          time={new Date(event.Time).toLocaleTimeString()}
                          events = {data}
                          setEvents = {setData}
                          />
                      <DeleteEventButton title = {event.Title} id = {event.ID} events = {data}
                          setEvents = {setData}/>
                  </div>
                    </div>
                    <Divider/>
                    </div>
                  }
                </Col>
              );
            } else {
              return (
                <Col span={24}>
                  {
                    <div>
                    <div style = {{display : "flex", justifyContent: "space-between" }}>
                    <Eventcolumn
                      id = {event.ID}
                      title={event.Title}
                      description={event.Description}
                      numberOfLikes={event.NumberOfLikes}
                      location={event.Location}
                      date={new Date(event.Time).toLocaleDateString()}
                      time={new Date(event.Time).toLocaleTimeString()}
                      liked = {event.Liked}
                      joined = {event.Joined}
                      imageurls={event.Imageurls}
                      likeButtonPosition = {"none"}
                    />
                    <div style = {{display : "flex", flexDirection: "column", alignItems: "flex-end"}}>
                          <div style = {{display : "flex", marginTop : "10px"}}>
                          <Likebutton numberOfLikes = {event.NumberOfLikes} 
                                          id = {event.ID} 
                                          initiallyLiked = {event.Liked} 
                                          eventType = {"column"}/>
                          </div>
                          <div style = {{display : "flex",justifyContent: "flex-end", marginTop: "auto" }}>
                        <SeeUsersButton title = {event.Title} id = {event.ID}/>
                        <EditEventButton 
                            id = {event.ID}
                            title={event.Title}
                            description={event.Description}
                            location={event.Location}
                            date={new Date(event.Time).toLocaleDateString()}
                            time={new Date(event.Time).toLocaleTimeString()}
                            events = {data}
                            setEvents = {setData}
                            />
                        <DeleteEventButton title = {event.Title} id = {event.ID} events = {data}
                          setEvents = {setData} />
                       </div>
                       
                    </div>
                    </div>
                    <Divider/>
                    </div>
                    
                  }
                </Col>
              );
            }
          })}
          {isLoading &&
            Array.from({ length: 5 }, (_, index) => (
              <Col span={6} key={index}>
                <>
                  <SkeletonImage
                    active
                    style={{
                      width: "100%",
                      height: 450,
                    }}
                  />{" "}
                  <Skeleton loading={isLoading}></Skeleton>
                </>
              </Col>
            ))}
      </div>
      <Divider/>
      <br/>
    </div>
  );
};

