"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "../components/ui/card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { PasswordInput } from "../components/ui/password-input";
import { getApiErrorMessage } from "../lib/error";

const registerSchema = z
  .object({
    email: z.string().email({ message: "📧 Invalid email address" }),
    password: z.string().min(6, { message: "🔐 Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "❗ Please confirm your password" }),
    firstName: z.string().min(1, { message: "👤 First name is required" }),
    lastName: z.string().min(1, { message: "👤 Last name is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "🔁 Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterData = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      return await apiRequest("POST", "/api/users/signup", {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "🎉 Account Created!",
        description: "You can now log in and start shopping.",
        variant: "success",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error);
      toast({
        title: "🚨 Registration Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: RegisterData) {
    registerMutation.mutate(data);
  }

  const onInvalid = (errors: typeof form.formState.errors) => {
    const firstFieldError = Object.values(errors).find(
      (err): err is { message?: string } => !!err && typeof err === "object" && "message" in err
    );

    if (firstFieldError?.message) {
      toast({
        title: "⚠️ Validation Error",
        description: firstFieldError.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-purple-200 dark:border-purple-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-900 dark:text-purple-100">
              Create Account
            </CardTitle>
            <CardDescription className="text-purple-600 dark:text-purple-300">
              Join Essia and start shopping
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-800 dark:text-purple-200">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="First name"
                            {...field}
                            className="border-purple-300 focus:border-purple-500 dark:border-purple-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-800 dark:text-purple-200">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Last name"
                            {...field}
                            className="border-purple-300 focus:border-purple-500 dark:border-purple-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800 dark:text-purple-200">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                          className="border-purple-300 focus:border-purple-500 dark:border-purple-600"
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
                      <FormLabel className="text-purple-800 dark:text-purple-200">Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Create a password"
                          {...field}
                          className="border-purple-300 focus:border-purple-500 dark:border-purple-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800 dark:text-purple-200">Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Re-enter your password"
                          {...field}
                          className="border-purple-300 focus:border-purple-500 dark:border-purple-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center">
              <p className="text-sm text-purple-600 dark:text-purple-300">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-800 hover:text-purple-900 dark:text-purple-200 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
