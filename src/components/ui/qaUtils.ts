// QA関連の共通ユーティリティ関数

/**
 * エラーオブジェクトから適切なエラーメッセージを抽出する
 */
export const extractErrorMessage = (error: unknown): string => {
  // エラーメッセージを取得（シンプルなアプローチ）
  let errorMessage = "AI回答の生成に失敗しました。もう一度お試しください。";
  
  // エラーの文字列表現を取得
  const errorString = String(error);
  console.log("Error string:", errorString);
  
  // エラーメッセージから具体的な内容を抽出
  if (errorString.includes('の情報が見つかりません')) {
    // "Error: 決算期 2025-Q3 の情報が見つかりません" から "決算期 2025-Q3 の情報が見つかりません" を抽出
    const match = errorString.match(/Error: (.+)/);
    const specificMessage = match ? match[1] : errorString;
    errorMessage = `${specificMessage}\n別の決算期を選択してください。`;
  } else if (errorString.includes('決算期')) {
    const match = errorString.match(/Error: (.+)/);
    const specificMessage = match ? match[1] : errorString;
    errorMessage = `${specificMessage}\n決算期の設定を確認してください。`;
  } else if (errorString.includes('Error: ')) {
    const match = errorString.match(/Error: (.+)/);
    const specificMessage = match ? match[1] : errorString;
    errorMessage = `エラーが発生しました: ${specificMessage}`;
  }
  
  console.log("Final error message:", errorMessage);
  return errorMessage;
};

/**
 * AI生成ボタンの有効/無効状態とツールチップを取得する
 */
export const getAIButtonStatus = (
  question: string,
  fiscalPeriod: string,
  answer: string
): { disabled: boolean; tooltip: string } => {
  const issues = [];
  
  if (!question || question.trim() === '') {
    issues.push('質問内容を入力してください');
  }
  if (!fiscalPeriod || fiscalPeriod.trim() === '') {
    issues.push('決算期を選択してください');
  }
  if (answer && answer.trim() !== '') {
    issues.push('回答内容が既に入力されています');
  }
  
  if (issues.length > 0) {
    return { disabled: true, tooltip: issues.join('\n') };
  }
  
  return { disabled: false, tooltip: '' };
};

/**
 * 日付をフォーマットする
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * 企業名を取得する
 */
export const getCompanyName = (companyId: string): string => {
  const companyMap: Record<string, string> = {
    comp1: 'テック・イノベーターズ株式会社',
    comp2: 'グリーンエナジー株式会社',
  };
  return companyMap[companyId] || companyId;
}; 