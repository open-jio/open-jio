import {Col, Row, Skeleton, Tag, Typography } from "antd";
import Eventcard from "../components/Eventcard";
import Appbar from "../components/Appbar";
import { Event } from "../types/event";
import { useCallback, useRef, useState } from "react";
import {useSearchParams } from "react-router-dom";
import useEventsSearch from "../components/useEventsSearch";
import SkeletonImage from "antd/es/skeleton/Image";
import SearchBar from "../components/Searchbar";

const tagsData = ["Date", "Likes"];
const Eventlistpage = () => {
  //sorting button logic
  const [selectedTags, setSelectedTags] = useState<string[]>(["Date"]);
  const handleChange = (tag: string, checked: boolean) => {
    var nextSelectedTags = checked
      ? [tag]
      : selectedTags.filter((t) => t !== tag);
    if (nextSelectedTags.length==0) {
      nextSelectedTags=["Date"]
    }
    console.log("Sorting by: ", nextSelectedTags);
    setPageNumber(1);
    setSelectedTags(nextSelectedTags);
  };
  //infinite scroll logic
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParams] = useSearchParams({ search: '' });
  const [firstTime, setFirstTime] = useState(true);
  let searchItem = searchParams.get("search");
  const observer = useRef<IntersectionObserver | null>(null);

  if (searchItem != '') {
    searchItem = "search=" + searchItem + "&";
  } //now search item is either "search=searchitem&" or null.


  const {
    data: events,
    isPending: isLoading,
    hasMore,
  } = useEventsSearch(
    import.meta.env.VITE_API_KEY + "/events?" + searchItem + 
    "filter=" +
      selectedTags[0].toLowerCase() +
      "&pageSize=5&page=",  pageNumber, firstTime
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
    [isLoading, hasMore, searchItem]
  );

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <Appbar />
      <div style={{ margin: 10 }}>
        <Typography>
          <h1>Event Page</h1>
        </Typography>
        <Row>
          <Col
            flex={4}
            style={{
              margin: 20,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <div style={{ margin: 20 }}>Sort by:</div>
            {tagsData.map<React.ReactNode>((tag) => (
              <Tag.CheckableTag
                style={{ margin: 20, padding: 10, fontSize: 15 }}
                key={tag}
                checked={selectedTags.includes(tag)}
                onChange={(checked) => handleChange(tag, checked)}
              >
                {tag}
              </Tag.CheckableTag>
            ))}
          </Col>
          <Col
            flex={1}
            style={{ margin: 20, display: "flex", justifyContent: "center", alignItems: "center"}}
          >
            <SearchBar setPageNumber = {setPageNumber} setFirstTime = {setFirstTime}/>
          </Col>
        </Row>
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
                      joined = {event.Joined}
                      imageurls={event.Imageurls}
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
                      joined = {event.Joined}
                      imageurls={event.Imageurls}
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