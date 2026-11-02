/**
 * 102nd 雄女校慶與運動會／園遊會 官方網站
 * 主應用程式入口
 */
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ImageModal } from './components/ImageModal';
import { HomePage } from './pages/HomePage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { SchedulePage } from './pages/SchedulePage';
import { HonorRollPage } from './pages/HonorRollPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { LiveNewsPage } from './pages/LiveNewsPage';
import { WeekActivitiesPage } from './pages/WeekActivitiesPage';
import { AlbumsPage } from './pages/AlbumsPage';
import { BoothsPage } from './pages/BoothsPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';

const MainApp: React.FC = () => {
  const { currentRoute } = useApp();

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'activities':
        return <ActivitiesPage />;
      case 'schedule':
        return <SchedulePage />;
      case 'honor':
        return <HonorRollPage />;
      case 'interviews':
        return <InterviewsPage />;
      case 'livenews':
        return <LiveNewsPage />;
      case 'weekactivities':
        return <WeekActivitiesPage />;
      case 'albums':
        return <AlbumsPage />;
      case 'booths':
        return <BoothsPage />;
      case 'admini2t2':
      case 'login':
        return <LoginPage />;
      case 'admin':
        return <AdminPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  const isFullBleed = ['home', 'activities', 'schedule', 'honor', 'interviews', 'livenews', 'weekactivities', 'albums', 'booths'].includes(currentRoute);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f2] text-[#342d27] antialiased selection:bg-[#cff0eb] selection:text-[#09013d]">
      {/* 頂部跑馬燈與標題列 */}
      <Header />

      {/* 側邊抽屜選單 (側欄) */}
      <Sidebar />

      {/* 核心內容區 (首頁直角滿版無邊距，清除畫面邊緣空隙) */}
      <main
        className={`flex-1 w-full ${
          isFullBleed
            ? 'max-w-none px-0 py-0'
            : 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8'
        }`}
      >
        {renderCurrentPage()}
      </main>


      {/* 頁尾 */}
      <Footer />

      {/* 圖片滿版 Lightbox Modal */}
      <ImageModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
