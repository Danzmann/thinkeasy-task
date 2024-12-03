import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  Button,
  Input,
  Box,
  Heading,
  Checkbox,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";

import {
  authTokenState,
  refreshTokenState,
  userInfoState,
} from "@/state/atoms";
import { signup, login } from "@/api/auth";
import {
  deleteLocalStorage,
  setLocalStorage,
} from "@/utils/localStorageHandler";

const AuthPage = () => {
  const signupForm = useForm({
    mode: "onSubmit",
  });
  const loginForm = useForm({
    mode: "onSubmit",
  });

  const router = useRouter();

  const setAuthToken = useSetRecoilState(authTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);
  const setUserInfo = useSetRecoilState(userInfoState);

  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (data: any, isSignup: boolean) => {
    try {
      const authData = isSignup
        ? await signup({
            email: data.email,
            password: data.password,
            firstname: data.firstname,
            lastname: data.lastname,
          })
        : await login({ email: data.email, password: data.password });

      setAuthToken(authData.accessToken);
      setRefreshToken(authData.refreshToken);

      if (rememberMe) {
        setLocalStorage({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          // There is no api to fetch user data so here it is, the DIY version :D
          userInfo: data.email,
        });
      } else {
        deleteLocalStorage();
      }

      setUserInfo({ email: data.email });
      router.push("/");
    } catch (error: any) {
      let errorMessage = "An error occurred. Please try again.";
      // Some errors come as an array
      if (error.message && Array.isArray(error.message)) {
        errorMessage = error.message.join(", ");
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handleError = () => {
    toast.error("Please fix the missing fields.", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  useEffect(() => {
    const userLoggedOut = sessionStorage.getItem("userHasBeenLoggedOut");
    if (userLoggedOut === "true") {
      sessionStorage.removeItem("userHasBeenLoggedOut");
      toast.warning("You have been logged out", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <Box className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
        <Heading as="h1" size="lg" className="text-center mb-4">
          Auth Page
        </Heading>

        <Tabs variant="enclosed">
          <TabList>
            <Tab>Login</Tab>
            <Tab>Signup</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <form
                onSubmit={loginForm.handleSubmit(
                  (data) => onSubmit(data, false),
                  handleError,
                )}
              >
                <FormControl
                  isInvalid={!!loginForm.formState.errors.email}
                  className="mb-4"
                >
                  <Input
                    {...loginForm.register("email", {
                      required: "Email is required",
                    })}
                    placeholder="Email"
                  />
                  <FormErrorMessage>
                    {loginForm.formState.errors.email?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={!!loginForm.formState.errors.password}
                  className="mb-4"
                >
                  <Input
                    {...loginForm.register("password", {
                      required: "Password is required",
                    })}
                    type="password"
                    placeholder="Password"
                  />
                  <FormErrorMessage>
                    {loginForm.formState.errors.password?.message}
                  </FormErrorMessage>
                </FormControl>

                <Checkbox
                  isChecked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                  className="mb-4"
                >
                  Remember Me
                </Checkbox>
                <Button type="submit" colorScheme="teal" className="w-full">
                  Login
                </Button>
              </form>
            </TabPanel>
            <TabPanel>
              <form
                onSubmit={signupForm.handleSubmit((data) =>
                  onSubmit(data, true),
                )}
              >
                <FormControl
                  isInvalid={!!signupForm.formState.errors.firstname}
                  className="mb-4"
                >
                  <Input
                    {...signupForm.register("firstname", {
                      required: "First name is required",
                    })}
                    placeholder="First Name"
                  />
                  <FormErrorMessage>
                    {signupForm.formState.errors.firstname?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={!!signupForm.formState.errors.lastname}
                  className="mb-4"
                >
                  <Input
                    {...signupForm.register("lastname", {
                      required: "Last name is required",
                    })}
                    placeholder="Last Name"
                  />
                  <FormErrorMessage>
                    {signupForm.formState.errors.lastname?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={!!signupForm.formState.errors.email}
                  className="mb-4"
                >
                  <Input
                    {...signupForm.register("email", {
                      required: "Email is required",
                    })}
                    placeholder="Email"
                  />
                  <FormErrorMessage>
                    {signupForm.formState.errors.email?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={!!signupForm.formState.errors.password}
                  className="mb-4"
                >
                  <Input
                    {...signupForm.register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    type="password"
                    placeholder="Password"
                  />
                  <FormErrorMessage>
                    {signupForm.formState.errors.password?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={!!signupForm.formState.errors.confirmPassword}
                  className="mb-4"
                >
                  <Input
                    {...signupForm.register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === signupForm.getValues("password") ||
                        "Passwords do not match",
                    })}
                    type="password"
                    placeholder="Confirm Password"
                  />
                  <FormErrorMessage>
                    {signupForm.formState.errors.confirmPassword?.message}
                  </FormErrorMessage>
                </FormControl>

                <Checkbox
                  isChecked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                  className="mb-4"
                >
                  Remember Me
                </Checkbox>
                <Button type="submit" colorScheme="blue" className="w-full">
                  Signup
                </Button>
              </form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <ToastContainer />
    </div>
  );
};

export default AuthPage;
