import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

interface LoginFormProps {
  onToggle: () => void;
}

const LoginForm = ({ onToggle }: LoginFormProps) => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();

  // Pre-fill email from URL parameters if available
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      toast.success("Login successful!");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An error occurred during login";

      toast.error(errorMessage);
    }
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Blitz In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Enter your email'
              disabled={isLoading}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Enter your password'
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? "Loading..." : "Blitz In"}
          </Button>
        </form>

        <div className='mt-4 text-center'>
          <Button
            variant='link'
            onClick={onToggle}
            className='text-sm'
            disabled={isLoading}
          >
            Don't have an account? Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
