import { Button, Col, Row, Skeleton, Typography } from "antd";
import SkeletonImage from "antd/es/skeleton/Image";
import { useState } from "react";
import Eventcard from "../components/Eventcard";
import { SearchOutlined } from "@ant-design/icons";
import Appbar from "../components/Appbar";

const Eventlistpage = () => {
  const [loading, setLoading] = useState(false); //toggle to false when loading is done
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
          {Array.from({ length: 5 }, (_, index) => (
            <Col span={6} key={index}>
              {loading && (
                <>
                  <SkeletonImage
                    active
                    style={{
                      width: 450,
                      height: 450,
                    }}
                  />{" "}
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
      </div>
    </div>
  );
};

export default Eventlistpage;
