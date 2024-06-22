import {Col, Row, Skeleton } from "antd";
import Eventcard from "../components/Eventcard";
import { Event } from "../types/event";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEventsDashboard } from "../components/useEventsSearch";
import SkeletonImage from "antd/es/skeleton/Image";

type ActionType = 'liked' | 'joined' | 'created';
interface FetchEventsProps {
  action: ActionType;
}

const Dashboardevents = ({action} : FetchEventsProps) => {

  //infinite scroll logic
  const [pageNumber, setPageNumber] = useState(1);
  const [firstTime, setFirstTime] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const {
    data: events,
    isPending: isLoading,
    hasMore,
  } = useEventsDashboard(
    import.meta.env.VITE_API_KEY + "/" + action + "events?" +
      "pageSize=5&page=",  pageNumber, firstTime
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
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <div style={{ margin: 20 }}>


        <Row gutter={[30, 25]}>
          {events.map((event: Event, index: number) => {
            if (events.length == index + 1) {
              return (
                <Col span={6} key={event.ID} ref={lastEventElementRef}>
                  {
                    <Eventcard
                      id = {event.ID}
                      title={event.Title}
                      description={event.Description}
                      numberOfLikes={event.NumberOfLikes}
                      location={event.Location}
                      date={new Date(event.Time).toLocaleDateString()}
                      time={new Date(event.Time).toLocaleTimeString()}
                      liked = {event.Liked}
                    />
                  }
                </Col>
              );
            } else {
              return (
                <Col span={6}>
                  {
                    <Eventcard
                      id = {event.ID}
                      title={event.Title}
                      description={event.Description}
                      numberOfLikes={event.NumberOfLikes}
                      location={event.Location}
                      date={new Date(event.Time).toLocaleDateString()}
                      time={new Date(event.Time).toLocaleTimeString()}
                      liked = {event.Liked}
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
    </div>
  );
};

export default Dashboardevents;