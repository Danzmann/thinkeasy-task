import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  authTokenState,
  refreshTokenState,
  userInfoState,
} from "@/state/atoms";
import { signup, login } from "@/api/auth";
import { Button, Input, Box, Heading, Text } from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/checkbox";

const AuthPage = () => {
  const signupForm = useForm(); // For signup form
  const loginForm = useForm(); // For login form
  const router = useRouter();
  const [authToken, setAuthToken] = useRecoilState(authTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

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

      if (data.rememberMe) {
        localStorage.setItem("refreshToken", authData.refreshToken);
      } else {
        localStorage.removeItem("refreshToken");
      }

      setUserInfo({ email: data.email });
      router.push("/");
    } catch (error: any) {
      alert(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <Box className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
        <Heading as="h1" size="lg" className="text-center mb-4">
          Auth Page
        </Heading>

        <form
          onSubmit={signupForm.handleSubmit((data) => onSubmit(data, true))}
        >
          <Input
            {...signupForm.register("firstname")}
            placeholder="First Name"
            className="mb-2"
          />
          <Input
            {...signupForm.register("lastname")}
            placeholder="Last Name"
            className="mb-2"
          />
          <Input
            {...signupForm.register("email", { required: true })}
            placeholder="Email"
            className="mb-2"
          />
          <Input
            {...signupForm.register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="mb-2"
          />
          {/*<Checkbox {...signupForm.register("rememberMe")} className="mb-4">
            Remember Me
          </Checkbox>**/}
          <Button type="submit" colorScheme="blue" className="w-full">
            Signup
          </Button>
        </form>

        <Text className="text-center mt-4 mb-4">or</Text>

        <form
          onSubmit={loginForm.handleSubmit((data) => onSubmit(data, false))}
        >
          <Input
            {...loginForm.register("email", { required: true })}
            placeholder="Email"
            className="mb-2"
          />
          <Input
            {...loginForm.register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="mb-4"
          />
          <Button type="submit" colorScheme="teal" className="w-full">
            Login
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default AuthPage;

/*const NewAuthPage = () => <div>Simple Auth Page</div>;

export default NewAuthPage;*/
