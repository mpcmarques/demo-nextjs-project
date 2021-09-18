import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { registerUser, setSession } from "./api";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../store/actions/auth";
import ErrorMessage from "../components/ErrorMessage";

const Cadastro = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user !== null) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const signUp = async () => {
    if (name != "" && password != "" && email != "") {
      try {
        // start loading
        setLoading(true);

        const request = await registerUser(name, email, password);

        alert("Created user " + request.user.name);

        // set session
        localStorage.setItem("token", request.token.token);

        // call redux to save user data
        dispatch(userLogin(request.user));

        // stop loading
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    } else {
      alert("All fields must be filled.");
    }
  };

  return (
    <div className="flex">
      <div className="card">
        <h1 className="text-xl font-semibold">Cadastro</h1>
        <h4 className="text-gray-500">Nome</h4>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-input"
        ></input>
        <h4 className="text-gray-500">Email</h4>
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

        <button className="btn btn-green" onClick={signUp} disabled={loading}>
          {!loading ? "Cadastrar" : "Carregando..."}
        </button>

        <ErrorMessage error={error} />

        <Link href="/" className="btn">
          Voltar a tela de login
        </Link>
      </div>
    </div>
  );
};

export default Cadastro;
