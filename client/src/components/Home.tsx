import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";

export function Home() {
  const user = AuthService.getCurrentUser();
  let navigateTo = "login";

  if (user) {
    switch (user.role) {
      case 0:
        navigateTo = "/buyer";
        break;
      case 1:
        navigateTo = "/seller";
        break;
      default:
        break;
    }
  }
  return user ? (
    <Navigate to={navigateTo} replace />
  ) : (
    <Navigate to={"login"} replace />
  );
}
