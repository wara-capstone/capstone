import "./Button.css";

export default function EventButton({ buttonText, onClick, style}) {
  return <button className="event-button" onClick={onClick} style={style} >{buttonText}</button>;
}
