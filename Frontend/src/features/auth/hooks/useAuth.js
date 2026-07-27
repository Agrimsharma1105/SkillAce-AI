import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, logout, register } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setloading } = context;

    const handlelogin = async ({ email, password }) => {
        setloading(true);

        try {
            const data = await login({ email, password });
            setUser(data.user);
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setloading(true);

        try {
            const data = await register({ username, email, password });
            setUser(data.user);
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false);
        }
    };

    const handleLogout = async () => {
        setloading(true);

        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        async function getAndSetUser() {
            setloading(true);

            try {
                const data = await getMe();
                setUser(data.user);
            } catch (error) {
                console.log(error);
                setUser(null);
            } finally {
                setloading(false);
            }
        }

        getAndSetUser();
    }, []);

    return {
        user,
        loading,
        handlelogin,
        handleLogout,
        handleRegister,
    };
};