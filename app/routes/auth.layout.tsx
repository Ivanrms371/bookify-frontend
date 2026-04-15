// auth.layout.tsx
import { Outlet, redirect } from "react-router";
import { usersApi } from "@/modules/auth/api/users.api";

export async function clientLoader() {
  try {
    const user = await usersApi.getMe();

    console.log(user);

    if (user) {
      if (user.tenants.length) {
        return redirect(`/dashboard/${user.tenants[0].id}`);
      }
      return redirect("/onboarding");
    }
  } catch (error: any) {
    if (error?.response?.status === 404 || error?.status === 404) {
      return null; // Stay on login
    }
    // Re-throw unhandled errors or standard Redirect Responses
    if (error instanceof Response) throw error;
  }
  return null;
}

export default function AuthLayout() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Outlet />
    </div>
  );
}
