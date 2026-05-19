import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { bootstrapApp } from './src/app/bootstrap';

export default function App() {
  useEffect(() => {
    // App起動時の初期化（DB/通知/通知同期）
    bootstrapApp();
  }, []);

  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}
