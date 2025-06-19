import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserRole } from "@/api/auth";

const SignupForm = ({ changeTab }: { changeTab: (tab: string) => void }) => {
  const { signup, isLoading } = useAuthStore();

  const [searchParams] = useSearchParams();
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "parent" as UserRole,
  });

  // Pre-fill email from URL parameters if available
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setSignupData((prev) => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setSignupData((prev) => ({ ...prev, role: value as UserRole }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupData.name?.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!signupData.email?.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!signupData.password) {
      toast.error("Please enter a password");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const response = await signup(
        signupData.email.trim().toLowerCase(),
        signupData.password,
        signupData.name.trim(),
        signupData.role
      );

      if (response && "error" in response) {
        toast.error(response.error);
      } else {
        toast.success("Account created successfully!");
        changeTab("login");
        setSignupData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "parent",
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error?.message || "An error occurred during signup");
    }
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your information to create your BlitzBoard Stats account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Full Name</Label>
            <Input
              id='name'
              name='name'
              type='text'
              value={signupData.name}
              onChange={handleSignupChange}
              placeholder='Enter your full name'
              required
              disabled={isLoading}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='signup-email'>Email</Label>
            <Input
              id='signup-email'
              name='email'
              type='email'
              value={signupData.email}
              onChange={handleSignupChange}
              placeholder='your.email@example.com'
              required
              disabled={isLoading}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='role'>Role</Label>
            <Select
              value={signupData.role}
              onValueChange={handleRoleChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select your role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.GUARDIAN}>
                  Parent/Guardian
                </SelectItem>
                <SelectItem value={UserRole.COACH}>Head Coach</SelectItem>
                <SelectItem value={UserRole.COACH}>Assistant Coach</SelectItem>
                <SelectItem value={UserRole.COACH}>Statistician</SelectItem>
                <SelectItem value={UserRole.PLAYER}>Player</SelectItem>
                <SelectItem value='fan'>Fan</SelectItem>
                <SelectItem value='referee'>Referee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='signup-password'>Password</Label>
            <Input
              id='signup-password'
              name='password'
              type='password'
              value={signupData.password}
              onChange={handleSignupChange}
              placeholder='Choose a secure password (min 6 characters)'
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirm-password'>Confirm Password</Label>
            <Input
              id='confirm-password'
              name='confirmPassword'
              type='password'
              value={signupData.confirmPassword}
              onChange={handleSignupChange}
              placeholder='Confirm your password'
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
