import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Logged in successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center geo-bg bg-background">
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary/90 px-8 py-8 text-center">
            <h1 className="text-2xl font-bold font-display text-primary-foreground">
              Welcome to <span className="font-extrabold">AdminAI</span>
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              {isSignUp ? "Create your admin account" : "Admin Login to Dashboard"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5 px-8 py-8">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary border-border text-foreground"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary border-border text-foreground"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wide"
              disabled={loading}
            >
              {loading ? "Please wait..." : isSignUp ? "SIGN UP" : "LOGIN"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Login" : "Sign Up"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
