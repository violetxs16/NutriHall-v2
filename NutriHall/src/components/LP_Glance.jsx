import { CheckCircle2 } from "lucide-react";
import video1 from "../assets/video1.mov";
import { checklistItems } from "../constants";

const LP_Glance = () => {
  return (
    <div className="mt-20">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide">
        Taste, Track, and Transform{" "}
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
           - NutriHall.
        </span>
      </h2>
      <div className="flex flex-wrap justify-center">
        <div className="p-2 w-full lg:w-1/2">
            <video
                autoPlay
                loop
                muted
                className="rounded-lg w-9/10 border border-white shadow-sm shadow-orange-400 mx-2 my-4"
            >
                <source src={video1} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
        <div className="pt-12 w-full lg:w-1/2">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex mb-12">
              <div className="text-green-400 mx-6 bg-base-100 h-10 w-10 p-2 justify-center items-center rounded-full">
                <CheckCircle2 />
              </div>
              <div>
                <h5 className="mt-1 mb-2 text-xl">{item.title}</h5>
                <p className="text-md text-neutral-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LP_Glance;