import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";

type Props = {};

export default function PrivateRoute({}: Props) {
  const { currentUser } = useSelector((state: RootState) => state.user);
  console.log(currentUser);
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
