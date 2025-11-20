import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../../auth";
import { useNavigate } from "react-router-dom";


export function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
const [remember, setRemember] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login({
        username,
        password,
        client_id: clientId,
        client_secret: clientSecret,
        remember,
      });
      navigate("/dashboard/home");
    } catch (err) {
      console.error("Login error:", err?.response?.data || err);
      setError("Λάθος στοιχεία ή πρόβλημα σύνδεσης.");
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your username
            </Typography>
            <Input
              size="lg"
              placeholder="username"
              value={username}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Client ID
            </Typography>
            <Input
              size="lg"
              placeholder="client_id"
              value={clientId}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={(e) => setClientId(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Client Secret
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={clientSecret}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
                onChange={(e) => setClientSecret(e.target.value)}
            />
          </div>
          <Checkbox
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            label="Remember me"
          />
          {error && (
            <Typography variant="small" color="red" className="text-center mt-2">
              {error}
            </Typography>
          )}

          <Button type="submit" className="mt-6" fullWidth>
            Sign In
          </Button>
         
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default SignIn;
