import RestaurantCard from "./RestaurantCard";
import { useEffect, useState , useContext} from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utilis/useOnlineStatus";
import userContext from "../utilis/UserContext";

// definition of state react variable
// ! Whenever state variable updates, react triggers a reconciliation cycle (re-renders the component)

const Body = () => {
  const [listOfRestaurant, setlistOfRestaurant] = useState([]);
  const [filteredRestaurant, setFilteredRestaurant] = useState([]);
  const [searchText, setSearchText] = useState("");


  console.log("body rendering", listOfRestaurant);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetch(
      "https://www.swiggy.com/mapi/restaurants/list/v5?offset=0&is-seo-homepage-enabled=true&lat=28.63270&lng=77.21980&carousel=true&third_party_vendor=1"
    );
    const json = await data.json();
    console.log(
      json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
    setlistOfRestaurant(
      json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
    setFilteredRestaurant(
      json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
  };

  const onlineStatus = useOnlineStatus();
  if (onlineStatus === false) {
    return (<h1>Looks like you are offline !! check your Internet Connection</h1>)
  }

  const {isLoggedUser ,setLoggedinInfo} = useContext(userContext)

  // conditional rendering - Rendering on the basis of Condition
  // if (listOfRestaurant.length === 0) {
  //   return <Shimmer/>
  // }

  return listOfRestaurant.length === 0 ? (
    <Shimmer />
  ) : (
    <div className="body">    
      <div className="cont-bn">
      <div className="search-box">
      <input type="text" value={searchText} placeholder="Search" className="search" onChange={(e)=>{setSearchText(e.target.value)}} ></input>
      <button className="search-btn" onClick={() => {
          const filteredRestaurant = listOfRestaurant.filter((res)=>{
              return res.info.name.toLowerCase().includes(searchText.toLowerCase());
          })
          
              setFilteredRestaurant(filteredRestaurant);
      }}>Search</button>

      

  </div>
        <button className="filter-btn" onClick={() => {
          const filteredList = listOfRestaurant.filter((res) => res.info.avgRating > 4);
          setFilteredRestaurant(filteredList);
      }}>Top Rated Restaurants</button>
        
      </div>
      <div className="res-container">
        {filteredRestaurant.map((restaurant) => (
          <Link
            key={restaurant.info.id}
            to={"/restaurant/" + restaurant.info.id}
          >
            {restaurant.info.isOpen ? (
              <RestaurantCardPromoted resData={restaurant} />
            ) : (
              <RestaurantCard resData={restaurant} />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Body;
