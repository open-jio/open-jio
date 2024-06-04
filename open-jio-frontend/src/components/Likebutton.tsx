import { HeartOutlined } from "@ant-design/icons";

const Likebutton = () => {
  return (
    <div>
      <HeartOutlined
        key="Like"
        onClick={(event) => {
          event.stopPropagation();
          console.log("test");
        }}
      />
    </div>
  );
};

export default Likebutton;
