import React, { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  authTokenState,
  refreshTokenState,
  userInfoState,
} from "@/state/atoms";
import { signup, login } from "@/api/auth";

const Home = () => {
  const [authToken, setAuthToken] = useRecoilState(authTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [error, setError] = useState<string | null>(null);

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    setError(null); // Clear previous error
    try {
      const authData = await signup(signupData);
      setAuthToken(authData.accessToken);
      setRefreshToken(authData.refreshToken);
      setUserInfo({ email: signupData.email });
      alert("Signup successful!");
    } catch (error: any) {
      setError(error.message || "Failed to signup. Please try again.");
    }
  };

  const handleLogin = async () => {
    setError(null); // Clear previous error
    try {
      const authData = await login(loginData);
      setAuthToken(authData.accessToken);
      setRefreshToken(authData.refreshToken);
      setUserInfo({ email: loginData.email });
      alert("Login successful!");
    } catch (error: any) {
      setError(error.message || "Failed to login. Please try again.");
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setRefreshToken(null);
    setUserInfo({ email: null });
  };

  return (
    <div style={{ padding: "2rem" }}>
      {authToken ? (
        <div>
          <h1>Welcome {userInfo.email}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "2rem" }}>
          <div>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <h2>Signup</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
            />
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={signupData.firstname}
              onChange={handleSignupChange}
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={signupData.lastname}
              onChange={handleSignupChange}
            />
            <button onClick={handleSignup}>Signup</button>
          </div>

          <div>
            <h2>Login</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
            />
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
