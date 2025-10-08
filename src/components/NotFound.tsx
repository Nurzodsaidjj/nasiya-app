import { Link } from "react-router-dom";
import not from "../assets/images/404Error.avif";

export const NotFound = () => {
  return (
    <Link to={"/login"}>
      <div className="h-screen w-[100%] flex justify-center items-center">
        <img className="w-[1400px] object-cover" src={not} alt="img" />
      </div>
    </Link>
  );
};
