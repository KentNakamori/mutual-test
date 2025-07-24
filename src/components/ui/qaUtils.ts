// QA関連の共通ユーティリティ関数

/**
 * 決算期をフォーマットする（表示用）
 * @param fiscalPeriod "2024-3-Q3" 形式の文字列
 * @returns "2024年３月期Q３" 形式の文字列
 */
export const formatFiscalPeriod = (fiscalPeriod: string): string => {
  if (!fiscalPeriod || fiscalPeriod.trim() === '') {
    return '未選択';
  }
  
  // 旧形式（2024-Q3）の場合は従来通り表示
  if (fiscalPeriod.match(/^\d{4}-Q\d+$/)) {
    return fiscalPeriod.replace(/(\d{4})-Q(\d+)/, '$1年Q$2');
  }
  
  // 新形式（2024-3-Q3）の場合は新しい表示形式
  const match = fiscalPeriod.match(/^(\d{4})-(\d{1,2})-Q(\d+)$/);
  if (match) {
    const [, year, month, quarter] = match;
    return `${year}年${month}月期Q${quarter}`;
  }
  
  return fiscalPeriod;
};

/**
 * 決算期の文字列を分解する
 * @param fiscalPeriod "2024-3-Q3" 形式の文字列
 * @returns { year: string, month: string, quarter: string }
 */
export const parseFiscalPeriod = (fiscalPeriod: string): { year: string; month: string; quarter: string } => {
  if (!fiscalPeriod || fiscalPeriod.trim() === '') {
    return { year: '', month: '', quarter: '' };
  }
  
  // 旧形式（2024-Q3）の場合
  const oldMatch = fiscalPeriod.match(/^(\d{4})-Q(\d+)$/);
  if (oldMatch) {
    const [, year, quarter] = oldMatch;
    return { year, month: '', quarter };
  }
  
  // 新形式（2024-3-Q3）の場合
  const newMatch = fiscalPeriod.match(/^(\d{4})-(\d{1,2})-Q(\d+)$/);
  if (newMatch) {
    const [, year, month, quarter] = newMatch;
    return { year, month, quarter };
  }
  
  return { year: '', month: '', quarter: '' };
};

/**
 * 年・月・Qから決算期の文字列を作成する
 * @param year 年度
 * @param month 月
 * @param quarter 四半期
 * @returns "2024-3-Q3" 形式の文字列
 */
export const createFiscalPeriod = (year: string, month: string, quarter: string): string => {
  if (!year) return '';
  
  if (!month && !quarter) return year;
  if (!month && quarter) return `${year}-Q${quarter}`;
  if (month && !quarter) return `${year}-${month}`;
  
  return `${year}-${month}-Q${quarter}`;
};

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
  // 企業名のマッピングロジック（実際の実装に応じて調整）
  const companyMap: Record<string, string> = {
    'comp1': 'Company A',
    'comp2': 'Company B',
    'comp3': 'Company C',
  };
  
  return companyMap[companyId] || companyId;
}; 