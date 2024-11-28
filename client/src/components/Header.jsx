import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Payam</span>
            <span className="text-slate-700">App</span>
          </h1>
        </Link>

        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>

          {currentUser ? (
            <>
              <li
                onClick={() => navigate("/dashboard")}
                className="text-slate-700 hover:underline cursor-pointer"
              >
                Dashboard
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-slate-700 hover:underline"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <li className="text-slate-700 hover:underline">Sign in</li>
              </Link>
              <Link to="/sign-up">
                <li className="text-slate-700 hover:underline">Sign up</li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
