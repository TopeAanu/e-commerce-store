"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/ui/use-toast";
import {
  signUpWithEmailAndPassword,
  signInWithGoogle,
} from "../../app/lib/firebase/auth";

function generateCode(length = 6) {
  return Math.random()
    .toString()
    .slice(2, 2 + length);
}

// Updated function to use API route with Nodemailer
async function sendConfirmationEmail(email: string, code: string) {
  const response = await fetch("/api/send-verification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to send verification email");
  }

  return response.json();
}

export default function SignUpPage() {
  const [step, setStep] = useState<"input" | "verify">("input");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const generatedCode = generateCode();
    setCodeSent(generatedCode);

    try {
      await sendConfirmationEmail(email, generatedCode);
      setStep("verify");
      toast({
        title: "Verification code sent",
        description: `Check your email (${email}) for a confirmation code.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to send email",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (enteredCode !== codeSent) {
      toast({
        title: "Invalid code",
        description: "The confirmation code you entered is incorrect.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await signUpWithEmailAndPassword(email, password, name);
      toast({
        title: "Account created",
        description: "You can now log in.",
      });
      router.push("/signin");
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add resend functionality
  const handleResendCode = async () => {
    setIsLoading(true);
    const newCode = generateCode();
    setCodeSent(newCode);

    try {
      await sendConfirmationEmail(email, newCode);
      toast({
        title: "Code resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container px-4 py-12 flex justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">
            Sign up to get started with NextShop
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            Sign up with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {step === "input" ? (
            <form onSubmit={handleInitialSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending code..." : "Send Confirmation Code"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Confirmation Code</Label>
                  <Input
                    id="code"
                    placeholder="Enter 6-digit code"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    required
                    maxLength={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    Code sent to {email}
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Confirm & Sign Up"}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-sm"
                >
                  Didn't receive the code? Resend
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setStep("input")}
                  disabled={isLoading}
                  className="text-sm"
                >
                  ← Back to edit details
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Button variant="link" className="p-0 h-auto" asChild>
            <a href="/signin">Sign in</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
