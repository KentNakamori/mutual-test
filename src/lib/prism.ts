let isLoaded = false;
let loadingPromise: Promise<void> | null = null;

export const loadPrismComponents = async (): Promise<void> => {
  // 既に読み込み済みの場合は何もしない
  if (isLoaded) {
    return;
  }

  // 読み込み中の場合は、その Promise を返す
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      // 基本のPrismJSを読み込み
      const Prism = await import('prismjs');

      // 基本言語を先に読み込み（依存関係なし）
      await import('prismjs/components/prism-css');
      await import('prismjs/components/prism-json');
      await import('prismjs/components/prism-bash');
      await import('prismjs/components/prism-sql');
      await import('prismjs/components/prism-python');
      await import('prismjs/components/prism-java');

      // JavaScriptを読み込み（他の言語の基盤）
      await import('prismjs/components/prism-javascript');

      // TypeScriptはJavaScriptに依存
      await import('prismjs/components/prism-typescript');

      // JSXはJavaScriptに依存
      await import('prismjs/components/prism-jsx');

      // TSXはTypeScriptとJSXに依存するため最後に読み込み
      await import('prismjs/components/prism-tsx');

      console.log('PrismJSコンポーネントの読み込みが完了しました');
      isLoaded = true;

      // ブラウザ環境でハイライトを実行
      if (typeof window !== 'undefined' && Prism.default?.highlightAll) {
        Prism.default.highlightAll();
      }
    } catch (error) {
      console.error('PrismJSコンポーネントの読み込みに失敗しました:', error);
      // エラーが発生した場合は Promise をリセット（再試行可能にする）
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
};

// 読み込み状態をリセットする関数（テスト用）
export const resetPrismLoader = (): void => {
  isLoaded = false;
  loadingPromise = null;
}; 