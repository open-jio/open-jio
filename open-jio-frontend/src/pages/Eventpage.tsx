import { Button, Col, Row, Skeleton, Typography } from "antd";
import SkeletonImage from "antd/es/skeleton/Image";
import { useState } from "react";
import Eventcard from "../components/Eventcard";
import { SearchOutlined } from "@ant-design/icons";

const EventPage = () => {
  const [loading, setLoading] = useState(false); //toggle to false when loading is done
  return (
    <>
      <Typography>
        <h1>Event Page</h1>
      </Typography>
      Sort by:
      <Button type="default" icon={<SearchOutlined />} shape="round">
        Search
      </Button>
      <Row gutter={10}>
        {Array.from({ length: 5 }, (_, index) => (
          <Col span={5} key={index}>
            {loading && (
              <>
                <SkeletonImage active style={{ width: 400, height: 400 }} />{" "}
                <Skeleton loading={loading}></Skeleton>
              </>
            )}
            {!loading && (
              <Eventcard
                title="Activity 1"
                description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                numberOfLikes="1"
                location="Computing 1,
            13 Computing Drive,
            Singapore 117417"
                date="16/05/2024"
                time="1pm"
              />
            )}
          </Col>
        ))}
      </Row>
    </>
  );
};

export default EventPage;
