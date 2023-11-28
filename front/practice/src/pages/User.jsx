import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import UserProfile from "../components/UserProfile";

export default function User() {
  return (
    <div className="user">
      <Header />
      <UserProfile />
      <BottomNav />
    </div>
  );
}
