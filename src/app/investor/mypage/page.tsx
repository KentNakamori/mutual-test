"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";
import MyPageTabMenu from "@/components/features/investor/mypage/MyPageTabMenu";
import { ProfileData, NotificationSetting } from "@/types";
import { Home, Heart, Search, MessageSquare, User } from 'lucide-react';
import { getInvestorUser, updateInvestorUser, deleteInvestorAccount } from "@/lib/api";

// サイドバーのメニュー項目
const menuItems = [
  { label: 'トップページ', link: '/investor/companies', icon: <Home size={20} /> },
  { label: "フォロー済み企業", link: "/investor/companies/followed", icon: <Heart size={20} /> },
  { label: 'Q&A検索', link: '/investor/qa', icon: <Search size={20} /> },
  { label: 'チャットログ', link: '/investor/chat-logs', icon: <MessageSquare size={20} /> },
  { label: 'マイページ', link: '/investor/mypage', icon: <User size={20} /> },
];

const MyPage = () => {
  const router = useRouter();
  // Auth0 SDK v4の認証状態
  const { user, error: userError, isLoading: userLoading } = useUser();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "notification" | "delete">("profile");

  // プロフィールデータの取得
  useEffect(() => {
    const fetchProfile = async () => {
      if (userLoading) return;
      
      if (!user) {
        // 未認証の場合はログインページにリダイレクト
        router.push('/api/auth/login');
        return;
      }
      
      setIsLoading(true);
      try {
        // API関数を使用してプロフィールデータを取得
        // プロキシ経由でJWTをバックエンドに送信する
        // Auth0 SDK v4ではトークンはプロキシ側で取得される
        const data = await getInvestorUser("token-placeholder");
        console.log('取得したプロフィールデータ:', data);
        
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error('プロフィール取得エラー:', err);
        setError(err instanceof Error ? err : new Error('プロフィールの取得に失敗しました'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, userLoading, router]);

  const handleSaveProfile = async (updatedProfile: ProfileData) => {
    try {
      console.log('更新前のプロフィール:', updatedProfile);
      
      // Auth0 SDK v4では、プロキシ側でJWTを取得する
      const data = await updateInvestorUser("token-placeholder", updatedProfile);
      console.log('更新後のレスポンス:', data);
      
      if (data && data.updatedProfile) {
        setProfile(data.updatedProfile);
      } else {
        console.error('更新後のプロフィールデータが無効です:', data);
        throw new Error('更新後のプロフィールデータが無効です');
      }
    } catch (err) {
      console.error('プロフィール更新エラー:', err);
      throw err;
    }
  };

  const handleChangePassword = async (currentPass: string, newPass: string) => {
    try {
      // Auth0 SDK v4の場合、パスワード変更は Auth0 Management API 経由で行うことが推奨されますが、
      // ここでは簡略化のためにAPIを呼び出さずにログだけ出力します
      console.log('パスワード変更:', { currentPass, newPass });
      
      // 成功した場合は処理を完了
      return Promise.resolve();
    } catch (err) {
      console.error('パスワード変更エラー:', err);
      throw err;
    }
  };

  const handleSaveNotification = async (newSetting: NotificationSetting) => {
    try {
      // API関数を使用して通知設定を更新
      // 注: 通知設定のAPI関数が未実装の場合は、後で実装してください
      console.log('通知設定の更新:', newSetting);
    } catch (err) {
      console.error('通知設定更新エラー:', err);
      throw err;
    }
  };

  const handleDeleteAccount = async (password: string) => {
    const confirmed = window.confirm("本当に退会しますか？ この操作は取り消せません。");
    if (!confirmed) return;
    
    try {
      // Auth0 SDK v4の場合、アカウント削除は管理者APIを通じて行う必要があります
      // プロキシを使用してバックエンドからAPIを呼び出す
      await deleteInvestorAccount("token-placeholder");
      
      // アカウント削除後はログアウトしてトップページにリダイレクト
      router.push('/api/auth/logout');
    } catch (err) {
      console.error('アカウント削除エラー:', err);
      throw err;
    }
  };

  // 認証エラー表示
  if (userError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">認証エラーが発生しました</p>
          <button 
            onClick={() => router.push('/api/auth/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            再ログイン
          </button>
        </div>
      </div>
    );
  }

  // ローディング表示
  if (userLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">エラーが発生しました: {error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  // プロフィールがまだ取得できていない場合
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">プロフィール情報を取得できません</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          isCollapsible
          menuItems={menuItems}
          selectedItem="/investor/mypage"
          onSelectMenuItem={(link) => router.push(link)}
        />
        <main className="flex-1 container mx-auto p-4">
          <h1 className="text-2xl font-semibold mb-4">マイページ</h1>
          <MyPageTabMenu
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
            profileData={profile}
            onSaveProfile={handleSaveProfile}
            onChangePassword={handleChangePassword}
            onSaveNotification={handleSaveNotification}
            onDeleteAccount={handleDeleteAccount}
          />
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: "利用規約", href: "/terms" },
          { label: "プライバシーポリシー", href: "/privacy" },
        ]}
        copyrightText="MyApp Inc."
        onSelectLink={(href) => router.push(href)}
      />
    </div>
  );
};

export default MyPage;
