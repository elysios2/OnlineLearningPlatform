import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export function AuthModals() {
  const {
    isLoginModalOpen,
    isRegisterModalOpen,
    closeLoginModal,
    closeRegisterModal,
    openLoginModal,
    openRegisterModal,
  } = useAuth();

  return (
    <>
      <Dialog open={isLoginModalOpen} onOpenChange={closeLoginModal}>
        <DialogContent className="sm:max-w-[425px]">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
              <TabsTrigger
                value="register"
                onClick={() => {
                  closeLoginModal();
                  setTimeout(() => {
                    openRegisterModal();
                  }, 100);
                }}
              >
                Crear cuenta
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onClose={closeLoginModal} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterModalOpen} onOpenChange={closeRegisterModal}>
        <DialogContent className="sm:max-w-[425px]">
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="login"
                onClick={() => {
                  closeRegisterModal();
                  setTimeout(() => {
                    openLoginModal();
                  }, 100);
                }}
              >
                Iniciar sesión
              </TabsTrigger>
              <TabsTrigger value="register">Crear cuenta</TabsTrigger>
            </TabsList>
            <TabsContent value="register">
              <RegisterForm onClose={closeRegisterModal} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
