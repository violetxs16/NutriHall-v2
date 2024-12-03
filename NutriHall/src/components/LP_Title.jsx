import diaryImg from "../assets/food_diary.png";
import menuImg from "../assets/menuu.png"
import { useNavigate } from "react-router-dom";

const LP_Title = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login")
  }

  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Your Dining Experience, Perfected.
        <span className="bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
          {" "}
          NutriHall
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
      "From discovering what’s on the menu to balancing your diet, Nutrihall empowers you to eat well, stay healthy, and make every meal count."
      </p>
      <div className="flex justify-center my-10">
        <button
          onClick={handleClick}
          className="bg-gradient-to-r from-orange-500 to-orange-800 py-3 px-4 mx-3 rounded-md"
        >
          Get Started
        </button>
      </div>
      <div className="flex mt-10 justify-center">
        <img className="rounded-lg w-1/2 border border-white shadow-sm shadow-orange-400 mx-2 my-4" src={menuImg} alt="Image not displayed." />
        <img className="rounded-lg w-1/2 border border-white shadow-sm shadow-orange-400 mx-2 my-4" src={diaryImg} alt="Image not displayed." />
      </div>
    </div>
  );
};

export default LP_Title;