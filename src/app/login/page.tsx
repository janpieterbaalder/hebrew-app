"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          if (error.message.includes("already registered")) {
            setError("Dit e-mailadres is al geregistreerd.");
          } else if (error.message.includes("Password")) {
            setError("Wachtwoord moet minimaal 6 tekens bevatten.");
          } else {
            setError("Registratie mislukt. Probeer het opnieuw.");
          }
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message.includes("Invalid login")) {
            setError("Ongeldig e-mailadres of wachtwoord.");
          } else {
            setError("Inloggen mislukt. Probeer het opnieuw.");
          }
          return;
        }
      }

      router.push("/");
    } catch {
      setError("Er is een fout opgetreden. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="gradient-card rounded-2xl p-8 border border-green-darkest/30 shadow-xl shadow-black/30">
          <div className="text-center mb-8">
            <span className="hebrew text-4xl text-green">עב</span>
            <h1 className="text-2xl font-bold text-green-lightest mt-2">
              {isRegister ? "Registreren" : "Inloggen"}
            </h1>
            <p className="text-green-light/60 text-sm mt-1">
              {isRegister
                ? "Maak een account aan om je voortgang op te slaan"
                : "Log in om verder te gaan met leren"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-green-light mb-1.5"
              >
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="naam@voorbeeld.nl"
                className="w-full px-4 py-2.5 bg-surface border border-green-darkest/50 rounded-lg text-green-lightest placeholder:text-green-light/30 focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-green-light mb-1.5"
              >
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Minimaal 6 tekens"
                className="w-full px-4 py-2.5 bg-surface border border-green-darkest/50 rounded-lg text-green-lightest placeholder:text-green-light/30 focus:outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 gradient-green rounded-lg text-white font-semibold shadow-md shadow-green-darkest/50 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Even geduld..."
                : isRegister
                  ? "Registreren"
                  : "Inloggen"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-sm text-green hover:text-green-light transition-colors"
            >
              {isRegister
                ? "Heb je al een account? Inloggen"
                : "Nog geen account? Registreren"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
