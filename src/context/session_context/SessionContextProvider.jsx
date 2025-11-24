import { SessionContext } from "./SessionContext";
import Loading from "../../components/global/Loading";
import useLogin from "../../hooks/useLogin";
import Auth from "../../components/auth/Auth";
import UpdatePasswordForm from "../../components/auth/UpdatePasswordForm";

export default function SessionProvider({ children }) {
  const { session, loading, inviteLogin, recoveryLogin, resetFlags } =
    useLogin();

  if (loading) return <Loading />;

  if (recoveryLogin || inviteLogin)
    return (
      <UpdatePasswordForm
        onComplete={() => {
          resetFlags();
        }}
      />
    );

  if (!session)
    return (
      <div className="h-screen w-screen flex items-center justify-center flex-col">
        <div className="text-4xl">TinyShare™️</div>
        <Auth />
      </div>
    );

  return (
    <SessionContext.Provider
      value={{
        session,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
