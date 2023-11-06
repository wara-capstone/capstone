function Modal(props) {
    const { message } = props;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          bottom: 130,
          left: 0,
          width: "100%",
          height: 150,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "300%",
            textAlign: "center",
            borderRadius: 20,
            background: "grey",
            fontSize: 20,
            color: "white",
          }}
        >
          <p>{message}</p>
        </div>
      </div>
    );
  }
  
  export default Modal;