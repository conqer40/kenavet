import type {Metadata,Viewport} from 'next';
import './globals.css';
import {ServiceWorker} from '@/components/service-worker';
export const metadata:Metadata={title:{default:'KENAVET | إدارة المناديب والعمليات الميدانية',template:'%s | KENAVET'},description:'نظام KENAVET لإدارة المناديب والمبيعات والعمليات الميدانية البيطرية',authors:[{name:'محمد الحاوي'}],creator:'محمد الحاوي',manifest:'/manifest.webmanifest',appleWebApp:{capable:true,statusBarStyle:'default',title:'KENAVET'}};
export const viewport:Viewport={themeColor:'#176b55',width:'device-width',initialScale:1,viewportFit:'cover'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl" suppressHydrationWarning><body>{children}<ServiceWorker/></body></html>}
