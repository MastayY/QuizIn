import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export interface IAuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider: React.FunctionComponent<IAuthProviderProps> = (props) => {
    const { children } = props;
    const auth = getAuth();
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoading(false);
            } else {
                console.log('unauthorized');
                setLoading(false);
                navigate('/login')
            }
        });
        return () => unsubscribe();
    }, [auth, navigate]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-800"></div>
        </div>
    );

    return <div>{ children }</div>;

}

export default AuthProvider