const Joineventbutton = () => {
  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        console.log("test");
      }}
    >
      Join event
    </div>
  );
};

export default Joineventbutton;
