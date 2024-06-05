const Joineventbutton = () => {
  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        console.log("test");
      }}
      style={{display: "flex", justifyContent: "center", alignItems:"center", height: "44px",}}
    >
      Join event
      
    </div>
  );
};

export default Joineventbutton;
