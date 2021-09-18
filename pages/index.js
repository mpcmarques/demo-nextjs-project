import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { login, setSession, checkLogin } from "./api";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../store/actions/auth";
import ErrorMessage from "../components/ErrorMessage";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user !== null) {
      router.replace("/dashboard");
    } else {
      try {
        const token = window.localStorage.getItem("token");

        if (token != null && token !== "") {
          const fetchLogin = async () => {
            const res = await checkLogin(token);

            if (res) {
              dispatch(userLogin(res));
            }
          };
          fetchLogin();
        }

        setLoadingPage(false);
      } catch (e) {
        setError(e);
        setLoadingPage(false);
      }
    }
  }, [user]);

  const fetchLogin = async () => {
    if (email !== "" && password !== "") {
      try {
        // start loading
        setLoadingLogin(true);

        const data = await login(email, password);

        // set session
        localStorage.setItem("token", data.token.token);

        // call redux to save user data
        dispatch(userLogin(data.user));

        // stop loading
        setLoadingLogin(false);
      } catch (e) {
        setError(e);
        setLoadingLogin(false);
      }
    }
  };

  if (loadingPage) return null;

  return (
    <div className="flex">
      <div className="card">
        <div className="flex justify-center">
          <Image
            src="/../public/download.svg"
            alt="Logo"
            width="100%"
            height={100}
            className="w-full"
          />
        </div>
        <h1 className="text-xl font-semibold">Login</h1>
        <h4 className="text-gray-500">E-mail</h4>
        <input
          type="text"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-input"
        ></input>
        <h4 className="text-gray-500">Senha</h4>
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-input"
        ></input>
        <button
          className="btn btn-blue"
          onClick={fetchLogin}
          disabled={loadingLogin}
        >
          {!loadingLogin ? "Entrar" : "Carregando"}
        </button>

        <ErrorMessage error={error} />

        <Link href="/cadastro">Não possui uma conta? Cadastre-se aqui!</Link>
      </div>
    </div>
  );
}
