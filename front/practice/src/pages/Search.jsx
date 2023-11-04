import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CardList from "../components/CardList";

export default function Search() {
  return (
    <div className="search">
      <Header />

      <SearchBar/>

      <CardList />

      <BottomNav />
    </div>
  );
}
