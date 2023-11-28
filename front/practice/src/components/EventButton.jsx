import "./Button.css";

export default function EventButton({ buttonText, onClick }) {
  return <button className="event-button" onClick={onClick} >{buttonText}</button>;
}
