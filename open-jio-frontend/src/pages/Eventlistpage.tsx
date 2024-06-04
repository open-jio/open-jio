import { Button, Col, Row, Skeleton, Typography } from "antd";
import Eventcard from "../components/Eventcard";
import { SearchOutlined } from "@ant-design/icons";
import Appbar from "../components/Appbar";
import { Event } from "../types/event";
import { useCallback, useRef, useState } from "react";
import { useEventsSearch } from "../components/useEventsSearch";
import SkeletonImage from "antd/es/skeleton/Image";

const Eventlistpage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  const {
    data: events,
    isPending: isLoading,
    hasMore,
  } = useEventsSearch(
    import.meta.env.VITE_API_KEY + "/events?filter=date&pageSize=5&page=",
    pageNumber
  );
  const lastEventElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <Appbar />
      <div style={{ margin: 10 }}>
        <Typography>
          <h1>Event Page</h1>
        </Typography>
        <p
          style={{
            margin: 30,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Sort by:
          <Button
            type="primary"
            icon={<SearchOutlined />}
            shape="round"
            style={{ width: 170 }}
          >
            Search
          </Button>
        </p>
        <Row gutter={[30, 25]}>
          {events.map((event: Event, index: number) => {
            if (events.length == index + 1) {
              return (
                <Col span={6} key={event.ID} ref={lastEventElementRef}>
                  {
                    <Eventcard
                      title={event.Title}
                      description={event.Description}
                      numberOfLikes={event.NumberOfLikes.toString()}
                      location={event.Location}
                      date={new Date(event.Time).toLocaleDateString()}
                      time={new Date(event.Time).toLocaleTimeString()}
                    />
                  }
                </Col>
              );
            } else {
              return (
                <Col span={6}>
                  {
                    <Eventcard
                      title={event.Title}
                      description={event.Description}
                      numberOfLikes={event.NumberOfLikes.toString()}
                      location={event.Location}
                      date={new Date(event.Time).toLocaleDateString()}
                      time={new Date(event.Time).toLocaleTimeString()}
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

export default Eventlistpage;
