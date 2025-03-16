import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, MessageSquare, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AuthModal() {
  const { authenticate } = useApp();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Функция для отправки кода подтверждения
  const handleSendCode = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите корректный номер телефона",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Имитация отправки SMS
    setTimeout(() => {
      setIsCodeSent(true);
      setIsLoading(false);
      toast({
        title: "Код отправлен",
        description: `Код подтверждения отправлен на номер ${phoneNumber}`,
      });
    }, 1500);
  };

  // Функция для входа по коду
  const handleLogin = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите 6-значный код подтверждения",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Имитация проверки кода
    setTimeout(() => {
      // Генерация данных пользователя на основе номера телефона
      const mockUser = {
        id: phoneNumber.replace(/[^0-9]/g, ''),
        first_name: 'Пользователь',
        last_name: phoneNumber.slice(-4),
        username: `user${phoneNumber.slice(-6)}`,
        photo_url: null,
        auth_date: Math.floor(Date.now() / 1000)
      };
      
      authenticate(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  // Функция для тестового входа (режим разработки)
  const handleTestLogin = () => {
    const mockUser = {
      id: '123456789',
      first_name: 'Тестовый',
      last_name: 'Пользователь',
      username: 'testuser',
      photo_url: null,
      auth_date: Math.floor(Date.now() / 1000)
    };
    authenticate(mockUser);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Добро пожаловать в NearMe</h2>
            <p className="text-neutral-600 mb-6">Найдите людей поблизости с помощью своего телефона</p>
            
            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="phone">Телефон</TabsTrigger>
                <TabsTrigger value="test">Тестовый вход</TabsTrigger>
              </TabsList>
              
              <TabsContent value="phone">
                <div className="space-y-4">
                  {!isCodeSent ? (
                    <>
                      <div className="text-left">
                        <label className="text-sm font-medium mb-1 block">Номер телефона</label>
                        <Input
                          type="tel"
                          placeholder="+7 (999) 123-45-67"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="py-6"
                        />
                      </div>
                      <Button 
                        onClick={handleSendCode} 
                        disabled={isLoading}
                        className="w-full py-6"
                      >
                        {isLoading ? (
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <MessageSquare className="mr-2 h-5 w-5" />
                        )}
                        Получить код
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-left">
                        <label className="text-sm font-medium mb-1 block">Код подтверждения</label>
                        <Input
                          type="text"
                          placeholder="123456"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                          className="py-6 text-center text-xl tracking-wider"
                          maxLength={6}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Код отправлен на номер {phoneNumber}
                        </p>
                      </div>
                      <Button 
                        onClick={handleLogin} 
                        disabled={isLoading}
                        className="w-full py-6"
                      >
                        {isLoading ? (
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <LogIn className="mr-2 h-5 w-5" />
                        )}
                        Войти
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => setIsCodeSent(false)}
                        className="w-full mt-2"
                      >
                        Изменить номер телефона
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="test">
                <div className="space-y-4">
                  <Button 
                    variant="default" 
                    className="w-full py-6 bg-primary hover:bg-primary/90"
                    onClick={handleTestLogin}
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Тестовый вход
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Эта опция доступна только для тестирования и разработки
                  </p>
                </div>
              </TabsContent>
              
              <div className="text-sm text-neutral-600 mt-6">
                <p>Продолжая, вы соглашаетесь с нашими</p>
                <p>
                  <a href="#" className="text-primary hover:underline">Условиями использования</a> и{" "}
                  <a href="#" className="text-primary hover:underline">Политикой конфиденциальности</a>
                </p>
              </div>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
