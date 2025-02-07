interface MeetingFormData {
    investorId: string;
    date: string;
    time: string;
    status: string;
    notes: string;
  }
  
  interface ValidationErrors {
    [key: string]: string;
  }
  
  export const validateMeeting = (data: MeetingFormData): ValidationErrors => {
    const errors: ValidationErrors = {};
  
    if (!data.investorId) {
      errors.investorId = '投資家を選択してください';
    }
  
    if (!data.date) {
      errors.date = '日付を入力してください';
    } else {
      const selectedDate = new Date(`${data.date}T${data.time || '00:00'}`);
      if (isNaN(selectedDate.getTime())) {
        errors.date = '無効な日付です';
      }
    }
  
    if (!data.time) {
      errors.time = '時間を入力してください';
    }
  
    if (!['scheduled', 'in_progress', 'completed', 'cancelled'].includes(data.status)) {
      errors.status = '無効なステータスです';
    }
  
    return errors;
  };
  
  export const validateMeetingDateTime = (date: Date, investorId: string): Promise<boolean> => {
    return fetch(`/api/v1/meetings/check-availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: date.toISOString(),
        investorId,
      }),
    })
    .then(response => response.json())
    .then(data => data.available)
    .catch(() => false);
  };