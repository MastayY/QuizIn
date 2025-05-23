import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";

export function RegisterForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const auth = getAuth();
    const navigate = useNavigate();

    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const signUpWithGoogle = async () => {
        setAuthing(true);

        signInWithPopup(auth, new GoogleAuthProvider())
            .then((response) => {
                console.log(response.user.uid);
                navigate("/");
            })
            .catch(() => {
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

    const signUpWithEmail = async () => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match", {
                description: "Please try again",
                style: {
                    background: "#FEF2F2",
                    color: "#B91C1C",
                    borderLeft: "4px solid #DC2626",
                },
            });
            return;
        }

        setAuthing(true);

        createUserWithEmailAndPassword(auth, email, password)
            .then(response => {
                console.log(response.user.uid);
                navigate("/");
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error signing up with email", {
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
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                        Enter your email below to register to your account
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
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="confirm-password">
                                        Confirm Password
                                    </Label>
                                </div>
                                <Input
                                    id="confirm-password"
                                    type="confirm-password"
                                    required
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={authing}
                                onClick={signUpWithEmail}
                            >
                                {authing ? "Logging in..." : "Register"}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                disabled={authing}
                                onClick={signUpWithGoogle}
                            >
                                Register with Google
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Have an account?{" "}
                            <a
                                href="/login"
                                className="underline underline-offset-4"
                            >
                                Sign In
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
