import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Left side with background and testimonial */}
      <div className="hidden lg:flex lg:w-1/2 bg-hotel-primary flex-col justify-between p-12">
        <div>
          <img 
            src="/anlak-white.png" 
            alt="Anlak Logo" 
            className="w-32 h-auto"
          />
        </div>
        <div className="text-white">
          <blockquote className="text-2xl font-light mb-4">
            "This hotel strategy simulator has helped countless managers improve their decision-making skills and deliver better results for their properties."
          </blockquote>
          <cite className="text-lg">Hotel Management Expert</cite>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="lg:hidden mb-8">
              <img 
                src="/anlak.png" 
                alt="Anlak Logo" 
                className="w-32 h-auto mx-auto"
              />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to access your account
            </p>
          </div>
          <div className="mt-8">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#4FA89B',
                      brandAccent: '#3D857A',
                    },
                  },
                },
                className: {
                  container: 'w-full',
                  button: 'w-full px-4 py-2 text-white rounded-md',
                  input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hotel-primary focus:border-transparent',
                },
              }}
              theme="light"
              providers={[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;