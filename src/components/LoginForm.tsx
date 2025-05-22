import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const auth = getAuth();
    const navigate = useNavigate();

    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signInWithGoogle = async () => {
        setAuthing(true);

        signInWithPopup(auth, new GoogleAuthProvider())
            .then((response) => {
                console.log(response.user.uid);
                navigate("/");
            })
            .catch((err) => {
                toast.error("Error signing in with Google", {
                    description: "Please try again later",
                    style: {
                        background: "#FEF2F2",
                        color: "#B91C1C",
                        borderLeft: "4px solid #DC2626",
                    },
                });

                setAuthing(false);
            });
    };

    const signInWithEmail = async () => {
        setAuthing(true);

        signInWithEmailAndPassword(auth, email, password)
            .then((response) => {
                console.log(response.user.uid);
                navigate("/");
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error signing in with email", {
                    description: "Check your email and password",
                    style: {
                        background: "#FEF2F2",
                        color: "#B91C1C",
                        borderLeft: "4px solid #DC2626",
                    },
                });
                setAuthing(false);
            });
    };
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="Youtr password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={authing}
                                onClick={signInWithEmail}
                            >
                                {authing ? "Logging in..." : "Login"}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                disabled={authing}
                                onClick={signInWithGoogle}
                            >
                                Login with Google
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a
                                href="/register"
                                className="underline underline-offset-4"
                            >
                                Sign up
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
