import { HeartOutlined } from "@ant-design/icons";

const Likebutton = (props: { numberOfLikes: number }) => {
  return (
    <div onClick={(event) => {
      event.stopPropagation();
      console.log("test");
      
    }}
    style={{display: "flex", flexDirection:"column" ,justifyContent: "center", alignItems:"center"}}
    >
      <div>
        <HeartOutlined
          key="Like"
          
        />
      </div>
      <div>{props.numberOfLikes}</div>
    </div>
  );
};

export default Likebutton;
