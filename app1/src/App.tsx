import { useMsal, useIsAuthenticated, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { loginRequest } from './config/authConfig';
import { SimpleChat } from './components/SimpleChat';

function App() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => {
      console.error(e);
    });
  };

  const handleLogout = () => {
    instance.logoutPopup().catch(e => {
      console.error(e);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mixtral Chat (Privat)</h1>
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span> {accounts[0]?.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main>
        <AuthenticatedTemplate>
          <SimpleChat />
        </AuthenticatedTemplate>
        
        <UnauthenticatedTemplate>
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <h2 className="text-3xl mb-4">Bitte einloggen</h2>
            <p className="text-gray-600 mb-8">Diese App ist nur für autorisierte Nutzer</p>
            <button
              onClick={handleLogin}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg"
            >
              Mit Microsoft anmelden
            </button>
          </div>
        </UnauthenticatedTemplate>
      </main>
    </div>
  );
}

export default App;