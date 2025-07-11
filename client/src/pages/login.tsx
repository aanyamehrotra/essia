"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { useToast } from "../hooks/use-toast";
import { useAuthContext } from "../context/auth-context";
import { apiRequest } from "../lib/queryClient";

const loginSchema = z.object({
  email: z.string().email({ message: "📧 Invalid email address" }),
  password: z.string().min(6, { message: "🔐 Password must be at least 6 characters" }),
});

type LoginData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { refetchUser } = useAuthContext();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/users/login", data);

      const token = response.token;
      console.log("🔐 Received Token:", token);

      if (token) {
        localStorage.setItem("token", token);
      }

      return response;
    },

    onSuccess: async () => {
      await refetchUser();
      await queryClient.invalidateQueries();

      const hasShownToast = sessionStorage.getItem('login-toast-shown');
      if (!hasShownToast) {
        toast({
          title: '🎉 Welcome back!',
          description: "You're now logged in ✅",
          variant: 'success',
        });
        sessionStorage.setItem('login-toast-shown', 'true');
      }

      setLocation('/');
    },

    onError: (error) => {
      toast({
        title: "🚨 Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const onInvalid = (errors: typeof form.formState.errors) => {
    const firstError = Object.values(errors).find(
      (err): err is { message?: string } =>
        !!err && typeof err === "object" && "message" in err
    );

    if (firstError?.message) {
      toast({
        title: "⚠️ Validation Error",
        description: firstError.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="shadow-lg border-purple-200 dark:border-purple-800">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-xl sm:text-2xl text-purple-900 dark:text-purple-100">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-purple-600 dark:text-purple-300 text-sm sm:text-base">
              Sign in to your Essia account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-4 sm:space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800 dark:text-purple-200 text-sm">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                          className="border-purple-300 focus:border-purple-500 dark:border-purple-600 h-10 sm:h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800 dark:text-purple-200 text-sm">
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter your password"
                          {...field}
                          className="border-purple-300 focus:border-purple-500 dark:border-purple-600 h-10 sm:h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white h-10 sm:h-11 text-sm sm:text-base"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm text-purple-600 dark:text-purple-300">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-purple-800 hover:text-purple-900 dark:text-purple-200 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}